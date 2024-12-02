
// Unit tests for: isBookmarked


import bookmark_model from '../../models/mbookmark.js';
import { isBookmarked } from '../cuserdo';


jest.mock("../../models/mbookmark.js"); // Mock the bookmark model

describe('isBookmarked() isBookmarked method', () => {
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
    it('should return bookmarked: true when the article is bookmarked', async () => {
      // Arrange
      req.body = { title: 'Sample Title', link: 'http://samplelink.com' };
      bookmark_model.findOne.mockResolvedValue({ user_id: 'user123', title: 'Sample Title', link: 'http://samplelink.com' });

      // Act
      await isBookmarked(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, bookmarked: true });
    });

    it('should return bookmarked: false when the article is not bookmarked', async () => {
      // Arrange
      req.body = { title: 'Sample Title', link: 'http://samplelink.com' };
      bookmark_model.findOne.mockResolvedValue(null);

      // Act
      await isBookmarked(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, bookmarked: false });
    });
  });

  describe('Edge Cases', () => {
    it('should return an error when title is missing', async () => {
      // Arrange
      req.body = { link: 'http://samplelink.com' };

      // Act
      await isBookmarked(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Title and Link is required" });
    });

    it('should return an error when link is missing', async () => {
      // Arrange
      req.body = { title: 'Sample Title' };

      // Act
      await isBookmarked(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Title and Link is required" });
    });

    it('should return an error when both title and link are missing', async () => {
      // Arrange
      req.body = {};

      // Act
      await isBookmarked(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Title and Link is required" });
    });


  });
});

// End of unit tests for: isBookmarked
