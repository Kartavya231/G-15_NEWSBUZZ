
// Unit tests for: removeMute


import mute_model from '../../models/mmute.js';
import { removeMute } from '../cmute';


jest.mock("../../models/mmute");

describe('removeMute() removeMute method', () => {
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

    mute_model.findOne.mockClear();
    mute_model.findOneAndUpdate.mockClear();
  });

  describe('Happy Paths', () => {
    it('should unmute a URL successfully when it is muted', async () => {
      // Setup: User exists and URL is muted
      mute_model.findOne.mockResolvedValue({
        mutedURL: ['http://example.com']
      });

      // Execute
      await removeMute(req, res);

      // Assert
      expect(mute_model.findOne).toHaveBeenCalledWith({ user: 'user123' });
      expect(mute_model.findOneAndUpdate).toHaveBeenCalledWith(
        { user: 'user123' },
        { $pull: { mutedURL: 'http://example.com' } }
      );
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Provider unmuted successfully" });
    });
  });

  describe('Edge Cases', () => {
    it('should return a message indicating the URL is not muted when it is not in the list', async () => {
      // Setup: User exists but URL is not muted
      mute_model.findOne.mockResolvedValue({
        mutedURL: ['http://another-url.com']
      });

      // Execute
      await removeMute(req, res);

      // Assert
      expect(mute_model.findOne).toHaveBeenCalledWith({ user: 'user123' });
      expect(mute_model.findOneAndUpdate).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "URL not muted" });
    });

    it('should return a message indicating the URL is not muted when the user has no mute document', async () => {
      // Setup: User does not exist
      mute_model.findOne.mockResolvedValue(null);

      // Execute
      await removeMute(req, res);

      // Assert
      expect(mute_model.findOne).toHaveBeenCalledWith({ user: 'user123' });
      expect(mute_model.findOneAndUpdate).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "URL not muted" });
    });

    it('should handle errors gracefully and return an internal server error message', async () => {
      // Setup: Simulate an error
      mute_model.findOne.mockRejectedValue(new Error('Database error'));

      // Execute
      await removeMute(req, res);

      // Assert
      expect(mute_model.findOne).toHaveBeenCalledWith({ user: 'user123' });
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error while unmuting provider" });
    });
  });
});

// End of unit tests for: removeMute
