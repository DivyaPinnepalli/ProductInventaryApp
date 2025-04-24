import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validateRegisterUser,validateAuthUser } from '../validations/userValidator.js';
import express from 'express'

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


router.post("/signup", async (req,res)=>{
    console.log("signup")
    console.log(req.body);
    const { username, email, password } = req.body;
  
  const errors = validateRegisterUser(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(' ') });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user with the hashed password
    const user = await User.create({ username, email, password: hashedPassword });
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})


router.post("/login", async (req, res) => {
  console.log("Login payload:", req.body);

  const { email: rawEmail, password } = req.body;

  const email = rawEmail.trim();

  const errors = validateAuthUser({ email, password });
  if (errors.length > 0) {
    console.log("Validation errors:", errors);
    return res.status(400).json({ message: errors.join(' ') });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`No user found for email="${email}"`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log("Stored hash:", user.password);
    const match = await bcrypt.compare(password, user.password);
    console.log("Password match?", match);

    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Successful login
    const token = generateToken(user._id);
    console.log("Issuing token:", token);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
});


export default router;
