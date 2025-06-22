const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env.local' }); // Cargar variables de entorno

// Usar la URI de Atlas desde las variables de entorno
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

async function createAdmin() {
    // Obtener argumentos de la línea de comandos
    const [name, email, password] = process.argv.slice(2);

    if (!name || !email || !password) {
        console.error('Por favor, proporciona nombre, email y contraseña como argumentos.');
        console.log('Ejemplo: node scripts/create-local-admin.js "Sandra Silgado" "sandra@test.com" "password123"');
        return;
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(dbName);

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el nuevo admin
        await db.collection('users').insertOne({
            nombre: name,
            email: email,
            password: hashedPassword,
            telefono: 'N/A', // O puedes añadirlo como cuarto argumento si quieres
            role: 'admin',
            createdAt: new Date()
        });

        console.log(`Usuario admin "${name}" creado exitosamente con el email "${email}".`);
    } catch (err) {
        console.error('Error al crear el admin:', err);
    } finally {
        await client.close();
    }
}

createAdmin(); 