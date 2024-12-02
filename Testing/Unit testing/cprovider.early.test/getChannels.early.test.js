
// Unit tests for: getChannels


import { mockRequest, mockResponse } from 'jest-mock-req-res';
import newsProvidermodel from '../../models/mnewsProvider.js';
import { getChannels } from '../cprovider';


jest.mock("../../models/mnewsProvider.js");

describe('getChannels() getChannels method', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
  });


  describe('Edge Cases', () => {

    it('should handle the case where req.user is undefined', async () => {
      // Arrange
      req.user = undefined;

      // Act
      await getChannels(req, res);

      // Assert
      expect(newsProvidermodel.find).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: expect.any(Error) });
    });

    it('should handle the case where the user has no channels', async () => {
      // Arrange
      req.user = { id: 'userWithNoChannels' };
      newsProvidermodel.find.mockResolvedValue([]);

      // Act
      await getChannels(req, res);

      // Assert
      expect(newsProvidermodel.find).toHaveBeenCalledWith({ provider_id: 'userWithNoChannels' });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, channels: [] });
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      req.user = { id: 'userWithError' };
      const errorMessage = 'Database error';
      newsProvidermodel.find.mockRejectedValue(new Error(errorMessage));

      // Act
      await getChannels(req, res);

      // Assert
      expect(newsProvidermodel.find).toHaveBeenCalledWith({ provider_id: 'userWithError' });
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: new Error(errorMessage) });
    });

    
    describe('Happy Paths', () => {
      it('should return a list of channels for a valid user', async () => {
        // Arrange
        req.user = { id: 'validUserId' };
        const mockChannels = [
          { name: 'Channel 1', baseURL: 'http://channel1.com', provider_id: 'validUserId' },
          { name: 'Channel 2', baseURL: 'http://channel2.com', provider_id: 'validUserId' },
        ];
        newsProvidermodel.find.mockResolvedValue(mockChannels);

        // Act
        await getChannels(req, res);

        // Assert
        expect(newsProvidermodel.find).toHaveBeenCalledWith({ provider_id: 'validUserId' });
        expect(res.status).toHaveBeenCalledWith(202);
        expect(res.json).toHaveBeenCalledWith({ success: true, channels: mockChannels });
      });
    });

    
  });
});

// End of unit tests for: getChannels
