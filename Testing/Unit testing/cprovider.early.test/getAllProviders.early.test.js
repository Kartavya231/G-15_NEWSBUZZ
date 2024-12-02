
// Unit tests for: getAllProviders


import newsProvidermodel from '../../models/mnewsProvider.js';
import { getAllProviders } from '../cprovider';


jest.mock("../../models/mnewsProvider.js");

describe('getAllProviders() getAllProviders method', () => {
  let req, res;

  beforeEach(() => {
    req = {}; // Mock request object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }; // Mock response object
  });

  describe('Happy paths', () => {
    it('should return a list of providers with status 202 when providers are found', async () => {
      // Arrange
      const mockProviders = [
        { name: 'Provider1', baseURL: 'http://provider1.com' },
        { name: 'Provider2', baseURL: 'http://provider2.com' },
      ];
      newsProvidermodel.find.mockResolvedValue(mockProviders);

      // Act
      await getAllProviders(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, providers: mockProviders });
    });
  });

  describe('Edge cases', () => {
    it('should return status 210 with an error message when an error occurs', async () => {
      // Arrange
      const mockError = new Error('Database error');
      newsProvidermodel.find.mockRejectedValue(mockError);

      // Act
      await getAllProviders(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: mockError });
    });

    it('should return an empty list with status 202 when no providers are found', async () => {
      // Arrange
      newsProvidermodel.find.mockResolvedValue([]);

      // Act
      await getAllProviders(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, providers: [] });
    });
  });
});

// End of unit tests for: getAllProviders
