const express = require('express');
const router = express.Router();
const Imagenes = require('../Model/imagenes');
const axios = require("axios");

const cloudinary = require("cloudinary").v2;
const formidable = require("formidable");

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/", async (req, res) => {
    try {
        // Usar formidable para manejar los datos multipart/form-data
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({ message: "Error al procesar la solicitud", error: err });
            }

            const { usuario, descripcion } = fields;
            const imageFile = files.image;
            console.log(`usuario: ${usuario}\ndescripcion: ${descripcion}\nimagen: ${imageFile}`);
            if (!usuario) {
                return res.status(400).json({ message: "Faltan datos obligatorios (usuario)" });
            } else if (!descripcion) {
                return res.status(400).json({ message: "Faltan datos obligatorios (descripcion)" });
            } else if (!imageFile) {
                return res.status(400).json({ message: "Faltan datos obligatorios (imagen)" });
            }

            try {
                // Subir la imagen a Cloudinary
                const uploadResult = await cloudinary.uploader.upload(imageFile[0].filepath, {
                    folder: "PhotoNet",
                    transformation: [
                        {
                            quality: "auto",
                            fetch_format: "auto",
                        },
                        {
                            width: 300,
                            height: 300,
                            crop: "fill",
                            gravity: "auto",
                        },
                    ],
                });

                if (!uploadResult || !uploadResult.secure_url) {
                    throw new Error("No se pudo obtener la URL segura de la imagen");
                }

                return res.status(200).json({
                    message: "Imagen subida y guardada con éxito",
                    url: uploadResult.secure_url,
                });

            } catch (error) {
                console.error("Error al subir la imagen o al hacer PUT:", error);
                return res.status(500).json({
                    message: "Error al subir la imagen o al guardar los datos",
                    error: error.message,
                });
            }

        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
});

// Crear una nueva imagen
router.post('/new', async (req, res) => {
    try {
        const { usuario, url, descripcion } = req.body;

        // Extraer hashtags de la descripción
        const hashtags = descripcion.match(/#[a-zA-Z0-9_]+/g) || [];

        const nuevaImagen = new Imagenes({ usuario, url, descripcion, hashtags });
        await nuevaImagen.save();
        res.status(201).json(nuevaImagen);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Leer todas las imágenes
router.get('/', async (req, res) => {
    try {
        const imagenes = await Imagenes.find().sort({ likes: -1 }); // Ordenadas por likes
        res.status(200).json(imagenes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Leer una imagen por ID
router.get('/:id', async (req, res) => {
    try {
        const imagen = await Imagenes.findById(req.params.id);
        if (!imagen) return res.status(404).json({ error: 'Imagen no encontrada' });
        res.status(200).json(imagen);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar descripción de una imagen
router.put('/:id', async (req, res) => {
    try {
        const { descripcion } = req.body;

        // Extraer nuevos hashtags
        const hashtags = descripcion.match(/#[a-zA-Z0-9_]+/g) || [];

        const imagenActualizada = await Imagenes.findByIdAndUpdate(
            req.params.id,
            { descripcion, hashtags },
            { new: true }
        );
        if (!imagenActualizada) return res.status(404).json({ error: 'Imagen no encontrada' });
        res.status(200).json(imagenActualizada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar una imagen
router.delete('/:id', async (req, res) => {
    try {
        const imagenEliminada = await Imagenes.findByIdAndDelete(req.params.id);
        if (!imagenEliminada) return res.status(404).json({ error: 'Imagen no encontrada' });
        res.status(200).json({ message: 'Imagen eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dar like a una imagen
router.post('/:id/like', async (req, res) => {
    try {
        const imagen = await Imagenes.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } },
            { new: true }
        );
        if (!imagen) return res.status(404).json({ error: 'Imagen no encontrada' });
        res.status(200).json(imagen);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Filtrar por hashtags
router.get('/filter/:hashtag', async (req, res) => {
    const { hashtag } = req.params; // Obtener el hashtag de la consulta
    if (!hashtag) {
        return res.status(400).json({ message: "El hashtag es requerido" });
    }
    try {
        const images = await Imagenes.find({ hashtags: { $elemMatch: { $regex: hashtag, $options: "i" } } });
        res.status(200).json(images);
    } catch (error) {
        console.error("Error al filtrar imágenes:", error);
        res.status(500).json({ message: "Error al filtrar imágenes" });
    }
});

module.exports = router;
