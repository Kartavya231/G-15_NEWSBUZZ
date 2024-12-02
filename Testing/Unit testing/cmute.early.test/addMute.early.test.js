
// Unit tests for: addMute


import { jest } from '@jest/globals';
import mute_model from '../../models/mmute.js';
import { addMute } from '../cmute';


jest.mock("../../models/mmute");

describe('addMute() addMute method', () => {
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

  describe('Happy Paths', () => {
    it('should add a new mute document if none exists for the user', async () => {
      // Setup: No existing mute document
      mute_model.findOne.mockResolvedValue(null);
      mute_model.prototype.save = jest.fn().mockResolvedValue({});

      // Execute
      await addMute(req, res);

      // Assert
      expect(mute_model.findOne).toHaveBeenCalledWith({ user: 'user123' });
      expect(mute_model.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Provider muted successfully" });
    });

    it('should add a URL to the existing mute document if the URL is not already muted', async () => {
      // Setup: Existing mute document without the URL
      mute_model.findOne.mockResolvedValue({ mutedURL: [] });
      mute_model.findOneAndUpdate.mockResolvedValue({});

      // Execute
      await addMute(req, res);

      // Assert
      expect(mute_model.findOne).toHaveBeenCalledWith({ user: 'user123' });
      expect(mute_model.findOneAndUpdate).toHaveBeenCalledWith(
        { user: 'user123' },
        { $push: { mutedURL: 'http://example.com' } }
      );
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Provider muted successfully" });
    });
  });

  describe('Edge Cases', () => {
    it('should return a message if the URL is already muted', async () => {
      // Setup: Existing mute document with the URL already muted
      mute_model.findOne.mockResolvedValue({ mutedURL: ['http://example.com'] });

      // Execute
      await addMute(req, res);

      // Assert
      expect(mute_model.findOne).toHaveBeenCalledWith({ user: 'user123' });
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "URL already muted" });
    });

    it('should handle errors gracefully and return an error message', async () => {
      // Setup: Simulate an error during database operation
      mute_model.findOne.mockRejectedValue(new Error('Database error'));

      // Execute
      await addMute(req, res);

      // Assert
      expect(mute_model.findOne).toHaveBeenCalledWith({ user: 'user123' });
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error while muting provider" });
    });
  });
});

// End of unit tests for: addMute
