require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { hash } = require('bcryptjs');

async function createAdmin() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('Error: MONGODB_URI no está definida en .env.local');
        return;
    }

    console.log('Conectando a MongoDB...');
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Conexión exitosa a MongoDB');

        const db = client.db(process.env.MONGODB_DB || 'marketplace');
        console.log('Usando base de datos:', db.databaseName);

        // Verificar si el admin ya existe
        const existingAdmin = await db.collection('users').findOne({
            email: 'ronaldllamas17@gmail.com'
        });

        if (existingAdmin) {
            console.log('El administrador ya existe en la base de datos');
            return;
        }

        // Crear el admin
        const hashedPassword = await hash('Oddie12', 12);
        const result = await db.collection('users').insertOne({
            email: 'ronaldllamas17@gmail.com',
            password: hashedPassword,
            nombre: 'Administrador',
            role: 'admin',
            createdAt: new Date()
        });

        console.log('Administrador creado exitosamente con ID:', result.insertedId);
    } catch (error) {
        console.error('Error al crear administrador:', error);
    } finally {
        await client.close();
        console.log('Conexión cerrada');
    }
}

createAdmin(); 