
// Unit tests for: deleteComment


import comment_model from '../../models/mcomments.js';
import { deleteComment } from '../cuserdo';


jest.mock("../../models/mcomments.js");

describe('deleteComment() deleteComment method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 'user123', username: 'testuser' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('Happy Paths', () => {
    it('should delete a comment successfully when valid articleURL and commentId are provided', async () => {
      // Arrange
      req.body.articleURL = 'http://example.com/article';
      req.body.commentId = 'comment123';
      const existingComment = {
        user: [{ commentId: 'comment123', username: 'testuser', comment: 'Test comment' }],
        save: jest.fn()
      };
      comment_model.findOne.mockResolvedValue(existingComment);

      // Act
      await deleteComment(req, res);

      // Assert
      expect(comment_model.findOne).toHaveBeenCalledWith({ articleURL: 'http://example.com/article' });
      expect(existingComment.user).toHaveLength(0);
      expect(existingComment.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Comment deleted successfully' });
    });
  });

  describe('Edge Cases', () => {
    it('should return an error when articleURL is missing', async () => {
      // Arrange
      req.body.commentId = 'comment123';

      // Act
      await deleteComment(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'ArticleURL and timestamp are required' });
    });

    it('should return an error when commentId is missing', async () => {
      // Arrange
      req.body.articleURL = 'http://example.com/article';

      // Act
      await deleteComment(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'ArticleURL and timestamp are required' });
    });

    it('should return an error when the comment does not exist', async () => {
      // Arrange
      req.body.articleURL = 'http://example.com/article';
      req.body.commentId = 'comment123';
      comment_model.findOne.mockResolvedValue(null);

      // Act
      await deleteComment(req, res);

      // Assert
      expect(comment_model.findOne).toHaveBeenCalledWith({ articleURL: 'http://example.com/article' });
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Comment not found' });
    });

    it('should handle errors gracefully when an exception is thrown', async () => {
      // Arrange
      req.body.articleURL = 'http://example.com/article';
      req.body.commentId = 'comment123';
      comment_model.findOne.mockRejectedValue(new Error('Database error'));

      // Act
      await deleteComment(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Error while deleting comment' });
    });
  });
});

// End of unit tests for: deleteComment
