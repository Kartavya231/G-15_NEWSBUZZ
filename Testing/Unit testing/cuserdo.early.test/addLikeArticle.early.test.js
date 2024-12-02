
// Unit tests for: addLikeArticle


import like_model from '../../models/mlike.js';
import { addLikeArticle } from '../cuserdo';


jest.mock("../../models/mlike.js");

describe('addLikeArticle() addLikeArticle method', () => {
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
    it('should add a like successfully when title is provided', async () => {
      // Arrange
      req.body.title = 'Sample Article';

      // Act
      await addLikeArticle(req, res);

      // Assert
      expect(like_model).toHaveBeenCalledWith({
        user_id: 'user123',
        title: 'Sample Article'
      });
      expect(like_model.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Like added successfully'
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return an error when title is not provided', async () => {
      // Arrange
      req.body.title = '';

      // Act
      await addLikeArticle(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Title is required'
      });
    });


  });
});

// End of unit tests for: addLikeArticle
