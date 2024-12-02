// Unit tests for: updateUserProfile
import usermodel from "../../models/muser.js";
import { updateUserProfile } from "../cuser";

jest.mock("../../models/muser.js");

describe("updateUserProfile() method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        id: "user123",
      },
      body: {
        username: "updatedUser",
        email: "updated@example.com",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("Happy paths", () => {
    it("should update user profile successfully when user exists", async () => {
      // Arrange
      const mockUpdatedUser = {
        _id: "user123",
        username: "updatedUser",
        email: "updated@example.com",
      };
      usermodel.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

      // Act
      await updateUserProfile(req, res);

      // Assert
      expect(usermodel.findByIdAndUpdate).toHaveBeenCalledWith(
        "user123",
        { username: "updatedUser", email: "updated@example.com" },
        { new: true, runValidators: true }
      );
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Profile Updated Successfully",
      });
    });
  });

  describe("Edge cases", () => {
    it("should return an error if the user is not found", async () => {
      // Arrange
      usermodel.findByIdAndUpdate.mockResolvedValue(null);

      // Act
      await updateUserProfile(req, res);

      // Assert
      expect(usermodel.findByIdAndUpdate).toHaveBeenCalledWith(
        "user123",
        { username: "updatedUser", email: "updated@example.com" },
        { new: true, runValidators: true }
      );
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User not found",
      });
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const error = new Error("Database error");
      usermodel.findByIdAndUpdate.mockRejectedValue(error);

      // Act
      await updateUserProfile(req, res);

      // Assert
      expect(usermodel.findByIdAndUpdate).toHaveBeenCalledWith(
        "user123",
        { username: "updatedUser", email: "updated@example.com" },
        { new: true, runValidators: true }
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error updating profile",
        error: "Database error",
      });
    });
  });
});
