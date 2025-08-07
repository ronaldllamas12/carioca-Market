const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Carga las variables de entorno desde el archivo .env
require('dotenv').config({ path: './.env' });

async function createAdmin() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Por favor, define la variable de entorno MONGODB_URI en tu archivo .env');
  }
  if (!process.env.MONGODB_DB) {
    throw new Error('Por favor, define la variable de entorno MONGODB_DB en tu archivo .env');
  }

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const usersCollection = db.collection('users');

    const adminEmail = 'admin@example.com';
    const adminPassword = 'password123';

    // Verificar si el usuario ya existe
    const existingUser = await usersCollection.findOne({ email: adminEmail });
    if (existingUser) {
      console.log('El usuario administrador ya existe.');
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Crear el usuario administrador
    await usersCollection.insertOne({
      email: adminEmail,
      password: hashedPassword,
      nombre: 'Admin',
      role: 'admin',
      createdAt: new Date(),
    });

    console.log('Usuario administrador creado exitosamente.');

  } catch (error) {
    console.error('Error al crear el usuario administrador:', error);
  } finally {
    await client.close();
  }
}

createAdmin();
