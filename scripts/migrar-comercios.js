// scripts/migrar-comercios.js
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './.env' });

async function migrarComercios() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("Error: La variable de entorno MONGODB_URI no está definida.");
        process.exit(1);
    }

    const client = new MongoClient(uri);
    console.log("Conectando a la base de datos...");

    try {
        await client.connect();
        console.log("Conexión exitosa.");

        const database = client.db(process.env.MONGODB_DB || 'marketplace');
        const collection = database.collection('comercios');

        console.log("Buscando comercios que necesiten ser actualizados...");

        // Criterio: buscar documentos donde 'productosVenta' no exista o no sea un array.
        const filter = {
            $or: [
                { productosVenta: { $exists: false } },
                { productosVenta: { $not: { $type: "array" } } }
            ]
        };

        // Actualización: establecer 'productosVenta' como un array vacío.
        const updateDoc = {
            $set: {
                productosVenta: []
            }
        };

        const result = await collection.updateMany(filter, updateDoc);

        console.log(`\nMigración completada.`);
        console.log(`- Documentos encontrados que necesitaban actualización: ${result.matchedCount}`);
        console.log(`- Documentos actualizados exitosamente: ${result.modifiedCount}`);

        if (result.matchedCount === 0) {
            console.log("\n¡Todos tus comercios ya tienen la estructura correcta!");
        } else {
            console.log("\nSe ha actualizado la estructura de los comercios que lo necesitaban.");
        }

    } catch (err) {
        console.error("\nOcurrió un error durante la migración:", err);
    } finally {
        console.log("\nCerrando la conexión a la base de datos.");
        await client.close();
    }
}

migrarComercios();
