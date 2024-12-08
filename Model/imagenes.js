const mongoose = require('mongoose');
const connectBD = require("../bd");

connectBD().then(() => {
    console.log("BD de Mongo disponible");
}).catch((error) => {
    console.log("Error al conectar a Mongo " + error);
});

const ImagenesSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true // Identificador del usuario que sube la imagen
    },
    url: {
        type: String,
        required: true // URL de la imagen almacenada
    },
    descripcion: {
        type: String,
        required: true // Breve texto descriptivo, puede incluir hashtags
    },
    hashtags: {
        type: [String], // Lista de hashtags extraídos de la descripción
        default: []
    },
    likes: {
        type: Number,
        default: 0 // Número de likes que ha recibido la imagen
    },
    fechaSubida: {
        type: Date,
        default: Date.now // Fecha de subida de la imagen
    }
}, { collection: 'imagenes' });

module.exports = mongoose.model('Imagenes', ImagenesSchema);
