
// Unit tests for: getQuiz


import quiz_model from '../../models/mquiz.js';
import { getQuiz } from '../cquiz';


// Mock the quiz_model.aggregate method
jest.mock("../../models/mquiz.js", () => ({
  aggregate: jest.fn(),
}));

describe('getQuiz() getQuiz method', () => {
  let req, res, next;

  beforeEach(() => {
    req = {}; // Mock request object
    res = {
      send: jest.fn(), // Mock response object with a send method
    };
    next = jest.fn(); // Mock next function
  });

  describe('Happy Paths', () => {
    it('should return 10 random questions when quiz_model.aggregate resolves successfully', async () => {
      // Arrange: Mock the aggregate method to return 10 questions
      const mockQuestions = Array.from({ length: 10 }, (_, i) => ({ id: i, question: `Question ${i}` }));
      quiz_model.aggregate.mockResolvedValue(mockQuestions);

      // Act: Call the getQuiz function
      await getQuiz(req, res, next);

      // Assert: Check that res.send was called with the correct data
      expect(res.send).toHaveBeenCalledWith(mockQuestions);
    });
  });

  describe('Edge Cases', () => {
    it('should handle the case when quiz_model.aggregate returns fewer than 10 questions', async () => {
      // Arrange: Mock the aggregate method to return fewer than 10 questions
      const mockQuestions = Array.from({ length: 5 }, (_, i) => ({ id: i, question: `Question ${i}` }));
      quiz_model.aggregate.mockResolvedValue(mockQuestions);

      // Act: Call the getQuiz function
      await getQuiz(req, res, next);

      // Assert: Check that res.send was called with the available questions
      expect(res.send).toHaveBeenCalledWith(mockQuestions);
    });

    it('should handle the case when quiz_model.aggregate returns an empty array', async () => {
      // Arrange: Mock the aggregate method to return an empty array
      quiz_model.aggregate.mockResolvedValue([]);

      // Act: Call the getQuiz function
      await getQuiz(req, res, next);

      // Assert: Check that res.send was called with an empty array
      expect(res.send).toHaveBeenCalledWith([]);
    });


  });
});

// End of unit tests for: getQuiz
