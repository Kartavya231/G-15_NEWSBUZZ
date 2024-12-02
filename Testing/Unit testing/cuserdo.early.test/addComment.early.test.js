
// Unit tests for: addComment


import comment_model from '../../models/mcomments.js';
import { addComment } from '../cuserdo';


jest.mock("../../models/mcomments.js");
jest.mock("uuid", () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

describe('addComment() addComment method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: { username: 'testUser' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Happy Paths', () => {
    it('should add a new comment when no existing comment is found for the article', async () => {
      // Arrange
      req.body = { articleURL: 'http://example.com/article', comment: 'Great article!' };
      comment_model.findOne.mockResolvedValue(null);
      const saveMock = jest.fn();
      comment_model.mockImplementation(() => ({ save: saveMock }));

      // Act
      await addComment(req, res);

      // Assert
      expect(comment_model.findOne).toHaveBeenCalledWith({ articleURL: 'http://example.com/article' });
      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Comment added successfully',
      });
    });

    it('should add a comment to an existing article', async () => {
      // Arrange
      req.body = { articleURL: 'http://example.com/article', comment: 'Nice read!' };
      const existingComment = {
        user: [],
        save: jest.fn(),
      };
      comment_model.findOne.mockResolvedValue(existingComment);

      // Act
      await addComment(req, res);

      // Assert
      expect(existingComment.user).toContainEqual({
        username: 'testUser',
        comment: 'Nice read!',
        commentId: 'mock-uuid',
      });
      expect(existingComment.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Comment added successfully',
        username: 'testUser',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return an error if articleURL is missing', async () => {
      // Arrange
      req.body = { comment: 'Missing URL' };

      // Act
      await addComment(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'ArticleURL, Username, and Comment are required',
      });
    });

    it('should return an error if comment is missing', async () => {
      // Arrange
      req.body = { articleURL: 'http://example.com/article' };

      // Act
      await addComment(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'ArticleURL, Username, and Comment are required',
      });
    });

    it('should handle errors during database operations gracefully', async () => {
      // Arrange
      req.body = { articleURL: 'http://example.com/article', comment: 'Error test' };
      comment_model.findOne.mockRejectedValue(new Error('Database error'));

      // Act
      await addComment(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error while adding comment',
      });
    });
  });
});

// End of unit tests for: addComment
