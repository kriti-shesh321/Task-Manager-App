import dotenv from 'dotenv';
import jwt, { decode } from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.id;
        next();

    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authenticate;