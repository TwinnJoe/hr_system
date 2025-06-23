import jwt from 'jsonwebtoken';
const JWT_SECRET = 'b09468ec194ad88321d71c83d4ff51844a52b288c932c23ad0fe9470859ccc62c244b12cce0b188fd27da28422530db787e99919ae754b031b104a26638281ae';

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // expects 'Bearer <token>'

  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });

    req.user = user;
    next();
  });
};
