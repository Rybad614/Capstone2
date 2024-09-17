// Import necessary modules and the Calendar class
const Calendar = require('../models/calendar');
const db = require('../db'); // Mock the database
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

// Setup mock for axios
const mock = new MockAdapter(axios);

describe('Calendar Model', () => {

  beforeAll(() => {
    // Set up any required initializations like environment variables
  });

  afterEach(() => {
    mock.reset(); // Reset the mock after each test
  });

  afterAll(async () => {
    await db.end(); // Close database connection
  });

  describe('create', () => {
    test('should create a new calendar successfully', async () => {
      // Arrange
      const calendarData = {
        name: 'Team Calendar',
        description: 'Calendar for team events',
        user_grant: 'user-grant-id',
        user_id: 1,
      };

      // Mock the Nylas API response for creating a calendar
      mock.onPost('https://api.nylas.com/calendars').reply(200, {
        id: 'calendar-id',
        name: calendarData.name,
      });

      // Mock the database insert query
      const dbQueryMock = jest.spyOn(db, 'query').mockResolvedValue({
        rows: [{
          name: calendarData.name,
          description: calendarData.description,
          user_id: calendarData.user_id,
        }],
      });

      // Act
      const result = await Calendar.create(calendarData);

      // Assert
      expect(result).toEqual({
        name: calendarData.name,
        description: calendarData.description,
        user_id: calendarData.user_id,
      });
      expect(dbQueryMock).toHaveBeenCalledTimes(1);
      expect(dbQueryMock).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO calendars'),
        [
          calendarData.name,
          calendarData.description,
          calendarData.user_grant,
          calendarData.user_id,
        ],
      );
    });
  });

  describe("view", () => {
    test("successfully retrieves calendars from both Nylas and database", async () => {
      // Mock database result for user_grant
      db.query.mockResolvedValueOnce({
        rows: [{ user_grant: "test-grant" }]
      });
  
      // Mock Nylas API response
      mock.onGet('https://api.nylas.com/calendars').reply(200, {
        id: 'nylas-calendar-id',
        name: 'Test Calendar',
      });
  
      // Mock database result for calendars
      db.query.mockResolvedValueOnce({
        rows: [{ calendar_id: 1, name: "Test Calendar", description: "Test Description", user_id: 1 }]
      });
  
      // Act
      const calendars = await Calendar.view(1);
  
      // Assert

      // Check if the database queries were made correctly
      expect(db.query).toHaveBeenCalledTimes(3);
  
      // Assert the returned result
      expect(calendars).toEqual([{ calendar_id: 1, name: "Test Calendar", description: "Test Description", user_id: 1 }]);
    });
  
    test("throws an error when no user_grant is found", async () => {
      // Arrange
      const calendarData = {
        name: 'Team Calendar',
        description: 'Calendar for team events',
        user_grant: 'user-grant-id',
        user_id: 1,
      };

      // Mock database result for user_grant as an empty array
      db.query.mockResolvedValueOnce({
        rows: []
      });
  
      // Execute the view method and expect an error
      const result = await Calendar.view(1);
  
      // Check that the query was called
      expect(db.query).toHaveBeenCalledWith(expect.any(String), [1]);
  
      // Validate the results
      expect(result).toEqual([
        {
          name: calendarData.name,
          description: calendarData.description,
          user_id: calendarData.user_id,
        }
      ]);
    });
  
    test("logs error when Nylas API request fails", async () => {
      // Mock database result for user_grant
      db.query.mockResolvedValueOnce({
        rows: [{ user_grant: "test-grant" }]
      });
  
      // Mock database result for calendars
      db.query.mockResolvedValueOnce({
        rows: [{ calendar_id: 1, name: "Test Calendar", description: "Test Description", user_id: 1 }]
      });
  
      // Spy on console.error to check if the error is logged
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  
      // Execute the view method
      const calendars = await Calendar.view(1);
  
      // Ensure the error was logged
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching calendar:", expect.any(Error));
  
      // Ensure it returned the database result even after the Nylas API error
      expect(calendars).toEqual([{ calendar_id: 1, name: "Test Calendar", description: "Test Description", user_id: 1 }]);
  
      // Clean up the console spy
      consoleSpy.mockRestore();
    });
  });
});
