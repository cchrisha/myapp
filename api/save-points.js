// import { connectToDB } from '../../db.js';
// import { ObjectId } from 'mongodb';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

//   const { userId, points } = req.body;
//   if (!userId || points === undefined) return res.status(400).json({ message: 'Kulang ang datos ng puntos.' });

//   try {
//     const db = await connectToDB();
//     await db.collection('users').updateOne(
//       { _id: new ObjectId(userId) },
//       { $set: { points } }
//     );
//     res.json({ message: 'Matagumpay na na-update ang iyong puntos.' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Hindi naisave ang puntos.' });
//   }
// }
import { connectToDB } from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Method not allowed' });

  const { userId, points } = req.body;
  if (!userId || points === undefined)
    return res.status(400).json({ message: 'Kulang ang datos ng puntos.' });

  try {
    const db = await connectToDB();
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { points } }
    );

    res.json({ message: 'Matagumpay na na-update ang iyong puntos.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Hindi naisave ang puntos.' });
  }
}
