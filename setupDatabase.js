// setupDatabase.js

import sqlite3 from 'sqlite3';

const verboseSqlite3 = sqlite3.verbose();
const DBSOURCE = "videojuegos.db";

// Conectarse a la base de datos (la crea si no existe)
const db = new verboseSqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error("Error al conectar con la base de datos:", err.message);
        throw err;
    } else {
        console.log('Conectado a la base de datos de videojuegos.');
        
        // Consulta SQL para crear la tabla
        const sql = `
            CREATE TABLE IF NOT EXISTS videojuegos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                genero TEXT NOT NULL,
                plataforma TEXT,
                ano_lanzamiento INTEGER
            )
        `;

        // Ejecutar la consulta
        db.run(sql, (err) => {
            if (err) {
                console.error("Error al crear la tabla:", err.message);
            } else {
                console.log("Tabla 'videojuegos' creada o ya existente.");
                // Opcional: Insertar un dato de ejemplo
                // const insert = 'INSERT INTO videojuegos (titulo, genero, plataforma, ano_lanzamiento) VALUES (?,?,?,?)';
                // db.run(insert, ["The Legend of Zelda: Breath of the Wild", "Aventura", "Nintendo Switch", 2017]);
            }
        });
    }
});

// Cerrar la conexión
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Conexión a la base de datos cerrada.');
});