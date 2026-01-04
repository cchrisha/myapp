import bcrypt from 'bcryptjs';
import { connectToDB } from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Method not allowed' });

  const { name, age, grade_section, password } = req.body;

  // Validate required fields
  if (!name || !age || !grade_section || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const db = await connectToDB();

    // Check if name already exists
    const existingUser = await db.collection('users').findOne({ name });
    if (existingUser) return res.status(400).json({ message: 'Name already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    const result = await db.collection('users').insertOne({
      name,
      age,
      grade_section,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
