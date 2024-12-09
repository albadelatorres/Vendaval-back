const express = require("express");
const articulosRouter = express.Router();
const Articulos = require("../Model/articulos");
const Pujas = require("../Model/pujas");


// Validar datos del artículo
function validateArticuloData(req, res, next) {
    const { vendedor, descripcion, precio_salida, imagenes } = req.body;
    if (!vendedor || typeof vendedor !== 'string' || !vendedor.includes('@')) {
        return res.status(400).json({ message: "El email del vendedor es requerido y debe ser válido." });
    }
    if (!descripcion || typeof descripcion !== 'string') {
        return res.status(400).json({ message: "La descripción es requerida y debe ser válida." });
    }
    if (!precio_salida || typeof precio_salida !== 'number' || precio_salida <= 0) {
        return res.status(400).json({ message: "El precio de salida es requerido y debe ser un número mayor a 0." });
    }
    if (imagenes && (!Array.isArray(imagenes) || !imagenes.every(url => typeof url === 'string'))) {
        return res.status(400).json({ message: "Las imágenes deben ser un array de URLs válidas." });
    }
    next();
}

/////////////////////////////////CRUD/////////////////////////////////

// GET ALL
articulosRouter.get("/", async (req, res) => {
    try {
        const articulos = await Articulos.find();
        res.json(articulos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET BY ID
articulosRouter.get("/:id", async (req, res) => {
    try {
        const articulo = await Articulos.findById(req.params.id);
        if (!articulo) {
            return res.status(404).json({ message: "Artículo no encontrado" });
        }
        res.json(articulo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CREATE
articulosRouter.post("/", validateArticuloData, async (req, res) => {
    const { vendedor, descripcion, precio_salida, imagenes, comprador } = req.body;
    const articulo = new Articulos({
        vendedor,
        descripcion,
        precio_salida,
        imagenes,
        comprador // Puede estar vacío si el artículo aún no está adjudicado
    });

    try {
        const nuevoArticulo = await articulo.save();
        res.status(201).json(nuevoArticulo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE 
articulosRouter.put("/:id", validateArticuloData, async (req, res) => {
    try {
        const articulo = await Articulos.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!articulo) {
            return res.status(404).json({ message: "Artículo no encontrado" });
        }
        res.json(articulo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE
articulosRouter.delete("/:id", async (req, res) => {
    try {
        const articulo = await Articulos.findByIdAndDelete(req.params.id);
        if (!articulo) {
            return res.status(404).json({ message: "Artículo no encontrado" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Puja mas alta
articulosRouter.get('/:id_articulo/puja_max', async (req, res) => {
    try {
        const { id_articulo } = req.params;
        const pujaMasGrande = await Pujas.findOne({ id_articulo })
            .sort({ cantidad_ofrecida: -1 })
            .limit(1);

        if (!pujaMasGrande) {
            return res.status(200).json(null); // o un objeto indicando que no hay pujas
        }

        res.status(200).json(pujaMasGrande);
    } catch (error) {
        console.error("Error al obtener la puja más grande:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

////////////////////////FUNCIONALIDAD AVANZADA////////////////////////

module.exports = articulosRouter;
