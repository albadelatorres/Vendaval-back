// bd.js
const mongoose = require('mongoose');

async function connectBD() {
    const bdName = "parcial2";

    try {
        await mongoose.connect(`mongodb+srv://root:root@cluster0.jxb2l.mongodb.net/${bdName}`, {
        });
        console.log("Conexión a MongoDB realizada");
    } catch (error) {
        console.error("Conexión a MongoDB fallida:", error);
    }
}

module.exports = connectBD;
