const express = require("express");
const pujasRouter = express.Router();
const Pujas = require("../Model/pujas");

// Validar datos de la puja
function validatePujaData(req, res, next) {
    const {comprador, cantidad_ofrecida } = req.body;
    if (!comprador || typeof comprador !== 'string' || !comprador.includes('@')) {
        return res.status(400).json({ message: "El email del comprador es requerido y debe ser válido." });
    }
    if (!cantidad_ofrecida || typeof cantidad_ofrecida !== 'number' || cantidad_ofrecida <= 0) {
        return res.status(400).json({ message: "La cantidad ofrecida es requerida y debe ser un número mayor a 0." });
    }
    next();
}

/////////////////////////////////CRUD/////////////////////////////////

// GET ALL
pujasRouter.get("/", async (req, res) => {
    try {
        const pujas = await Pujas.find();
        res.json(pujas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
 
// GET BY ID
pujasRouter.get("/:id", async (req, res) => {
    try {
        const puja = await Pujas.findById(req.params.id);
        if (!puja) {
            return res.status(404).json({ message: "Puja no encontrada" });
        }
        res.json(puja);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CREATE
pujasRouter.post("/", validatePujaData, async (req, res) => {
    const {comprador, cantidad_ofrecida } = req.body;
    const puja = new Pujas({
        comprador,
        cantidad_ofrecida
    });

    try {
        const nuevaPuja = await puja.save();
        res.status(201).json(nuevaPuja);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE 
pujasRouter.put("/:id", validatePujaData, async (req, res) => {
    try {
        const puja = await Pujas.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!puja) {
            return res.status(404).json({ message: "Puja no encontrada" });
        }
        res.json(puja);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE
pujasRouter.delete("/:id", async (req, res) => { 
    try {
        const puja = await Pujas.findByIdAndDelete(req.params.id);
        if (!puja) {
            return res.status(404).json({ message: "Puja no encontrada" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

////////////////////////FUNCIONALIDAD AVANZADA////////////////////////

module.exports = pujasRouter;
