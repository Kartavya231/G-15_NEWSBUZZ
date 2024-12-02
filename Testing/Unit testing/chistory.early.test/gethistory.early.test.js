
// Unit tests for: gethistory


import history_model from "../../models/mhistory.js";
import { gethistory } from '../chistory';


jest.mock("../../models/mhistory.js");

describe('gethistory() gethistory method', () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: { id: 'user123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('Happy paths', () => {
    it('should return user history when history exists', async () => {
      // Arrange: Mock the history_model to return a user history
      const mockHistoryData = { historyData: [{ title: 'Article 1', link: 'http://example.com' }] };
      history_model.findOne.mockResolvedValue(mockHistoryData);

      // Act: Call the gethistory function
      await gethistory(req, res, next);

      // Assert: Check if the response is correct
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockHistoryData.historyData });
    });
  });

  describe('Edge cases', () => {
    it('should return "No History Found" when no history exists for the user', async () => {
      // Arrange: Mock the history_model to return null
      history_model.findOne.mockResolvedValue(null);

      // Act: Call the gethistory function
      await gethistory(req, res, next);

      // Assert: Check if the response is correct
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "No History Found" });
    });

  });
});

// End of unit tests for: gethistory
