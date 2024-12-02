
// Unit tests for: ForgotPasswordVarifyCode


import verificationcodemodel from '../../models/mverificationcode.js';
import { ForgotPasswordVarifyCode } from '../csendemail';


jest.mock("../../models/mverificationcode.js");

describe('ForgotPasswordVarifyCode() ForgotPasswordVarifyCode method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        code: ['1', '2', '3', '4', '5', '6']
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });



  describe('Edge Cases', () => {

    it('should handle a missing email in the request body', async () => {
      // Arrange
      req.body.email = undefined;

      // Act
      await ForgotPasswordVarifyCode(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "User associated with this email doesn't exist" });
    });
    
    it('should return an error if the user associated with the email does not exist', async () => {
      // Arrange
      verificationcodemodel.findOne.mockResolvedValue(null);

      // Act
      await ForgotPasswordVarifyCode(req, res);

      // Assert
      expect(verificationcodemodel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "User associated with this email doesn't exist" });
    });

    it('should return an error if the verification code is invalid', async () => {
      // Arrange
      verificationcodemodel.findOne.mockResolvedValue({ code: '654321' });

      // Act
      await ForgotPasswordVarifyCode(req, res);

      // Assert
      expect(verificationcodemodel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Invalid verification code" });
    });

  });


  describe('Happy Paths', () => {
    it('should verify the code successfully when the email and code match', async () => {
      // Arrange
      verificationcodemodel.findOne.mockResolvedValue({ code: '123456' });

      // Act
      await ForgotPasswordVarifyCode(req, res);

      // Assert
      expect(verificationcodemodel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "verification successfully" });
    });
  });
});

// End of unit tests for: ForgotPasswordVarifyCode
