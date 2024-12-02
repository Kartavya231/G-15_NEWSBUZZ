// Unit tests for: isUserExistWhenSignUp
import usermodel from "../../models/muser.js";
import { isUserExistWhenSignUp } from "../cuser";

jest.mock("../../models/muser.js");

describe("isUserExistWhenSignUp() method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        role: "READER",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("Happy paths", () => {
    it("should return success message when user does not exist", async () => {
      // Arrange
      usermodel.findOne.mockResolvedValue(null);

      // Act
      await isUserExistWhenSignUp(req, res);

      // Assert
      expect(usermodel.findOne).toHaveBeenCalledWith({
        email: "test@example.com",
        role: "READER",
      });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User does not exist",
      });
    });
  });

  describe("Edge cases", () => {
    it("should return an error if user already exists", async () => {
      // Arrange
      const mockUser = { _id: "user123", email: "test@example.com", role: "READER" };
      usermodel.findOne.mockResolvedValue(mockUser);

      // Act
      await isUserExistWhenSignUp(req, res);

      // Assert
      expect(usermodel.findOne).toHaveBeenCalledWith({
        email: "test@example.com",
        role: "READER",
      });
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User already exists for given role",
      });
    });

    it("should return an error if email or role is missing in request body", async () => {
      // Arrange
      req.body.email = null;

      // Act
      await isUserExistWhenSignUp(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Email and role are required",
      });
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const error = new Error("Database error");
      usermodel.findOne.mockRejectedValue(error);

      // Act
      await isUserExistWhenSignUp(req, res);

      // Assert
      expect(usermodel.findOne).toHaveBeenCalledWith({
        email: "test@example.com",
        role: "READER",
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error checking user existence",
        error: "Database error",
      });
    });
  });
});
