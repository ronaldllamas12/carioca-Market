const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
    console.error('Error: MONGODB_URI no está definida en el archivo .env');
    process.exit(1);
}

async function testConnection() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log('✅ Conexión exitosa a MongoDB');
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        console.log('Colecciones en la base de datos:', collections.map(c => c.name));
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error);
    } finally {
        await client.close();
    }
}

testConnection(); 