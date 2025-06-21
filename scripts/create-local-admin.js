const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/marketplace';

async function createAdmin() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db();
        // Eliminar cualquier admin anterior con ese email
        await db.collection('users').deleteMany({ email: 'ronaldllamas17@gmail.com', role: 'admin' });
        // Insertar el nuevo admin
        await db.collection('users').insertOne({
            nombre: 'Admin',
            email: 'ronaldllamas17@gmail.com',
            password: 'demo123',
            telefono: '123456789',
            role: 'admin',
            createdAt: new Date()
        });
        console.log('Usuario admin creado exitosamente.');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
    }
}

createAdmin(); 