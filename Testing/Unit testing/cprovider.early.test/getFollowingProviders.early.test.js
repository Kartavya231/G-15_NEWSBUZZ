// Unit tests for: getFollowingProviders


import newsProvidermodel from '../../models/mnewsProvider.js';
import usermodel from '../../models/muser.js';
import { getFollowingProviders } from '../cprovider';


jest.mock("../../models/mnewsProvider.js");
jest.mock("../../models/muser.js");

describe('getFollowingProviders() getFollowingProviders method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        id: 'user123'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('Happy Paths', () => {
    it('should return a list of following providers when user is found and has followings', async () => {
      // Arrange
      const mockUser = {
        following: ['provider1', 'provider2']
      };
      const mockProviders = [
        { baseURL: 'provider1', name: 'Provider One' },
        { baseURL: 'provider2', name: 'Provider Two' }
      ];

      usermodel.findById.mockResolvedValue(mockUser);
      newsProvidermodel.find.mockResolvedValue(mockProviders);

      // Act
      await getFollowingProviders(req, res);

      // Assert
      expect(usermodel.findById).toHaveBeenCalledWith('user123');
      expect(newsProvidermodel.find).toHaveBeenCalledWith({ baseURL: { $in: ['provider1', 'provider2'] } });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, providers: mockProviders });
    });
  });

  describe('Edge Cases', () => {

    it('should handle case when user has no followings', async () => {
      // Arrange
      const mockUser = {
        following: []
      };

      usermodel.findById.mockResolvedValue(mockUser);
      newsProvidermodel.find.mockResolvedValue([]);

      // Act
      await getFollowingProviders(req, res);

      // Assert
      expect(usermodel.findById).toHaveBeenCalledWith('user123');
      expect(newsProvidermodel.find).toHaveBeenCalledWith({ baseURL: { $in: [] } });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, providers: [] });
    });

    it('should handle database error gracefully', async () => {
      // Arrange
      const errorMessage = 'Database error';
      usermodel.findById.mockRejectedValue(new Error(errorMessage));

      // Act
      await getFollowingProviders(req, res);

      // Assert
      expect(usermodel.findById).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error while getting Following Providers" });
    });
  });
});

// End of unit tests for: getFollowingProviders