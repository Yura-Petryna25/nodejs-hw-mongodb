import createError from 'http-errors';
import bcrypt from 'bcryptjs';
import * as authService from '../services/auth.js';
import { generateTokens } from '../utils/token.js';

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await authService.findUserByEmail(email);
    if (userExists) throw createError(409, 'Email in use');

    const hash = await bcrypt.hash(password, 10);
    const user = await authService.createUser({ name, email, password: hash });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Помилка в register:', error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.findUserByEmail(email);
    if (!user) throw createError(401, 'Email or password is wrong');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createError(401, 'Email or password is wrong');

    const tokens = generateTokens(user._id);
    await authService.createSession(user._id, tokens);

    res
      .cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: { accessToken: tokens.accessToken },
      });
  } catch (error) {
    console.error('Помилка в login:', error);
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const session = await authService.findSessionByRefreshToken(refreshToken);
    if (!session) throw createError(401, 'Unauthorized');

    await authService.deleteSession(session._id);

    const tokens = generateTokens(session.userId);
    await authService.createSession(session.userId, tokens);

    res
      .cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: { accessToken: tokens.accessToken },
      });
  } catch (error) {
    console.error('Помилка в refresh:', error);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await authService.deleteSessionByToken(refreshToken);
    res.status(204).send();
  } catch (error) {
    console.error('Помилка в logout:', error);
    next(error);
  }
};
