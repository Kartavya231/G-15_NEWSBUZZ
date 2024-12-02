
// Unit tests for: deleteBookmarkArticle


import bookmark_model from '../../models/mbookmark.js';
import { deleteBookmarkArticle } from '../cuserdo';


jest.mock("../../models/mbookmark.js");

describe('deleteBookmarkArticle() deleteBookmarkArticle method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 'user123' },
      body: { title: 'Sample Title', link: 'http://samplelink.com' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  

  describe('Happy Paths', () => {
    it('should delete a bookmark successfully and return a success message', async () => {
      // Arrange
      bookmark_model.findOneAndDelete.mockResolvedValue(true);

      // Act
      await deleteBookmarkArticle(req, res);

      // Assert
      expect(bookmark_model.findOneAndDelete).toHaveBeenCalledWith({
        user_id: req.user.id,
        title: req.body.title,
        link: req.body.link
      });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Bookmark deleted successfully'
      });
    });
  });

  describe('Edge Cases', () => {




    it('should return an error message if title and link are not provided', async () => {
      // Arrange
      req.body = {};

      // Act
      await deleteBookmarkArticle(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Title and Link are required'
      });
    });

    it('should handle the case where the bookmark does not exist', async () => {
      // Arrange
      bookmark_model.findOneAndDelete.mockResolvedValue(null);

      // Act
      await deleteBookmarkArticle(req, res);

      // Assert
      expect(bookmark_model.findOneAndDelete).toHaveBeenCalledWith({
        user_id: req.user.id,
        title: req.body.title,
        link: req.body.link
      });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Bookmark deleted successfully'
      });
    });



  });
});

// End of unit tests for: deleteBookmarkArticle
