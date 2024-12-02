
// Unit tests for: removehistory


import history_model from "../../models/mhistory.js";
import { removehistory } from '../chistory';


jest.mock("../../models/mhistory.js");

describe('removehistory() removehistory method', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: { id: 'user123' },
            body: jest.fn().mockReturnValue({ baseURL: 'http://example.com/article' })
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('Happy paths', () => {
        it('should remove an article from history when it exists', async () => {
            // Mocking the user history
            const mockHistory = {
                historyData: [
                    { link: 'http://example.com/article', title: 'Example Article' },
                    { link: 'http://example.com/another', title: 'Another Article' }
                ],
                save: jest.fn()
            };
            history_model.findOne.mockResolvedValue(mockHistory);

            await removehistory(req, res, next);

            // Check that the article was removed
            expect(mockHistory.historyData).toHaveLength(1);
            expect(mockHistory.historyData[0].link).toBe('http://example.com/another');
            expect(mockHistory.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(202);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: "Article Removed from History" });
        });
    });

    describe('Edge cases', () => {
        it('should return a message when the user has no history', async () => {
            // Mocking no user history found
            history_model.findOne.mockResolvedValue(null);

            await removehistory(req, res, next);

            expect(res.status).toHaveBeenCalledWith(210);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "History of Article not Found" });
        });

        it('should handle when the article to remove does not exist in history', async () => {
            // Mocking the user history without the article
            const mockHistory = {
                historyData: [
                    { link: 'http://example.com/another', title: 'Another Article' }
                ],
                save: jest.fn()
            };
            history_model.findOne.mockResolvedValue(mockHistory);

            await removehistory(req, res, next);

            // Check that the history remains unchanged
            expect(mockHistory.historyData).toHaveLength(1);
            expect(mockHistory.historyData[0].link).toBe('http://example.com/another');
            expect(mockHistory.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(202);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: "Article Removed from History" });
        });
    });
});

// End of unit tests for: removehistory
