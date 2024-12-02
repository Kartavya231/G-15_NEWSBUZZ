
// Unit tests for: deleteLikeArticle


import like_model from '../../models/mlike.js';
import { deleteLikeArticle } from '../cuserdo';


jest.mock("../../models/mlike.js");

describe('deleteLikeArticle() deleteLikeArticle method', () => {
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
    it('should delete a like and return success message when title is provided', async () => {
      // Arrange
      req.body.title = 'Sample Article';
      like_model.findOneAndDelete.mockResolvedValue({});

      // Act
      await deleteLikeArticle(req, res);

      // Assert
      expect(like_model.findOneAndDelete).toHaveBeenCalledWith({ user_id: 'user123', title: 'Sample Article' });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Like deleted successfully" });
    });
  });

  describe('Edge Cases', () => {
    it('should return an error message when title is not provided', async () => {
      // Arrange
      req.body.title = '';

      // Act
      await deleteLikeArticle(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Title is required" });
    });

    it('should handle the case where the like does not exist', async () => {
      // Arrange
      req.body.title = 'Nonexistent Article';
      like_model.findOneAndDelete.mockResolvedValue(null);

      // Act
      await deleteLikeArticle(req, res);

      // Assert
      expect(like_model.findOneAndDelete).toHaveBeenCalledWith({ user_id: 'user123', title: 'Nonexistent Article' });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Like deleted successfully" });
    });

  });
});

// End of unit tests for: deleteLikeArticle
