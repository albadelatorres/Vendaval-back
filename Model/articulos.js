const mongoose = require('mongoose');
const connectBD = require("../bd");

connectBD().then(()=>{
    console.log("BD de Mongo disponible");
}).catch((error) => {
    console.log("Error al conectar a Mongo "+ error);
});

const ArticulosSchema = new mongoose.Schema({
    vendedor: { type: String, required: true }, // Email del vendedor
    descripcion: { type: String, required: true }, // Descripción del artículo
    precio_salida: { type: Number, required: true }, // Precio inicial del artículo
    imagenes: { type: [String], required: false }, // URLs de imágenes del artículo
    comprador: { type: String, required: false } // Email del comprador, si el artículo está adjudicado
}, { 
    collection: 'articulos',
});


module.exports = mongoose.model('ArticulosSchema', ArticulosSchema);