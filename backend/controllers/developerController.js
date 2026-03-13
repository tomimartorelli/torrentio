import Developer from '../models/Developer.js';

export const createDeveloper = async (req, res) => {
  try {
    const newDeveloper = new Developer(req.body);
    await newDeveloper.save();
    res.status(201).json(newDeveloper);
  } catch (error) {
    res.status(400).json({ message: 'Error creating developer', error });
  }
};

export const getAllDevelopers = async (req, res) => {
  try {
    const developers = await Developer.find();
    res.json(developers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching developers', error });
  }
};

export const getDeveloperById = async (req, res) => {
  try {
    const developer = await Developer.findById(req.params.name);
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }
    res.json(developer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching developer', error });
  }
};

export const updateDeveloper = async (req, res) => {
  try {
    const updatedDeveloper = await Developer.findOneAndUpdate(
      { name: req.params.name },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedDeveloper) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    res.json(updatedDeveloper);
  } catch (error) {
    res.status(400).json({ message: 'Error updating developer', error });
  }
};


export const deleteDeveloper = async (req, res) => {
  const { name } = req.params;

  try {
    const result = await Developer.deleteOne({ name });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Desarrollador no encontrado' });
    }
    
    res.status(200).json({ message: 'Desarrollador borrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al borrar el desarrollador', error });
  }
};

