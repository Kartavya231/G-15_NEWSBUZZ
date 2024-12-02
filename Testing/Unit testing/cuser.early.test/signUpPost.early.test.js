
// Unit tests for: signUpPost


import jsonwebtoken from "jsonwebtoken";
import quickSearch_model from "../../models/mquicksearch.js";
import usermodel from "../../models/muser.js";
import verificationcodemodel from "../../models/mverificationcode.js";
import { v2 as cloudinary_v2 } from '../../utils/cloudinary.js';
import { signUpPost } from '../cuser';


jest.mock("../../models/muser.js");
jest.mock("../../models/mquicksearch.js");
jest.mock("../../models/mverificationcode.js");
jest.mock("jsonwebtoken");
jest.mock("../../utils/cloudinary.js");

describe('signUpPost() signUpPost method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'encryptedPassword',
        role: 'READER',
      },
      file: {
        path: 'path/to/file',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    usermodel.findOne.mockClear();
    usermodel.prototype.save.mockClear();
    quickSearch_model.prototype.save.mockClear();
    verificationcodemodel.prototype.save.mockClear();
    jsonwebtoken.sign.mockClear();
    cloudinary_v2.uploader.upload.mockClear();
  });

  

  describe('Edge Cases', () => {

    it('should handle errors during user registration', async () => {
      // Arrange
      usermodel.findOne.mockResolvedValue(null);
      usermodel.prototype.save.mockRejectedValue(new Error('Database error'));

      // Act
      await signUpPost(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Error in signup', err: expect.any(Error) });
    });


    it('should return an error if any field is missing', async () => {
      // Arrange
      req.body.username = '';

      // Act
      await signUpPost(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Please fill all the fields' });
    });

    it('should return an error if user already exists', async () => {
      // Arrange
      usermodel.findOne.mockResolvedValue({});

      // Act
      await signUpPost(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, error: 'User already exists for given role' });
    });


  });


  describe('Happy Paths', () => {


    it('should register a new user successfully for READER role', async () => {
      // Arrange
      const mockUser = {
        _id: 'mockUserId',
        username: 'testuser',
        email: 'test@example.com',
        role: 'READER',
        password: 'encryptedPassword',
        certificate: 'path/to/file',
        save: jest.fn().mockResolvedValue(),
      };

      usermodel.mockImplementation(() => mockUser);

      usermodel.findOne.mockResolvedValue(null);
      quickSearch_model.prototype.save.mockResolvedValue({});
      verificationcodemodel.prototype.save.mockResolvedValue({});
      jsonwebtoken.sign.mockReturnValue('mockToken');

      // Act
      await signUpPost(req, res);

      
      // Assert
      expect(usermodel.findOne).toHaveBeenCalledWith({ email: 'test@example.com', role: 'READER' });
      expect(mockUser.save).toHaveBeenCalled();
      expect(quickSearch_model.prototype.save).toHaveBeenCalled();
      expect(verificationcodemodel.prototype.save).toHaveBeenCalled();
      expect(jsonwebtoken.sign).toHaveBeenCalledWith(
        { id: 'mockUserId', username: 'testuser' },
        process.env.JWT_SECRET
      );
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'user registered successfully', token: 'mockToken' });
    });


    it('should register a new user successfully for PROVIDER role', async () => {
      // Arrange
      const mockUser = {
        _id: 'mockUserId',
        username: 'testuser',
        email: 'test@example.com',
        role: 'READER',
        password: 'encryptedPassword',
        certificate: 'path/to/file',
        save: jest.fn().mockResolvedValue(),
      };


      usermodel.mockImplementation(() => mockUser);


      req.body.role = 'PROVIDER';
      usermodel.findOne.mockResolvedValue(null);
      
      usermodel.prototype.save.mockResolvedValue({});
      cloudinary_v2.uploader.upload.mockResolvedValue({ secure_url: 'mockCloudinaryURL' });
      jsonwebtoken.sign.mockReturnValue('mockToken');

      // Act
      await signUpPost(req, res);

      // Assert
      expect(mockUser.save).toHaveBeenCalled();
      expect(cloudinary_v2.uploader.upload).toHaveBeenCalledWith('path/to/file', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'user registered successfully', token: 'mockToken' });
    });
  });


});

// End of unit tests for: signUpPost
