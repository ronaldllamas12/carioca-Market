const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/marketplace';
const DEFAULT_ADMIN = 'ronaldllamas17@gmail.com';

async function fixAdminEmail() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db();
        const result = await db.collection('comercios').updateMany(
            { $or: [{ adminEmail: { $exists: false } }, { adminEmail: '' }] },
            { $set: { adminEmail: DEFAULT_ADMIN } }
        );
        console.log(`Comercios actualizados: ${result.modifiedCount}`);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
    }
}

fixAdminEmail(); 