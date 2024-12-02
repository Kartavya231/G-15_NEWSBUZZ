
// Unit tests for: addQuickSearch


import quickSearch_model from "../../models/mquicksearch.js";
import { addQuickSearch } from '../cquicksearch';


jest.mock("../../models/mquicksearch.js");

describe('addQuickSearch() addQuickSearch method', () => {
  let req, res, user_id, quickSearchText;

  beforeEach(() => {
    user_id = '12345';
    quickSearchText = 'Sample Quick Search';
    req = {
      user: { id: user_id },
      body: { quickSearchText }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should add a new quick search when no existing entry is found', async () => {
      // Mock findOne to return null, simulating no existing entry
      quickSearch_model.findOne.mockResolvedValue(null);

      // Mock save method on the new quick search instance
      const saveMock = jest.fn();
      quickSearch_model.mockImplementation(() => ({
        save: saveMock
      }));

      await addQuickSearch(req, res);

      expect(quickSearch_model.findOne).toHaveBeenCalledWith({ user_id });
      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Quick Search added successfully.'
      });
    });

    it('should update an existing quick search entry', async () => {
      // Mock findOne to return an existing entry
      const existingQuickSearch = {
        quickSearchText: [],
        save: jest.fn()
      };
      quickSearch_model.findOne.mockResolvedValue(existingQuickSearch);

      await addQuickSearch(req, res);

      expect(quickSearch_model.findOne).toHaveBeenCalledWith({ user_id });
      expect(existingQuickSearch.quickSearchText).toContain(quickSearchText);
      expect(existingQuickSearch.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Quick Search updated successfully.'
      });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return an error if user_id is missing', async () => {
      req.user.id = null;

      await addQuickSearch(req, res);

      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User ID is required.'
      });
    });

    it('should return an error if quickSearchText is missing', async () => {
      req.body.quickSearchText = null;

      await addQuickSearch(req, res);

      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Quick Search Text is required.'
      });
    });

    it('should handle errors thrown during database operations', async () => {
      const errorMessage = 'Database error';
      quickSearch_model.findOne.mockRejectedValue(new Error(errorMessage));

      await addQuickSearch(req, res);

      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage
      });
    });
  });
});

// End of unit tests for: addQuickSearch
