
// // Unit tests for: createChannel


// import { v2 as cloudinary_v2 } from 'cloudinary';
// import newsProvidermodel from '../../../models/mnewsProvider.js';
// import usermodel from '../../../models/muser.js';
// import { createChannel } from '../../cprovider';


// jest.mock("../../models/mnewsProvider");
// jest.mock("../../models/muser");
// jest.mock("cloudinary", () => ({
//   v2: {
//     uploader: {
//       upload: jest.fn(),
//     },
//   },
// }));

// describe('createChannel() createChannel method', () => {
//   let req, res;

//   beforeEach(() => {
//     req = {
//       body: {
//         name: 'Test Channel',
//         baseURL: 'http://test.com',
//       },
//       user: {
//         id: 'user123',
//       },
//       file: {
//         path: 'path/to/file',
//       },
//     };

//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//   });

//   describe('createChannel() createChannel method', () => {
//     let req, res;

//     beforeEach(() => {
//       req = {
//         body: {
//           name: 'Test Channel',
//           baseURL: 'http://test.com',
//         },
//         user: {
//           id: 'user123',
//         },
//         file: {
//           path: 'path/to/file',
//         },
//       };

//       res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       jest.clearAllMocks();
//     });

//     describe('Happy paths', () => {

      
//       it('should create a channel successfully when all inputs are valid', async () => {
//         // Arrange
//         const mockUser = { _id: 'user123' }; // Mock user object
//         const mockCloudinaryResponse = { secure_url: 'http://cloudinary.com/logo.png' }; // Mock Cloudinary response
//         const mockChannel = {
//           _id: 'channel123',
//           name: 'Test Channel',
//           baseURL: 'http://test.com',
//           logo: 'http://cloudinary.com/logo.png',
//           provider_id: 'user123',
//         }; // Mock channel data

//         newsProvidermodel.mockImplementation(() => mockChannel); // Mock channel creation
//         usermodel.findById.mockResolvedValue(mockUser); // Mock user retrieval
//         cloudinary_v2.uploader.upload.mockResolvedValue(mockCloudinaryResponse); // Mock Cloudinary upload
//         newsProvidermodel.prototype.save = jest.fn().mockResolvedValue(mockChannel); // Mock save method

//         // Act
//         await createChannel(req, res);

//         // Assert
//         expect(usermodel.findById).toHaveBeenCalledWith('user123');
//         expect(cloudinary_v2.uploader.upload).toHaveBeenCalledWith('path/to/file', {
//           folder: 'news-aggregator',
//           resource_type: 'auto',
//         });
//         expect(newsProvidermodel.mockChannel.save).toHaveBeenCalled();
//         expect(res.status).toHaveBeenCalledWith(202);
//         expect(res.json).toHaveBeenCalledWith({
//           success: true,
//           message: 'Channel created successfully',
//           channel: expect.objectContaining({
//             name: 'Test Channel',
//             baseURL: 'http://test.com',
//             logo: 'http://cloudinary.com/logo.png',
//             provider_id: 'user123',
//           }),
//         });
//       });

//     });

//     // Edge cases remain unchanged
//   });


//   describe('Edge cases', () => {
//     it('should return an error if the user is not found', async () => {
//       // Arrange
//       usermodel.findById.mockResolvedValue(null);

//       // Act
//       await createChannel(req, res);

//       // Assert
//       expect(usermodel.findById).toHaveBeenCalledWith('user123');
//       expect(res.status).toHaveBeenCalledWith(210);
//       expect(res.json).toHaveBeenCalledWith({ success: false, message: 'User not found' });
//     });

//     it('should handle errors during cloudinary upload', async () => {
//       // Arrange
//       const mockUser = { _id: 'user123' };
//       usermodel.findById.mockResolvedValue(mockUser);
//       cloudinary_v2.uploader.upload.mockRejectedValue(new Error('Cloudinary error'));

//       // Act
//       await createChannel(req, res);

//       // Assert
//       expect(cloudinary_v2.uploader.upload).toHaveBeenCalledWith('path/to/file', { folder: 'news-aggregator', resource_type: 'auto' });
//       expect(res.status).toHaveBeenCalledWith(210);
//       expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Error creating channel' }));
//     });

//     it('should handle errors during channel creation', async () => {
//       // Arrange
//       const mockUser = { _id: 'user123' };
//       const mockCloudinaryResponse = { secure_url: 'http://cloudinary.com/logo.png' };

//       usermodel.findById.mockResolvedValue(mockUser);
//       cloudinary_v2.uploader.upload.mockResolvedValue(mockCloudinaryResponse);
//       newsProvidermodel.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

//       // Act
//       await createChannel(req, res);

//       // Assert
//       expect(newsProvidermodel.prototype.save).toHaveBeenCalled();
//       expect(res.status).toHaveBeenCalledWith(210);
//       expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Error creating channel' }));
//     });
//   });
// });

// // End of unit tests for: createChannel


import { createChannel } from '../../controllers/cprovider.js';
import newsProvidermodel from '../../models/mnewsProvider.js';
import usermodel from '../../models/muser.js';
import { v2 as cloudinary_v2 } from 'cloudinary';

// Mock the required dependencies
jest.mock('../../models/mnewsProvider.js');
jest.mock('../../models/muser.js');
jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload: jest.fn(),
    },
  },
}));

describe('createChannel', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test Channel',
        baseURL: 'https://testchannel.com',
      },
      file: {
        path: 'path/to/file.jpg',
      },
      user: {
        id: 'user123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('one Edge Case', () => {

    it('should return an error if req.file is not provided', async () => {
      // Mock request and response objects (no file in req)
      const req = {
        body: {
          name: 'Test Channel',
          baseURL: 'https://testchannel.com',
        },
        file: null,  // Simulate missing file
        user: {
          id: 'user123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Call the function
      await createChannel(req, res);

      // Assertions for response
      expect(res.status).toHaveBeenCalledWith(210); // Check if the correct status code was used
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Logo is required', // Check the error message
      });
    });

  });


  it('should create a new channel successfully', async () => {
    // Mock cloudinary upload
    cloudinary_v2.uploader.upload.mockResolvedValue({
      secure_url: 'https://cloudinary.com/image.jpg',
    });

    // Mock user model
    usermodel.findById.mockResolvedValue({ id: 'user123' });

    // Mock news provider model
    const mockChannelData = {
      name: 'Test Channel',
      baseURL: 'https://testchannel.com',
      logo: 'https://cloudinary.com/image.jpg',
      provider_id: 'user123',
    };

    const mockChannel = {
      ...mockChannelData,
      save: jest.fn().mockResolvedValue({ ...mockChannelData }),
    };
    newsProvidermodel.mockImplementation(() => mockChannel);

    // Call the function
    await createChannel(req, res);

    // Assertions for `res.json` calls
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Channel created successfully',
      })
    );

    // Assertions for channel properties in `res.json`
    const jsonResponse = res.json.mock.calls[0][0]; // Capture the first argument passed to res.json
    expect(jsonResponse.channel).toEqual(
      expect.objectContaining({
        name: 'Test Channel',
        baseURL: 'https://testchannel.com',
        logo: 'https://cloudinary.com/image.jpg',
        provider_id: 'user123',
      })
    );

    // Other assertions
    expect(cloudinary_v2.uploader.upload).toHaveBeenCalledWith('path/to/file.jpg', {
      folder: 'news-aggregator',
      resource_type: 'auto',
    });
    expect(usermodel.findById).toHaveBeenCalledWith('user123');
    expect(mockChannel.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(202);
  });



  it('should return 210 if user is not found', async () => {
    usermodel.findById.mockResolvedValue(null);

    await createChannel(req, res);

    expect(usermodel.findById).toHaveBeenCalledWith('user123');
    expect(res.status).toHaveBeenCalledWith(210);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User not found',
    });
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('Database error');
    usermodel.findById.mockRejectedValue(error);

    await createChannel(req, res);

    expect(usermodel.findById).toHaveBeenCalledWith('user123');
    expect(res.status).toHaveBeenCalledWith(210);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error creating channel',
      error,
    });
  });

  it('should upload logo to Cloudinary and set logoURL when req.file is present', async () => {
    // Mock Cloudinary upload
    cloudinary_v2.uploader.upload.mockResolvedValue({
      secure_url: 'https://cloudinary.com/uploaded_image.jpg', // Mock Cloudinary response
    });

    // Mock request and response objects
    const req = {
      body: {
        name: 'Test Channel',
        baseURL: 'https://testchannel.com',
      },
      file: {
        path: 'path/to/file.jpg', // Mock file path
      },
      user: {
        id: 'user123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock user model
    usermodel.findById.mockResolvedValue({ id: 'user123' });

    // Mock news provider model
    const mockChannelData = {
      name: 'Test Channel',
      baseURL: 'https://testchannel.com',
      logo: 'https://cloudinary.com/uploaded_image.jpg',
      provider_id: 'user123',
    };
    const mockChannel = {
      ...mockChannelData,
      save: jest.fn().mockResolvedValue({ ...mockChannelData }),
    };
    newsProvidermodel.mockImplementation(() => mockChannel);

    // Call the function
    await createChannel(req, res);

    // Capture the response passed to res.json
    const jsonResponse = res.json.mock.calls[0][0]; // First call to res.json

    // Assertions for individual properties in the response object
    expect(jsonResponse.success).toBe(true); // Check success field
    expect(jsonResponse.message).toBe('Channel created successfully'); // Check message field

    // Check channel properties individually
    expect(jsonResponse.channel.name).toBe('Test Channel'); // Check name
    expect(jsonResponse.channel.baseURL).toBe('https://testchannel.com'); // Check baseURL
    expect(jsonResponse.channel.logo).toBe('https://cloudinary.com/uploaded_image.jpg'); // Check logo
    expect(jsonResponse.channel.provider_id).toBe('user123'); // Check provider_id
  });

});
