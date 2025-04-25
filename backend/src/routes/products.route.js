import express from 'express';
import fetch from 'node-fetch';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/external/:barcode', async (req, res) => {
  const { barcode } = req.params;
  try {
    const resp = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await resp.json();
    if (data.status === 1) {
      const p = data.product;
      return res.json({
        name:        p.product_name || '',
        brand:       p.brands || '',
        category:    p.categories_tags?.join(', ') || '',
        unit:        p.quantity || '',
        mrp:         parseFloat(p.nutriments?.['energy-kcal_serving']) || 0,
        imageUrl:    p.image_url || '',
        description: p.generic_name || '',
      });
    }
    res.status(404).json({ message: 'Not found' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  const userId = req.user._id;
  const {
    barcode, name, brand, category, unit,
    mrp, imageUrl, description, discountedPrice, stock
  } = req.body;

  const categories = Array.isArray(category)
    ? category
    : (category || '').split(',').map(c => c.trim()).filter(Boolean);

  try {
    const product = await Product.findOneAndUpdate(
      { user: userId, barcode },
      {
        user:           userId,
        barcode, name, brand, category: categories,
        unit, mrp, imageUrl, description,
        discountedPrice, stock
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(product);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });
    res.json(products);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  console.log(req.params.id,"---",req.user._id)
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
