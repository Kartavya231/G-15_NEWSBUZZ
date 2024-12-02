
// Unit tests for: addFollow


import newsProvidermodel from '../../models/mnewsProvider.js';
import usermodel from '../../models/muser.js';
import { addFollow } from '../cuserdo';


jest.mock("../../models/mnewsProvider.js");
jest.mock("../../models/muser.js");

describe('addFollow() addFollow method', () => {
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
    it('should successfully add a follow when baseURL is provided and both provider and user are updated', async () => {
      // Arrange
      req.body.baseURL = 'http://example.com';
      newsProvidermodel.findOneAndUpdate.mockResolvedValue({ baseURL: 'http://example.com' });
      usermodel.findByIdAndUpdate.mockResolvedValue({ id: 'user123' });

      // Act
      await addFollow(req, res);

      // Assert
      expect(newsProvidermodel.findOneAndUpdate).toHaveBeenCalledWith(
        { baseURL: 'http://example.com' },
        { $addToSet: { followers: 'user123' } }
      );
      expect(usermodel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        { $addToSet: { following: 'http://example.com' } }
      );
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Followed successfully" });
    });
  });

  describe('Edge Cases', () => {
    it('should return an error when baseURL is not provided', async () => {
      // Arrange
      req.body.baseURL = undefined;

      // Act
      await addFollow(req, res);

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
      await addFollow(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "error while Follow" });
    });

    it('should return an error when user is not found', async () => {
      // Arrange
      req.body.baseURL = 'http://example.com';
      newsProvidermodel.findOneAndUpdate.mockResolvedValue({ baseURL: 'http://example.com' });
      usermodel.findByIdAndUpdate.mockResolvedValue(null);

      // Act
      await addFollow(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "error while Follow" });
    });

  });
});

// End of unit tests for: addFollow
