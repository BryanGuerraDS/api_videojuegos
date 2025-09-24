// index.js

import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

// Configuración de la app
const app = express();
const PORT = 8001; // Mantenemos el puerto

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a la base de datos que ya fue creada por setupDatabase.js
const db = new sqlite3.Database('./videojuegos.db', (err) => {
    if (err) {
        console.error("Error al abrir la base de datos:", err.message);
    } else {
        console.log("Conectado a la base de datos 'videojuegos.db'");
    }
});

// --- Rutas de la API ---

// GET /videojuegos: Obtener todos los videojuegos
app.get('/videojuegos', (req, res) => {
    const sql = "SELECT * FROM videojuegos";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ videojuegos: rows });
    });
});

// POST /videojuegos: Crear un nuevo videojuego
app.post('/videojuegos', (req, res) => {
    const { titulo, genero, plataforma, ano_lanzamiento } = req.body;
    if (!titulo || !genero) {
        return res.status(400).json({ error: "Los campos 'titulo' y 'genero' son obligatorios." });
    }
    const sql = "INSERT INTO videojuegos (titulo, genero, plataforma, ano_lanzamiento) VALUES (?, ?, ?, ?)";
    db.run(sql, [titulo, genero, plataforma, ano_lanzamiento], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, titulo, genero, plataforma, ano_lanzamiento });
    });
});

// PUT /videojuegos/:id: Actualizar un videojuego
app.put('/videojuegos/:id', (req, res) => {
    const { titulo, genero, plataforma, ano_lanzamiento } = req.body;
    const id = req.params.id;
    if (!titulo || !genero) {
        return res.status(400).json({ error: "Los campos 'titulo' y 'genero' son obligatorios." });
    }
    const sql = "UPDATE videojuegos SET titulo = ?, genero = ?, plataforma = ?, ano_lanzamiento = ? WHERE id = ?";
    db.run(sql, [titulo, genero, plataforma, ano_lanzamiento, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: `Videojuego con id ${id} no encontrado.` });
        }
        res.status(200).json({ message: "Videojuego actualizado correctamente." });
    });
});

// DELETE /videojuegos/:id: Eliminar un videojuego
app.delete('/videojuegos/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM videojuegos WHERE id = ?";
    db.run(sql, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: `Videojuego con id ${id} no encontrado.` });
        }
        res.status(200).json({ message: `Videojuego con id ${id} ha sido eliminado.` });
    });
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`API de Videojuegos corriendo en http://0.0.0.0:${PORT}`);
});