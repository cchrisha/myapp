import bcrypt from 'bcryptjs';
import { connectToDB } from '../db.js'; // MongoDB connection

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Method not allowed' });

  const { name, age, grade_section, password } = req.body;
  if (!name || !age || !grade_section || !password)
    return res.status(400).json({ message: 'Punan lahat ng hinihinging impormasyon.' });

  try {
    const db = await connectToDB();

    const existingUser = await db.collection('users').findOne({ name });
    if (existingUser)
      return res.status(400).json({ message: 'May nakarehistrong pangalan na gamit na.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection('users').insertOne({
      name,
      age,
      grade_section,
      password: hashedPassword,
      points: 0,
      unlocked_level: 1
    });

    res.status(201).json({ message: 'Matagumpay kang nakapagrehistro!', userId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sa server.' });
  }
}
