const db = require("../db");
const GroupChat = require("../models/groupchat");

// Mock the database query
jest.mock("../db");

describe("GroupChat Model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /** Test for creating a group chat successfully */
  describe("create", () => {
    test("successfully creates a group chat", async () => {
      const mockDbResponse = {
        rows: [{
          chat_group_id: 1,
          group_name: "Test Group",
          created_by: 1,
          created_at: new Date().toLocaleString(),
        }],
      };

      db.query.mockResolvedValueOnce(mockDbResponse);

      const chat = await GroupChat.create({
        group_name: "Test Group",
        created_by: 1
      });

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO groupchats"),
        expect.arrayContaining(["Test Group", 1, expect.any(String)])
      );

      expect(chat).toEqual(mockDbResponse.rows[0]);
    });
  });

  /** Test for sending a message successfully */
  describe("sendMessage", () => {
    test("successfully sends a message", async () => {
      const mockDbResponse = {
        rows: [{
          message_id: 1,
          chat_group_id: 1,
          sender_id: 1,
          message_text: "Hello World",
          timestamp: "2024-08-28 12:00:00"
        }],
      };

      db.query.mockResolvedValueOnce(mockDbResponse);

      const message = await GroupChat.sendMessage({
        chat_group_id: 1,
        sender_id: 1,
        message_text: "Hello World",
        timestamp: "2024-08-28 12:00:00"
      });

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO messages"),
        expect.arrayContaining([1, 1, "Hello World", "2024-08-28 12:00:00"])
      );

      expect(message).toEqual(mockDbResponse.rows[0]);
    });
  });

  /** Test for retrieving a chat successfully */
  describe("getChat", () => {
    test("successfully retrieves chat data", async () => {
      const mockDbResponse = {
        rows: [{
          chat_group_id: 1,
          group_name: "Test Group",
          sender_id: 1,
          message_text: "Hello World",
          timestamp: "2024-08-28 12:00:00",
          user_type: "admin",
          email: "test@example.com"
        }],
      };

      db.query.mockResolvedValueOnce(mockDbResponse);

      const chat = await GroupChat.getChat(1);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT g.chat_group_id, g.group_name"),
        [1]
      );

      expect(chat).toEqual(mockDbResponse.rows);
    });
  });

  /** Test for deleting a group chat successfully */
  describe("delete", () => {
    test("successfully deletes a group chat", async () => {
      const mockDbResponse = {
        rows: [{
          chat_group_id: 1,
          group_name: "Test Group",
          created_by: 1,
          created_at: new Date().toLocaleString(),
        }],
      };

      db.query.mockResolvedValueOnce(mockDbResponse);

      await GroupChat.delete(1);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM groupchats"),
        [1]
      );
    });
  });
});
