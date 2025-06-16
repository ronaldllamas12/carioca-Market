const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { getServerSession } = require('next-auth/next');
const { authOptions } = require('../auth/[...nextauth]/route');

// Esquema del producto
const productoSchema = new mongoose.Schema({
    nombre: String,
    precio: String,
    categoria: String,
    imagen: String,
    telefono: String,
    userId: String // Agregamos el ID del usuario que crea el producto
});

const Producto = mongoose.model('Producto', productoSchema);

// Middleware para verificar autenticación
const requireAuth = async (req, res, next) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    req.user = session.user;
    next();
};

// Obtener todos los productos (público)
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json({ productos });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Crear un nuevo producto (protegido)
router.post('/', requireAuth, async (req, res) => {
    try {
        const nuevoProducto = new Producto({
            ...req.body,
            userId: req.user.id
        });
        await nuevoProducto.save();

        // Emitir evento de nuevo producto
        const io = req.app.get('io');
        io.emit('nuevoProducto', nuevoProducto);

        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear producto' });
    }
});

module.exports = router; 