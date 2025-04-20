// import jwt from 'jsonwebtoken';
// import createError from 'http-errors';
// import User from '../db/models/User.js';

// const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

// const authenticate = async (req, res, next) => {
//   const header = req.headers.authorization || '';
//   const [type, token] = header.split(' ');
//   if (type !== 'Bearer' || !token)
//     return next(createError(401, 'Not authorized'));

//   try {
//     const { id } = jwt.verify(token, JWT_ACCESS_SECRET);
//     const user = await User.findById(id);
//     if (!user) return next(createError(401, 'Not authorized'));
//     req.user = user;
//     next();
//   } catch (err) {
//     next(createError(401, 'Access token expired'));
//   }
// };

// export default authenticate;
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw createHttpError(401, 'No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user; // Тут все ок
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Access token expired'));
    }
    next(createHttpError(401, 'Invalid access token'));
  }
};
