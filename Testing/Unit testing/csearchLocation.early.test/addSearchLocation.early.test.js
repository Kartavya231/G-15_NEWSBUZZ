
// Unit tests for: addSearchLocation


import searchLocation_model from "../../models/msearchLocation.js";
import addSearchLocation from '../csearchLocation';


jest.mock("../../models/msearchLocation.js");

describe('addSearchLocation() addSearchLocation method', () => {
  let req, res, Text;

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
    Text = 'Sample Search';
  });

  describe('Happy Paths', () => {
    it('should add a new search location if none exists for the user', async () => {
      // Mock findOne to return null, simulating no existing search location
      searchLocation_model.findOne.mockResolvedValue(null);

      // Mock save method
      const saveMock = jest.fn();
      searchLocation_model.mockImplementation(() => ({
        save: saveMock
      }));

      await addSearchLocation(req, res, Text);

      expect(searchLocation_model.findOne).toHaveBeenCalledWith({ user_id: 'user123' });
      expect(saveMock).toHaveBeenCalled();
    });

    it('should update the count and date if the search text already exists', async () => {
      const existingSearchLocation = {
        searchText: [{ text: 'sample search', count: 1, date: Date.now() }],
        save: jest.fn()
      };

      searchLocation_model.findOne.mockResolvedValue(existingSearchLocation);

      await addSearchLocation(req, res, Text);

      expect(existingSearchLocation.searchText[0].count).toBe(2);
      expect(existingSearchLocation.save).toHaveBeenCalled();
    });

    it('should add a new search text if it does not exist in the user\'s search location', async () => {
      const existingSearchLocation = {
        searchText: [{ text: 'another search', count: 1, date: Date.now() }],
        save: jest.fn()
      };

      searchLocation_model.findOne.mockResolvedValue(existingSearchLocation);

      await addSearchLocation(req, res, Text);

      expect(existingSearchLocation.searchText).toHaveLength(2);
      expect(existingSearchLocation.save).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should return a 210 status if search text is not provided', async () => {
      Text = '';

      await addSearchLocation(req, res, Text);

      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Search Text is required' });
    });

    it('should handle case insensitivity by converting text to lowercase', async () => {
      const existingSearchLocation = {
        searchText: [{ text: 'sample search', count: 1, date: Date.now() }],
        save: jest.fn()
      };

      searchLocation_model.findOne.mockResolvedValue(existingSearchLocation);

      Text = 'SAMPLE SEARCH';

      await addSearchLocation(req, res, Text);

      expect(existingSearchLocation.searchText[0].count).toBe(2);
      expect(existingSearchLocation.save).toHaveBeenCalled();
    });

    it('should handle when findOne throws an error', async () => {
      searchLocation_model.findOne.mockRejectedValue(new Error('Database error'));

      await expect(addSearchLocation(req, res, Text)).rejects.toThrow('Database error');
    });
  });
});

// End of unit tests for: addSearchLocation
