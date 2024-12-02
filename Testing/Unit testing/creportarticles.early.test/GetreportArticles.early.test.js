
// Unit tests for: GetreportArticles


import newsProvidermodel from '../../models/mnewsProvider.js';
import reportarticlesModel from '../../models/mreportarticles.js';
import { GetreportArticles } from '../creportarticles';


jest.mock("../../models/mreportarticles.js");
jest.mock("../../models/mnewsProvider.js");

describe('GetreportArticles() GetreportArticles method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        _id: 'provider123'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return reported articles successfully when provider and articles exist', async () => {
      // Arrange
      const provider = { baseURL: 'http://example.com' };
      const reportarticles = [
        { title: 'Article 1', link: 'http://example.com/article1', num: 1 },
        { title: 'Article 2', link: 'http://example.com/article2', num: 2 }
      ];

      newsProvidermodel.findOne.mockResolvedValue(provider);
      reportarticlesModel.find.mockResolvedValue(reportarticles);

      // Act
      await GetreportArticles(req, res);

      // Assert
      expect(newsProvidermodel.findOne).toHaveBeenCalledWith({ provider_id: req.user._id });
      expect(reportarticlesModel.find).toHaveBeenCalledWith({ link: { $regex: `^${provider.baseURL}` } });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, reportarticles });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return an error when provider is not found', async () => {
      // Arrange
      newsProvidermodel.findOne.mockResolvedValue(null);

      // Act
      await GetreportArticles(req, res);

      // Assert
      expect(newsProvidermodel.findOne).toHaveBeenCalledWith({ provider_id: req.user._id });
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error finding Provider" });
    });

    it('should handle internal server error gracefully', async () => {
      // Arrange
      const errorMessage = 'Database connection error';
      newsProvidermodel.findOne.mockRejectedValue(new Error(errorMessage));

      // Act
      await GetreportArticles(req, res);

      // Assert
      expect(newsProvidermodel.findOne).toHaveBeenCalledWith({ provider_id: req.user._id });
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal Server Error" });
    });

    it('should return an empty list if no articles match the baseURL', async () => {
      // Arrange
      const provider = { baseURL: 'http://example.com' };
      newsProvidermodel.findOne.mockResolvedValue(provider);
      reportarticlesModel.find.mockResolvedValue([]);

      // Act
      await GetreportArticles(req, res);

      // Assert
      expect(newsProvidermodel.findOne).toHaveBeenCalledWith({ provider_id: req.user._id });
      expect(reportarticlesModel.find).toHaveBeenCalledWith({ link: { $regex: `^${provider.baseURL}` } });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, reportarticles: [] });
    });
  });
});

// End of unit tests for: GetreportArticles
