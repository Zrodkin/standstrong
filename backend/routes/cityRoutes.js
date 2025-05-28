import express from 'express';
import City from '../models/City.js'; // City model now only has 'name'
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/cities — List all city names and their IDs
router.get('/', async (req, res, next) => {
  try {
    // Select only name and _id. Frontend registration form will need _id to store in User.city.
    const cities = await City.find({}).select('name _id').sort({ name: 1 }); 
    res.json(cities);
  } catch (err) {
    console.error('Error fetching cities:', err);
    next(err);
  }
});

// POST /api/cities — Admin adds a new city name
router.post('/', protect, admin, async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'City name is required.' });
    }

    // Case-insensitive check for existing city
    const existingCity = await City.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (existingCity) {
      return res.status(409).json({ message: 'City with this name already exists.' });
    }

    const city = new City({ name }); // Create city with name only
    await city.save();

    res.status(201).json(city);
  } catch (err) {
    console.error('Error creating city:', err);
    // Handle MongoDB duplicate key error (if a unique index is on 'name')
    if (err.code === 11000) { 
        return res.status(409).json({ message: 'A city with this name already exists.' });
    }
    next(err);
  }
});

// DELETE /api/cities/:id — Admin deletes a city name
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    // Future consideration: You might want to check if any User or Class
    // records reference this city's _id before allowing deletion.
    // For now, direct deletion is fine.
    res.json({ message: 'City deleted successfully' });
  } catch (err) {
    console.error('Error deleting city:', err);
    next(err);
  }
});

export default router;