// import { connectToDB } from '../../../db.js';
// import { ObjectId } from 'mongodb';

// export default async function handler(req, res) {
//   const { userId } = req.query;

//   try {
//     const db = await connectToDB();
//     const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
//     if (!user) return res.status(404).json({ message: 'Walang natagpuang account.' });

//     res.json({ points: user.points });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Nagkaroon ng problema sa server.' });
//   }
// }
