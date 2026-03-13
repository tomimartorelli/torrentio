import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');

    // Verificar si ya existe el usuario
    const existingUser = await User.findOne({ email: 'admin@torrentio.com' });
    if (existingUser) {
      console.log('El usuario de prueba ya existe');
      process.exit(0);
    }

    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const testUser = new User({
      name: 'Administrador',
      email: 'admin@torrentio.com',
      password: hashedPassword,
      role: 'admin'
    });

    await testUser.save();
    console.log('Usuario de prueba creado exitosamente');
    console.log('Email: admin@torrentio.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error creando usuario de prueba:', error);
    process.exit(1);
  }
};

createTestUser(); 