const db = require("../db");
const User = require("../models/user");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");

// Mock the database query
jest.mock("../db");

describe("User Model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /** Test for authenticating a user successfully */
  describe("authenticate", () => {
    test("authenticates user with correct credentials", async () => {
      const mockDbResponse = {
        rows: [{
          username: "testuser",
          password: "password",  // Plain text password for testing
          first_name: "Test",
          email: "test@example.com",
          user_type: "admin"
        }],
      };

      db.query.mockResolvedValueOnce(mockDbResponse);

      const user = await User.authenticate("test@example.com", "password");

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT username"),
        ["test@example.com"]
      );
      expect(user).toEqual({
        username: "testuser",
        first_name: "Test",
        email: "test@example.com",
        user_type: "admin"
      });
    });

    test("throws UnauthorizedError if credentials are incorrect", async () => {
      const mockDbResponse = {
        rows: [{
          username: "testuser",
          password: "password",  // Plain text password for testing
          first_name: "Test",
          email: "test@example.com",
          user_type: "admin"
        }],
      };

      db.query.mockResolvedValueOnce(mockDbResponse);

      await expect(User.authenticate("test@example.com", "wrongpassword"))
        .rejects
        .toThrow(UnauthorizedError);
    });
  });

  /** Test for registering a user successfully */
  describe("register", () => {
    test("successfully registers a new user", async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // No duplicate

      const mockDbResponse = {
        rows: [{
          user_type: "admin",
          username: "testuser",
          first_name: null,
          password: "password",  // Plain text password for testing
          email: "test@example.com",
          created_at: new Date().toLocaleString(),
        }],
      };
      db.query.mockResolvedValueOnce(mockDbResponse);

      const user = await User.register({
        username: "testuser",
        password: "password",
        email: "test@example.com"
      });

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT email"),
        ["test@example.com"]
      );
      expect(user).toEqual(mockDbResponse.rows[0]);
    });

    test("throws BadRequestError if email already exists", async () => {
      db.query.mockResolvedValueOnce({ rows: [{ email: "test@example.com" }] }); // Duplicate email

      await expect(User.register({
        username: "testuser",
        password: "password",
        email: "test@example.com"
      })).rejects.toThrow(BadRequestError);
    });
  });

  /** Test for retrieving a user successfully */
  describe("get", () => {
    test("successfully retrieves user data by email", async () => {
      const mockDbResponse = {
        rows: [{
          user_type: "admin",
          username: "testuser",
          first_name: "Test",
          user_id: 1,
          email: "test@example.com"
        }],
      };

      db.query.mockResolvedValueOnce(mockDbResponse);

      const user = await User.get("test@example.com");

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT user_type"),
        ["test@example.com"]
      );
      expect(user).toEqual(mockDbResponse.rows[0]);
    });

    test("throws NotFoundError if user not found", async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(User.get("nonexistent@example.com"))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  /** Test for updating a user successfully */
  describe("update", () => {
    test("successfully updates user data", async () => {
      const mockDbResponse = {
        rows: [{
          username: "testuser",
          firstName: "Updated",
          email: "test@example.com"
        }],
      };

      db.query.mockResolvedValueOnce(mockDbResponse);

      const updatedUser = await User.update("test@example.com", {
        firstName: "Updated",
        password: "newpassword"  // Plain text password for testing
      });

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE users"),
        expect.arrayContaining(["Updated", "newpassword", "test@example.com"])
      );
      expect(updatedUser).toEqual(mockDbResponse.rows[0]);
    });

    test("throws NotFoundError if user not found", async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(User.update("nonexistent@example.com", { firstName: "Updated" }))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  /** Test for deleting a user successfully */
  describe("remove", () => {
    test("successfully deletes a user", async () => {
      const mockDbResponse = {
        rows: [{ email: "test@example.com" }],
      };

      db.query.mockResolvedValueOnce(mockDbResponse);

      await User.remove("test@example.com");

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM users"),
        ["test@example.com"]
      );
    });

    test("throws NotFoundError if user not found", async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(User.remove("nonexistent@example.com"))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  /** Test for adding a member successfully */
  describe("addMember", () => {
    test("successfully adds a new member", async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // No duplicate

      const mockDbResponse = {
        rows: [{
          user_id: 2,
          user_type: "member",
          username: null,
          first_name: null,
          password: "password",  // Plain text password for testing
          email: "newmember@example.com",
          created_at: new Date().toLocaleString(),
        }],
      };

      db.query.mockResolvedValueOnce(mockDbResponse);

      const member = await User.addMember({
        email: "newmember@example.com",
        password: "password"
      });

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT email"),
        ["newmember@example.com"]
      );
      expect(member).toEqual(mockDbResponse.rows);
    });

    test("throws BadRequestError if email already exists", async () => {
      db.query.mockResolvedValueOnce({ rows: [{ email: "existing@example.com" }] }); // Duplicate email

      await expect(User.addMember({
        email: "existing@example.com",
        password: "password"
      })).rejects.toThrow(BadRequestError);
    });
  });
});
