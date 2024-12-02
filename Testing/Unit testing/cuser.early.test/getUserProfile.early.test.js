import usermodel from "../../models/muser.js";
import { getUserProfile } from "../cuser";

jest.mock("../../models/muser.js");

describe("getUserProfile() method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        id: "user123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("Happy paths", () => {
    it("should return user profile successfully when user exists", async () => {
      // Arrange
      const mockUser = {
        _id: "user123",
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword",
        toObject: jest.fn().mockReturnValue({
          _id: "user123",
          username: "testuser",
          email: "test@example.com",
        }),
      };

      usermodel.findById.mockResolvedValue(mockUser);

      // Act
      await getUserProfile(req, res);

      // Assert
      expect(usermodel.findById).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: {
          _id: "user123",
          username: "testuser",
          email: "test@example.com",
        },
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle case when user does not exist", async () => {
      // Arrange
      usermodel.findById.mockResolvedValue(null);

      // Act
      await getUserProfile(req, res);

      // Assert
      expect(usermodel.findById).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User not found",
      });
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const error = new Error("Database error");
      usermodel.findById.mockRejectedValue(error);

      // Act
      await getUserProfile(req, res);

      // Assert
      expect(usermodel.findById).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error retrieving user profile",
        error: "Database error",
      });
    });
  });
});
