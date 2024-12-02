
// Unit tests for: ChangePassword


import CryptoJS from 'crypto-js';
import usermodel from "../../models/muser.js";
import ChangePassword from '../cchangepassword.js';


jest.mock("../../models/muser.js");
jest.mock("crypto-js", () => ({
  AES: {
    decrypt: jest.fn(),
  },
  enc: {
    Utf8: 'utf8',
  },
}));

describe('ChangePassword() ChangePassword method', () => {
  let req, res, user;

  beforeEach(() => {
    req = {
      body: {
        CurrentPassword: 'encryptedCurrentPassword',
        password: 'newPassword',
      },
      user: {
        id: 'userId',
      },
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    user = {
      password: 'encryptedUserPassword',
      save: jest.fn(),
    };

    usermodel.findById.mockResolvedValue(user);
    CryptoJS.AES.decrypt.mockImplementation((value, secret) => {
      if (value === 'encryptedCurrentPassword' && secret === 'news-aggregator-secret') {
        return { toString: () => 'currentPassword' };
      }
      if (value === 'encryptedUserPassword' && secret === 'news-aggregator-secret') {
        return { toString: () => 'currentPassword' };
      }
      return { toString: () => '' };
    });
  });

  describe('Happy Paths', () => {
    it('should successfully change the password when current password is correct', async () => {
      // Arrange
      req.body.CurrentPassword = 'encryptedCurrentPassword';
      req.body.password = 'newPassword';

      // Act
      await ChangePassword(req, res);

      // Assert
      expect(usermodel.findById).toHaveBeenCalledWith('userId');
      expect(user.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Password reset successfully' });
    });
  });

  describe('Edge Cases', () => {
    it('should return an error if the user does not exist', async () => {
      // Arrange
      usermodel.findById.mockResolvedValue(null);

      // Act
      await ChangePassword(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "User associated with this email doesn't exist" });
    });

    it('should return an error if the current password is incorrect', async () => {
      // Arrange
      CryptoJS.AES.decrypt.mockImplementation((value, secret) => {
        if (value === 'encryptedCurrentPassword' && secret === 'news-aggregator-secret') {
          return { toString: () => 'wrongPassword' };
        }
        return { toString: () => '' };
      });

      // Act
      await ChangePassword(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Enter Correct password' });
    });

  });
});

// End of unit tests for: ChangePassword
