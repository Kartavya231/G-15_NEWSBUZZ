
// Unit tests for: getNumLikes


import like_model from '../../models/mlike.js';
import { getNumLikes } from '../cuserdo';


jest.mock("../../models/mlike.js");

describe('getNumLikes() getNumLikes method', () => {
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

  describe('Happy paths', () => {
    it('should return the number of likes for a given title', async () => {
      // Arrange
      req.body.title = 'Sample Article';
      like_model.find.mockResolvedValue([{ title: 'Sample Article' }, { title: 'Sample Article' }]);

      // Act
      await getNumLikes(req, res);

      // Assert
      expect(like_model.find).toHaveBeenCalledWith({ title: 'Sample Article' });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, numLikes: 2 });
    });
  });

  describe('Edge cases', () => {
    it('should return an error if title is not provided', async () => {
      // Arrange
      req.body.title = undefined;

      // Act
      await getNumLikes(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'title is required' });
    });

    it('should return zero likes if no likes are found for the given title', async () => {
      // Arrange
      req.body.title = 'Nonexistent Article';
      like_model.find.mockResolvedValue([]);

      // Act
      await getNumLikes(req, res);

      // Assert
      expect(like_model.find).toHaveBeenCalledWith({ title: 'Nonexistent Article' });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, numLikes: 0 });
    });

  });
});

// End of unit tests for: getNumLikes
