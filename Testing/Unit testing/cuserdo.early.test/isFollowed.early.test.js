// Unit tests for: isFollowed


import usermodel from '../../models/muser.js';
import { isFollowed } from '../cuserdo';


jest.mock("../../models/muser.js");

describe('isFollowed() isFollowed method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 'user123' },
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('Happy Paths', () => {
    it('should return true when the user is following the baseURL', async () => {
      // Arrange
      req.body.baseURL = 'http://example.com';
      usermodel.findById = jest.fn().mockResolvedValue({
        following: ['http://example.com']
      });

      // Act
      await isFollowed(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, isFollowing: true });
    });

    it('should return false when the user is not following the baseURL', async () => {
      // Arrange
      req.body.baseURL = 'http://example.com';
      usermodel.findById = jest.fn().mockResolvedValue({
        following: ['http://another.com']
      });

      // Act
      await isFollowed(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, isFollowing: false });
    });
  });

  describe('Edge Cases', () => {
    it('should return an error when baseURL is not provided', async () => {
      // Arrange
      req.body.baseURL = undefined;

      // Act
      await isFollowed(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "BaseURL is required" });
    });

    it('should handle errors gracefully when usermodel.findById throws an error', async () => {
      // Arrange
      req.body.baseURL = 'http://example.com';
      usermodel.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      // Act
      await isFollowed(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error while checking follow status" });
    });
  });
});

// End of unit tests for: isFollowed