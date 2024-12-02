
// Unit tests for: isLiked


import like_model from '../../models/mlike.js';
import { isLiked } from '../cuserdo';


jest.mock("../../models/mlike.js");

describe('isLiked() isLiked method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 'user123' },
      body: { title: 'Sample Article' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('Happy Paths', () => {
    it('should return liked: true when the article is liked by the user', async () => {
      // Arrange
      like_model.findOne.mockResolvedValue({ user_id: 'user123', title: 'Sample Article' });

      // Act
      await isLiked(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, liked: true });
    });

    it('should return liked: false when the article is not liked by the user', async () => {
      // Arrange
      like_model.findOne.mockResolvedValue(null);

      // Act
      await isLiked(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, liked: false });
    });
  });

  describe('Edge Cases', () => {
    it('should return an error when title is missing in the request body', async () => {
      // Arrange
      req.body.title = undefined;

      // Act
      await isLiked(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Title is required" });
    });


  });
});

// End of unit tests for: isLiked
