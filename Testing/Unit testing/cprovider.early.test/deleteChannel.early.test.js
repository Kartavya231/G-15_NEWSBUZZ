
// Unit tests for: deleteChannel


import newsProvidermodel from '../../models/mnewsProvider.js';
import { deleteChannel } from '../cprovider';


jest.mock("../../models/mnewsProvider.js");

describe('deleteChannel() deleteChannel method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: 'channelId123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should delete a channel successfully when it exists', async () => {
      // Arrange
      newsProvidermodel.findById.mockResolvedValue({ _id: 'channelId123' });
      newsProvidermodel.findByIdAndDelete.mockResolvedValue({});

      // Act
      await deleteChannel(req, res);

      // Assert
      expect(newsProvidermodel.findById).toHaveBeenCalledWith('channelId123');
      expect(newsProvidermodel.findByIdAndDelete).toHaveBeenCalledWith('channelId123');
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Channel deleted successfully' });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return an error if the channel does not exist', async () => {
      // Arrange
      newsProvidermodel.findById.mockResolvedValue(null);

      // Act
      await deleteChannel(req, res);

      // Assert
      expect(newsProvidermodel.findById).toHaveBeenCalledWith('channelId123');
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Channel not found' });
    });

    it('should handle errors thrown during the deletion process', async () => {
      // Arrange
      const errorMessage = 'Database error';
      newsProvidermodel.findById.mockRejectedValue(new Error(errorMessage));

      // Act
      await deleteChannel(req, res);

      // Assert
      expect(newsProvidermodel.findById).toHaveBeenCalledWith('channelId123');
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: new Error(errorMessage) });
    });
  });
});

// End of unit tests for: deleteChannel
