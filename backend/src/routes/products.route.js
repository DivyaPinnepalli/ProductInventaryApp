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
        name: p.product_name,
        brand: p.brands,
        category: p.categories_tags?.join(', '),
        unit: p.quantity,
        mrp: parseFloat(p.nutriments['energy-kcal_serving']) || 0,
        imageUrl: p.image_url,
        description: p.generic_name,
      });
    }
    res.status(404).json({ message: 'Not found' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/', async (req, res) => {
  console.log(req.user._id);
  const userId = req.user._id;
  const { barcode, name, brand, category, unit, mrp, imageUrl, description, discountedPrice, stock } = req.body;
  const categories = Array.isArray(category)
    ? category
    : (category || '').split(',').map(c => c.trim()).filter(Boolean);

  try {
    const product = await Product.findOneAndUpdate(
      { user: userId, barcode },
      {
        user: userId,
        barcode, name, brand,
        category: categories,
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

router.get('/getAllProducts', async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });
    res.json(products);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put('/:id', async (req, res) => {
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

export default router;

// router.get('/external/:barcode', async (req, res) => {
//   try {
//     console.log("request is coming")
//     const { barcode } = req.params;
//     console.log(barcode);
//     const resp = await fetch(
//       `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
//     );
//     const data = await resp.json();
    
    

//     if (data.status === 1) {
//       const p = data.product;

//       // const productData = {
//       //   barcode: barcode.toString(),
//       //   name: p.product_name || '',
//       //   brand: p.brands || '',
//       //   category: Array.isArray(p.categories_tags) ? p.categories_tags.join(', ') : '',
//       //   unit: p.quantity || '',
//       //   mrp: parseFloat(p.nutriments?.['energy-kcal_serving']) || 0,
//       //   image: p.image_url || '',
//       //   description: p.generic_name || '',
//       //   discountedPrice: 0, // you can set manually later
//       //   stockQuantity: 0,   // you can update later
//       // };
  
//       // // Save product
//       // const product = new Product(productData);
//       // await product.save();

//       return res.json({
//         barcode:barcode.toString(),
//         name: p.product_name,
//         brand: p.brands,
//         category: p.categories_tags?.join(', '),
//         unit: p.quantity,
//         mrp: parseFloat(p.nutriments['energy-kcal_serving']) || 0,
//         imageUrl: p.image_url,
//         description: p.generic_name,
//       });
//     }
//     res.status(404).json({ message: 'Not found' });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// });

// router.post('/', async (req, res) => {
//   try {
//     const {
//       barcode,
//       name,
//       brand,
//       category,         
//       unit,
//       mrp,
//       discountedPrice,
//       stock,
//       description,
//       imageUrl
//     } = req.body;

//     const productData = {
//       barcode,
//       name,
//       brand,
//       category: Array.isArray(category)
//         ? category
//         : (category || '').split(',').map(tag => tag.trim()).filter(Boolean),
//       unit,
//       mrp: Number(mrp) || 0,
//       discountedPrice: Number(discountedPrice) || 0,
//       stock: Number(stock) || 0,
//       description,
//       imageUrl,
//     };

//     // Upsert: if a product with this barcode exists, update it; otherwise, create it
//     const product = await Product.findOneAndUpdate(
//       { barcode },
//       productData,
//       { upsert: true, new: true, setDefaultsOnInsert: true }
//     );

//     return res.json(product);
//   } catch (e) {
//     console.error('Error saving product:', e);
//     return res.status(400).json({ message: e.message });
//   }
// });

// router.put('/:id', async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(product);
//   } catch (e) {
//     res.status(400).json({ message: e.message });
//   }
// });

// router.get('/getAllProducts', async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// });

// export default router;