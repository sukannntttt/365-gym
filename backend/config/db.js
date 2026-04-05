const mongoose = require('mongoose');

module.exports = async function connectDB() {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI not set in environment');

    const start = Date.now();
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
            maxPoolSize: 10,
            family: 4
        });
        console.log(`MongoDB connected (in ${Date.now() - start}ms)`);
    } catch (err) {
        console.error(`MongoDB connection failed after ${Date.now() - start}ms:`, err && err.message ? err.message : err);
        throw err;
    }
};