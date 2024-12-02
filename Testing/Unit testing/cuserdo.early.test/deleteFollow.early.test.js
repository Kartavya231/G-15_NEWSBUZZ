
// Unit tests for: deleteFollow


import newsProvidermodel from '../../models/mnewsProvider.js';
import usermodel from '../../models/muser.js';
import { deleteFollow } from '../cuserdo';


jest.mock("../../models/mnewsProvider.js");
jest.mock("../../models/muser.js");

describe('deleteFollow() deleteFollow method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 'user123' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('Happy Paths', () => {
    it('should successfully unfollow when baseURL is provided and both provider and user are updated', async () => {
      // Arrange
      req.body.baseURL = 'http://example.com';
      newsProvidermodel.findOneAndUpdate.mockResolvedValue({ baseURL: 'http://example.com' });
      usermodel.findByIdAndUpdate.mockResolvedValue({ id: 'user123' });

      // Act
      await deleteFollow(req, res);

      // Assert
      expect(newsProvidermodel.findOneAndUpdate).toHaveBeenCalledWith(
        { baseURL: 'http://example.com' },
        { $pull: { followers: 'user123' } }
      );
      expect(usermodel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        { $pull: { following: 'http://example.com' } }
      );
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Unfollowed successfully" });
    });
  });

  describe('Edge Cases', () => {
    it('should return an error when baseURL is not provided', async () => {
      // Arrange
      req.body.baseURL = undefined;

      // Act
      await deleteFollow(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "BaseURL is required" });
    });

    it('should return an error when provider is not found', async () => {
      // Arrange
      req.body.baseURL = 'http://example.com';
      newsProvidermodel.findOneAndUpdate.mockResolvedValue(null);
      usermodel.findByIdAndUpdate.mockResolvedValue({ id: 'user123' });

      // Act
      await deleteFollow(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "error while unfollow" });
    });

    it('should return an error when user is not found', async () => {
      // Arrange
      req.body.baseURL = 'http://example.com';
      newsProvidermodel.findOneAndUpdate.mockResolvedValue({ baseURL: 'http://example.com' });
      usermodel.findByIdAndUpdate.mockResolvedValue(null);

      // Act
      await deleteFollow(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "error while unfollow" });
    });
  });
});

// End of unit tests for: deleteFollow
