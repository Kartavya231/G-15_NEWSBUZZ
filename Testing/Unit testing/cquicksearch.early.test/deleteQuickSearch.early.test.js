
// Unit tests for: deleteQuickSearch


import quickSearch_model from "../../models/mquicksearch.js";
import { deleteQuickSearch } from '../cquicksearch';


jest.mock("../../models/mquicksearch.js");

describe('deleteQuickSearch() deleteQuickSearch method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 'user123' },
      body: { quickSearchText: 'searchText' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should delete the quick search text successfully', async () => {
      // Mocking the database response
      quickSearch_model.findOne.mockResolvedValue({
        quickSearchText: [{ text: 'searchText' }],
        save: jest.fn()
      });

      await deleteQuickSearch(req, res);

      expect(quickSearch_model.findOne).toHaveBeenCalledWith({ user_id: 'user123' });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Quick Search deleted successfully' });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return an error if user_id is missing', async () => {
      req.user.id = null;

      await deleteQuickSearch(req, res);

      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'User id is required' });
    });

    it('should return an error if quickSearchText is missing', async () => {
      req.body.quickSearchText = null;

      await deleteQuickSearch(req, res);

      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Quick Search Text is required' });
    });

    it('should return an error if no quick search is found for the user', async () => {
      quickSearch_model.findOne.mockResolvedValue(null);

      await deleteQuickSearch(req, res);

      expect(quickSearch_model.findOne).toHaveBeenCalledWith({ user_id: 'user123' });
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'No quick search found for the user' });
    });

    it('should handle errors thrown during the process', async () => {
      const errorMessage = 'Database error';
      quickSearch_model.findOne.mockRejectedValue(new Error(errorMessage));

      await deleteQuickSearch(req, res);

      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});

// End of unit tests for: deleteQuickSearch
