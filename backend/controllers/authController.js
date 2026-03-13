export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
  
      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role }, // Incluye el rol en el token
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
      );
  
      res.status(200).json({
        message: 'Inicio de sesión exitoso',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          roles: [user.role] // Enviar roles como array
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
  };
  