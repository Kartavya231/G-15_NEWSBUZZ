// Unit tests for: ForgotPassword


import sendEmail from '../../algorithms/SendEmail.js';
import verificationcodemodel from '../../models/mverificationcode.js';
import { ForgotPassword } from '../csendemail';


jest.mock("../../algorithms/SendEmail.js");
jest.mock("../../models/mverificationcode.js");

describe('ForgotPassword() ForgotPassword method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        CheckUserExist: true
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should update the verification code if user exists and send an email', async () => {
      // Mocking the database and email sending behavior
      verificationcodemodel.findOneAndUpdate.mockResolvedValue({ email: req.body.email });
      sendEmail.mockResolvedValue('Email sent successfully');

      await ForgotPassword(req, res);

      expect(verificationcodemodel.findOneAndUpdate).toHaveBeenCalledWith(
        { email: req.body.email },
        expect.objectContaining({ code: expect.any(String) })
      );
      expect(sendEmail).toHaveBeenCalledWith(req.body.username, req.body.email, expect.any(String), req.body.CheckUserExist);
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should create a new verification code if user does not exist and send an email', async () => {
      req.body.CheckUserExist = false;
      verificationcodemodel.findOneAndUpdate.mockResolvedValue(null);
      verificationcodemodel.prototype.save = jest.fn().mockResolvedValue({});
      sendEmail.mockResolvedValue('Email sent successfully');

      await ForgotPassword(req, res);

      expect(verificationcodemodel.prototype.save).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalledWith(req.body.username, req.body.email, expect.any(String), req.body.CheckUserExist);
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return an error if user does not exist when CheckUserExist is true', async () => {
      verificationcodemodel.findOneAndUpdate.mockResolvedValue(null);

      await ForgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User associated with this email doesn't exist"
      });
    });

    it('should handle errors when saving a new verification code', async () => {
      req.body.CheckUserExist = false;
      verificationcodemodel.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      await ForgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    it('should handle errors when sending an email', async () => {
      verificationcodemodel.findOneAndUpdate.mockResolvedValue({ email: req.body.email });
      sendEmail.mockRejectedValue(new Error('Email service error'));

      await ForgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });
});

// End of unit tests for: ForgotPassword