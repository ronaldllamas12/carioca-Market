require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function updateAdmin() {
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

        // Actualizar el usuario admin
        const hashedPassword = await bcrypt.hash('Oddie12', 10);
        const result = await db.collection('users').updateOne(
            { email: 'ronaldllamas17@gmail.com' },
            {
                $set: {
                    nombre: 'Administrador',
                    role: 'admin',
                    password: hashedPassword,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        );

        if (result.modifiedCount > 0) {
            console.log('Administrador actualizado exitosamente');
        } else {
            console.log('No se pudo actualizar el administrador');
        }

        // Verificar la actualización
        const admin = await db.collection('users').findOne({
            email: 'ronaldllamas17@gmail.com'
        });

        if (admin) {
            console.log('\nAdministrador actualizado:');
            console.log({
                email: admin.email,
                nombre: admin.nombre,
                role: admin.role,
                createdAt: admin.createdAt
            });
        }

    } catch (error) {
        console.error('Error al actualizar administrador:', error);
    } finally {
        await client.close();
        console.log('\nConexión cerrada');
    }
}

updateAdmin(); 