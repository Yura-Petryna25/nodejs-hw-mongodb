import User from '../db/models/User.js';
import Session from '../db/models/Session.js';

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const createSession = async (userId, tokens) => {
  const {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  } = tokens;

  return await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
};

export const findSessionByRefreshToken = async (refreshToken) => {
  return await Session.findOne({ refreshToken });
};

export const deleteSession = async (sessionId) => {
  return await Session.findByIdAndDelete(sessionId);
};

export const deleteSessionByToken = async (refreshToken) => {
  return await Session.findOneAndDelete({ refreshToken });
};
