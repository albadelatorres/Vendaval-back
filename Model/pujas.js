const mongoose = require('mongoose');
const connectBD = require("../bd");

connectBD().then(()=>{
    console.log("BD de Mongo disponible");
}).catch((error) => {
    console.log("Error al conectar a Mongo "+ error);
});

const PujasSchema = new mongoose.Schema({
    id_articulo: {type:String, required:true},
    comprador: { type: String, required: true }, // Email del comprador
    timestamp: { type: Date, default: Date.now }, // Fecha y hora de la puja
    cantidad_ofrecida: { type: Number, required: true } // Monto ofrecido en la puja
}, { 
    collection: 'pujas',
});


module.exports = mongoose.model('Pujas', PujasSchema);