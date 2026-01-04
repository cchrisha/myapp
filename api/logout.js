export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Method not allowed' });

  // With JWT, nothing to invalidate on the server
  res.json({ message: 'Token cleared on client — logged out' });
}
