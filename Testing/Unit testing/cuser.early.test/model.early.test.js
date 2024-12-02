// import mongoose from 'mongoose';
import usermodel from '../../models/muser';

describe('User Model', () => {
  it('should require certificate when role is PROVIDER', async () => {
    // Create a user with role 'PROVIDER' but without certificate
    const user = new usermodel({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'PROVIDER',
      firstName: 'Test',
      lastName: 'User',
    });

    // Save the user and check for validation error
    try {
      await user.save();
    } catch (error) {
      expect(error.errors.certificate).toBeDefined(); // The certificate field should be required
      expect(error.errors.certificate.kind).toBe('required'); // The error should be of type 'required'
    }
  });
});
