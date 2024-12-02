
// Unit tests for: getQuickSearch


import quickSearch_model from "../../models/mquicksearch.js";
import { getQuickSearch } from '../cquicksearch';


jest.mock("../../models/mquicksearch.js");

describe('getQuickSearch() getQuickSearch method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        id: 'user123',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return quick search text for a valid user', async () => {
      // Arrange
      const mockQuickSearchUser = { quickSearchText: ['search1', 'search2'] };
      quickSearch_model.findOne.mockResolvedValue(mockQuickSearchUser);

      // Act
      await getQuickSearch(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        quickSearchText: mockQuickSearchUser.quickSearchText,
      });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return an error if user_id is not provided', async () => {
      // Arrange
      req.user.id = null;

      // Act
      await getQuickSearch(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User id is required',
      });
    });

    it('should return an error if no quick search is found for the user', async () => {
      // Arrange
      quickSearch_model.findOne.mockResolvedValue(null);

      // Act
      await getQuickSearch(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'No quick search found for the user',
      });
    });

  });
});

// End of unit tests for: getQuickSearch
