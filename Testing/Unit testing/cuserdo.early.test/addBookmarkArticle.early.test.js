
// Unit tests for: addBookmarkArticle


import bookmark_model from '../../models/mbookmark.js';
import { addBookmarkArticle } from '../cuserdo';


jest.mock("../../models/mbookmark.js");

describe('addBookmarkArticle() addBookmarkArticle method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 'user123' },
      body: {
        title: 'Sample Title',
        link: 'http://example.com',
        providerImg: 'http://example.com/image.png',
        providerName: 'Example Provider',
        imgURL: 'http://example.com/article-image.png',
        someText: 'Sample text'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('Happy paths', () => {
    it('should add a bookmark successfully when all required fields are provided', async () => {
      // Arrange
      const saveMock = jest.fn();
      bookmark_model.mockImplementation(() => ({ save: saveMock }));

      // Act
      await addBookmarkArticle(req, res);

      // Assert
      expect(bookmark_model).toHaveBeenCalledWith({
        user_id: 'user123',
        title: 'Sample Title',
        link: 'http://example.com',
        providerImg: 'http://example.com/image.png',
        providerName: 'Example Provider',
        imgURL: 'http://example.com/article-image.png',
        someText: 'Sample text'
      });
      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Bookmark added successfully" });
    });
  });

  describe('Edge cases', () => {
    it('should return an error when title and link are missing', async () => {
      // Arrange
      req.body.title = '';
      req.body.link = '';

      // Act
      await addBookmarkArticle(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Title and Link are required" });
    });

    it('should add a bookmark successfully when optional fields are missing', async () => {
      // Arrange
      req.body.providerImg = undefined;
      req.body.providerName = undefined;
      req.body.imgURL = undefined;
      req.body.someText = undefined;

      const saveMock = jest.fn();
      bookmark_model.mockImplementation(() => ({ save: saveMock }));

      // Act
      await addBookmarkArticle(req, res);

      // Assert
      expect(bookmark_model).toHaveBeenCalledWith({
        user_id: 'user123',
        title: 'Sample Title',
        link: 'http://example.com',
        providerImg: undefined,
        providerName: undefined,
        imgURL: undefined,
        someText: undefined
      });
      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Bookmark added successfully" });
    });
  });
});

// End of unit tests for: addBookmarkArticle
