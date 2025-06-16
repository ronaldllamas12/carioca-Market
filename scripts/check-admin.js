require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function checkAdmin() {
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

        // Verificar si el admin existe
        const admin = await db.collection('users').findOne({
            email: 'ronaldllamas17@gmail.com'
        });

        if (admin) {
            console.log('Administrador encontrado:');
            console.log({
                email: admin.email,
                nombre: admin.nombre,
                role: admin.role,
                createdAt: admin.createdAt
            });
        } else {
            console.log('No se encontró el administrador en la base de datos');
        }

        // Listar todos los usuarios
        console.log('\nListando todos los usuarios:');
        const users = await db.collection('users').find({}).toArray();
        users.forEach(user => {
            console.log({
                email: user.email,
                nombre: user.nombre,
                role: user.role,
                createdAt: user.createdAt
            });
        });

    } catch (error) {
        console.error('Error al verificar administrador:', error);
    } finally {
        await client.close();
        console.log('\nConexión cerrada');
    }
}

checkAdmin(); 