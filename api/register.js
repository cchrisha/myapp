import bcrypt from 'bcryptjs';
import { connectToDB } from '../db.js';

export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Method not allowed' });

  try {
    const { name, age, grade_section, password, confirmPassword } = req.body || {};

    if (!name || !age || !grade_section || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const db = await connectToDB();

    const existingUser = await db.collection('users').findOne({
      name: { $regex: `^${name}$`, $options: 'i' }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Name already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection('users').insertOne({
      name: name.trim(),
      age: Number(age),
      grade_section: grade_section.trim(),
      password: hashedPassword,
      points: 0,
      unlocked_level: 1
    });

    return res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertedId.toString()
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: 'Server error' });
  }
}
