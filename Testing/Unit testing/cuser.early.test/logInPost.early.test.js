// Unit tests for: logInPost


import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
import jsonwebtoken from "jsonwebtoken";
import { logInPost } from '../cuser.js';
import usermodel from "../../models/muser.js";


dotenv.config();

jest.mock("../../models/muser.js");
jest.mock("jsonwebtoken");
jest.mock("crypto-js");

describe('logInPost() logInPost method', () => {
  let req, res, mockUser;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'encryptedPassword',
        role: 'USER'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockUser = {
      _id: 'userId',
      username: 'testUser',
      password: 'encryptedUserPassword'
    };

    usermodel.findOne.mockClear();
    jsonwebtoken.sign.mockClear();
    CryptoJS.AES.decrypt.mockClear();
  });

  describe('Happy Paths', () => {
    it('should successfully log in a user with correct credentials', async () => {
      // Arrange
      usermodel.findOne.mockResolvedValue(mockUser);
      CryptoJS.AES.decrypt.mockImplementation(() => ({
        toString: () => 'decryptedPassword'
      }));
      jsonwebtoken.sign.mockReturnValue('mockToken');

      // Act
      await logInPost(req, res);

      // Assert
      expect(usermodel.findOne).toHaveBeenCalledWith({ email: 'test@example.com', role: 'USER' });
      expect(CryptoJS.AES.decrypt).toHaveBeenCalledTimes(2);
      expect(jsonwebtoken.sign).toHaveBeenCalledWith({ id: 'userId', username: 'testUser' }, process.env.JWT_SECRET);
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'User signed in successfully', token: 'mockToken' });
    });
  });

  describe('Edge Cases', () => {
    it('should return an error if any field is missing', async () => {
      // Arrange
      req.body.email = '';

      // Act
      await logInPost(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'All fields required' });
    });

    it('should return an error if user does not exist', async () => {
      // Arrange
      usermodel.findOne.mockResolvedValue(null);

      // Act
      await logInPost(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'User not exist' });
    });

    it('should return an error if password is invalid', async () => {
      // Arrange

      const user = {
        email: 'test@example.com',
        password: 'password123',
        role: 'USER'
      };
      usermodel.findOne.mockResolvedValue(user);
      CryptoJS.AES.decrypt.mockImplementation((value, key) => {

        console.log("value", value);
        if (value === 'password123') {
          return { toString: () => 'wrongDecryptedPassword' };
        }
        return { toString: () => 'decryptedPassword' };
      });

      // Act
      await logInPost(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid password' });
    });

  });
});

// End of unit tests for: logInPost