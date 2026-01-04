import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDB } from '../db.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') 
    return res.status(405).json({ message: 'Method not allowed' });

  const { name, password } = req.body;

  if (!name || !password)
    return res.status(400).json({ message: 'Missing name or password' });

  try {
    const db = await connectToDB();

    // Hanapin user sa DB
    const user = await db.collection('users').findOne({ name });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // I-compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // JWT token
    const token = jwt.sign(
      { id: user._id.toString(), name: user.name },
      process.env.JWT_SECRET
    );

res.status(200).json({
  message: 'Login successful',
  token,
  user: {
    userId: user._id.toString(),  // <- add this
    name: user.name,
    age: user.age,
    grade_section: user.grade_section,
    points: user.points ?? 0,
    unlocked_level: user.unlocked_level ?? 1
  },
});


  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Server error' });
  }
}
