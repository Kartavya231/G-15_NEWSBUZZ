
// Unit tests for: getNumComments


import comment_model from '../../models/mcomments.js';
import { getNumComments } from '../cuserdo';


jest.mock("../../models/mcomments.js");

describe('getNumComments() getNumComments method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: { username: 'testUser' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('Happy paths', () => {
    it('should return the number of comments for a given articleURL', async () => {
      // Arrange
      req.body.articleURL = 'http://example.com/article';
      const mockComments = { user: [{}, {}, {}] }; // 3 comments
      comment_model.findOne.mockResolvedValue(mockComments);

      // Act
      await getNumComments(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, numComments: 3 });
    });

    it('should return zero comments if no comments exist for the given articleURL', async () => {
      // Arrange
      req.body.articleURL = 'http://example.com/article';
      comment_model.findOne.mockResolvedValue(null);

      // Act
      await getNumComments(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, numComments: 0 });
    });
  });

  describe('Edge cases', () => {
    it('should return an error message if articleURL is not provided', async () => {
      // Arrange
      req.body.articleURL = undefined;

      // Act
      await getNumComments(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "ArticleURL is required" });
    });

    it('should handle errors gracefully and return an error message', async () => {
      // Arrange
      req.body.articleURL = 'http://example.com/article';
      comment_model.findOne.mockRejectedValue(new Error('Database error'));

      // Act
      await getNumComments(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error while getting comments" });
    });
  });
});

// End of unit tests for: getNumComments
