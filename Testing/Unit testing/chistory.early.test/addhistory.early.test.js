
// Unit tests for: addhistory


import history_model from "../../models/mhistory.js";
import { addhistory } from '../chistory';


// Mock the history_model
jest.mock("../../models/mhistory.js");

describe('addhistory() addhistory method', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: { id: 'user123' },
            body: { title: 'Test Article', link: 'http://test.com' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('Edge cases', () => {
        it('should handle missing title or link in request body', async () => {
            req.body = {}; // Missing title and link

            await addhistory(req, res, next);

            expect(res.status).toHaveBeenCalledWith(210);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "Title and link are required" });
        });

    });
    

    describe('Happy paths', () => {
        it('should add a new article to existing user history', async () => {
            // Mock existing user history
            const mockUserHistory = {
                historyData: [],
                save: jest.fn()
            };
            history_model.findOne.mockResolvedValue(mockUserHistory);

            await addhistory(req, res, next);

            expect(history_model.findOne).toHaveBeenCalledWith({ userid: 'user123' });
            expect(mockUserHistory.historyData.length).toBe(1);
            expect(mockUserHistory.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(202);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: "Article Added to History" });
        });

        it('should create a new history record if user has no history', async () => {
            // Mock no existing user history
            history_model.findOne.mockResolvedValue(null);
            const mockSave = jest.fn();
            history_model.mockImplementation(() => ({
                save: mockSave
            }));

            await addhistory(req, res, next);

            expect(history_model.findOne).toHaveBeenCalledWith({ userid: 'user123' });
            expect(mockSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(202);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: "Article Added to History" });
        });
    });

    
});

// End of unit tests for: addhistory
