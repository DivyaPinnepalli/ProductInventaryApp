import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  console.log('Auth header:', auth);

  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized: no Bearer token' });
  }
  const token = auth.split(' ')[1];
  try {
    // This will throw if secret is wrong or token is malformed
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log('JWT payload:', payload);

    req.user = await User.findById(payload.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized: user not found' });
    }
    next();
  } catch (err) {
    console.error('protect middleware error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
