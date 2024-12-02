
// Unit tests for: getMute


import mute_model from '../../models/mmute.js';
import { getMute } from '../cmute';


jest.mock("../../models/mmute"); // Mock the mute_model

describe('getMute() getMute method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 'user123' },
      body: { baseURL: 'http://example.com' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return isMuted: true when the URL is muted for the user', async () => {
      // Arrange
      mute_model.findOne.mockResolvedValue({
        mutedURL: ['http://example.com']
      });

      // Act
      await getMute(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, isMuted: true });
    });

    it('should return isMuted: false when the URL is not muted for the user', async () => {
      // Arrange
      mute_model.findOne.mockResolvedValue({
        mutedURL: ['http://another-url.com']
      });

      // Act
      await getMute(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, isMuted: false });
    });

    it('should return isMuted: false when the user has no mute document', async () => {
      // Arrange
      mute_model.findOne.mockResolvedValue(null);

      // Act
      await getMute(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, isMuted: false });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle errors gracefully and return a 210 status with an error message', async () => {
      // Arrange
      mute_model.findOne.mockRejectedValue(new Error('Database error'));

      // Act
      await getMute(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error while getting mute status" });
    });

    it('should return isMuted: false when the mutedURL array is empty', async () => {
      // Arrange
      mute_model.findOne.mockResolvedValue({
        mutedURL: []
      });

      // Act
      await getMute(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, isMuted: false });
    });

    it('should handle case where baseURL is undefined in request body', async () => {
      // Arrange
      req.body.baseURL = undefined;
      mute_model.findOne.mockResolvedValue({
        mutedURL: ['http://example.com']
      });

      // Act
      await getMute(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, isMuted: false });
    });
  });
});

// End of unit tests for: getMute
