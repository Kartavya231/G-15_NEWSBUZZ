
// Unit tests for: ForgotPasswordResetPassword


import usermodel from '../../models/muser.js';
import { ForgotPasswordResetPassword } from '../csendemail';


jest.mock("../../models/muser.js");

describe('ForgotPasswordResetPassword() ForgotPasswordResetPassword method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    it('should reset the password successfully when the user exists', async () => {
      // Arrange
      const req = {
        body: {
          email: 'test@example.com',
          password: 'newPassword123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      usermodel.findOneAndUpdate.mockResolvedValue({ email: 'test@example.com' });

      // Act
      await ForgotPasswordResetPassword(req, res);

      // Assert
      expect(usermodel.findOneAndUpdate).toHaveBeenCalledWith(
        { email: 'test@example.com' },
        { password: 'newPassword123' }
      );
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Password reset successfully' });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return an error when the user does not exist', async () => {
      // Arrange
      const req = {
        body: {
          email: 'nonexistent@example.com',
          password: 'newPassword123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      usermodel.findOneAndUpdate.mockResolvedValue(null);

      // Act
      await ForgotPasswordResetPassword(req, res);

      // Assert
      expect(usermodel.findOneAndUpdate).toHaveBeenCalledWith(
        { email: 'nonexistent@example.com' },
        { password: 'newPassword123' }
      );
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "User associated with this email doesn't exist" });
    });

  });
});

// End of unit tests for: ForgotPasswordResetPassword
