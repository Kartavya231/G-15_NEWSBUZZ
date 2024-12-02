
// Unit tests for: getBookmarkArticle


import bookmark_model from '../../models/mbookmark.js';
import { getBookmarkArticle } from '../cuserdo';


jest.mock("../../models/mbookmark.js");

describe('getBookmarkArticle() getBookmarkArticle method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        id: 'user123'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('Happy Paths', () => {
    it('should return a list of bookmarks for the user', async () => {
      // Arrange
      const mockBookmarks = [
        { title: 'Article 1', link: 'http://example.com/1' },
        { title: 'Article 2', link: 'http://example.com/2' }
      ];
      bookmark_model.find.mockResolvedValue(mockBookmarks);

      // Act
      await getBookmarkArticle(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, bookmarks: mockBookmarks });
    });
  });

  describe('Edge Cases', () => {
    it('should return an empty list if no bookmarks are found', async () => {
      // Arrange
      bookmark_model.find.mockResolvedValue([]);

      // Act
      await getBookmarkArticle(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, bookmarks: [] });
    });

  });
});

// End of unit tests for: getBookmarkArticle
