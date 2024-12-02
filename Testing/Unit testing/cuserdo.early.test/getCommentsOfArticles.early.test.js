
// Unit tests for: getCommentsOfArticles


import comment_model from '../../models/mcomments.js';
import { getCommentsOfArticles } from '../cuserdo';


jest.mock("../../models/mcomments.js");

describe('getCommentsOfArticles() getCommentsOfArticles method', () => {
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
    it('should return comments for a valid articleURL', async () => {
      // Arrange
      req.body.articleURL = 'http://example.com/article';
      const mockComments = {
        user: [
          { username: 'user1', comment: 'Great article!', commentId: '123' },
          { username: 'user2', comment: 'Interesting read.', commentId: '456' }
        ]
      };
      comment_model.findOne.mockResolvedValue(mockComments);

      // Act
      await getCommentsOfArticles(req, res);

      // Assert
      expect(comment_model.findOne).toHaveBeenCalledWith({ articleURL: req.body.articleURL });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        comments: mockComments.user,
        loggedUserName: req.user.username
      });
    });

    it('should return an empty array if no comments are found', async () => {
      // Arrange
      req.body.articleURL = 'http://example.com/article';
      comment_model.findOne.mockResolvedValue(null);

      // Act
      await getCommentsOfArticles(req, res);

      // Assert
      expect(comment_model.findOne).toHaveBeenCalledWith({ articleURL: req.body.articleURL });
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        comments: []
      });
    });
  });

  describe('Edge cases', () => {
    it('should return an error if articleURL is not provided', async () => {
      // Act
      await getCommentsOfArticles(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "ArticleURL is required"
      });
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      req.body.articleURL = 'http://example.com/article';
      comment_model.findOne.mockRejectedValue(new Error('Database error'));

      // Act
      await getCommentsOfArticles(req, res);

      // Assert
      expect(comment_model.findOne).toHaveBeenCalledWith({ articleURL: req.body.articleURL });
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error while getting comments"
      });
    });
  });
});

// End of unit tests for: getCommentsOfArticles
