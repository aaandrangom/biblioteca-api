const express = require('express');
const router = express.Router();
const LibroPedido = require('../models/libro_pedido');

//Mostrar todos los libros pedidos
router.get('/', async (req, res) => {
    try {
        const librosPedidos = await LibroPedido.findAll();
        res.json(librosPedidos);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message, status: 500 });
    }
});

// Consultar libro_pedido por su lip_secuencial
router.get('/:id', async (req, res) => {
    try {
        const libroPedido = await LibroPedido.findByPk(req.params.id);

        if (libroPedido) {
            res.json(libroPedido);
        } else {
            res.status(404).json({ message: "Libro_pedido no encontrado" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message, status: 500 });
    }
});

// Crear un nuevo libro_pedido
router.post('/', async (req, res) => {
    try {
        const { lip_pedido, lip_libro, lip_codigo_unico_libro, lip_fecha_entrega_cliente, lip_fecha_devolucion, lip_estado } = req.body;

        const nuevoLibroPedido = await LibroPedido.create({
            lip_pedido,
            lip_libro,
            lip_codigo_unico_libro,
            lip_fecha_entrega_cliente,
            lip_fecha_devolucion,
            lip_estado
        });

        res.json(nuevoLibroPedido);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message, status: 500 });
    }
});

// Actualizar un registro en libro_pedido por su lip_secuencial
router.put('/:id', async (req, res) => {
    try {
        const { lip_pedido, lip_libro, lip_codigo_unico_libro, lip_fecha_entrega_cliente, lip_fecha_devolucion, lip_estado } = req.body;

        const resultado = await LibroPedido.update(
            {
                lip_pedido,
                lip_libro,
                lip_codigo_unico_libro,
                lip_fecha_entrega_cliente,
                lip_fecha_devolucion,
                lip_estado
            },
            {
                where: { lip_secuencial: req.params.id }
            }
        );

        if (resultado[0] > 0) {
            const libroPedidoActualizado = await LibroPedido.findByPk(req.params.id);
            res.json(libroPedidoActualizado);
        } else {
            res.status(404).json({ message: "Libro_pedido no encontrado" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message, status: 500 });
    }
});

// Eliminar un libro_pedido por su lip_secuencial
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await LibroPedido.destroy({
            where: { lip_secuencial: req.params.id }
        });

        if (resultado > 0) {
            res.json({ message: "Libro_pedido eliminado" });
        } else {
            res.status(404).json({ message: "Libro_pedido no encontrado" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message, status: 500 });
    }
});

module.exports = router;
