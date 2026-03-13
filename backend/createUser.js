import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// Definir el esquema de usuario
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createUser() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Verificar si ya existe
    const existingUser = await User.findOne({ email: 'admin@torrentio.com' });
    if (existingUser) {
      console.log('Usuario ya existe');
      process.exit(0);
    }

    // Crear usuario
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = new User({
      name: 'Administrador',
      email: 'admin@torrentio.com',
      password: hashedPassword,
      role: 'admin'
    });

    await user.save();
    console.log('Usuario creado exitosamente');
    console.log('Email: admin@torrentio.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createUser(); 