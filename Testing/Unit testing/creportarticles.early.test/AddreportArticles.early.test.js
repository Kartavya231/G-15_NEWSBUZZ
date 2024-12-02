
// Unit tests for: AddreportArticles


import reportarticlesModel from '../../models/mreportarticles.js';
import { AddreportArticles } from '../creportarticles';


jest.mock("../../models/mreportarticles.js");

describe('AddreportArticles() AddreportArticles method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        title: 'Sample Title',
        link: 'http://example.com/article',
        num: 1
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  

  // Edge Case Tests
  describe('Edge Cases', () => {

    it('should handle failure to save a new article', async () => {
      // Setup: Simulate no existing article and save fails

      reportarticlesModel.findOne.mockResolvedValue({ link: req.body.link, num: 1 });
      reportarticlesModel.prototype.save = jest.fn().mockResolvedValue(null);
      reportarticlesModel.findOneAndUpdate.mockResolvedValue(null);

      await AddreportArticles(req, res);

      expect(reportarticlesModel.findOne).toHaveBeenCalledWith({ link: req.body.link});
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Article Report Failed" });
    });


    it('should handle exceptions thrown during processing', async () => {
      // Setup: Simulate an error thrown
      const errorMessage = 'Database error';
      reportarticlesModel.findOne.mockRejectedValue(new Error(errorMessage));

      await AddreportArticles(req, res);

      expect(reportarticlesModel.findOne).toHaveBeenCalledWith({ link: req.body.link });
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });


    it('should handle failure to update an existing article', async () => {
      // Setup: Simulate existing article but update fails
      reportarticlesModel.findOne.mockResolvedValue({ link: req.body.link, num: 1 });
      reportarticlesModel.findOneAndUpdate.mockResolvedValue(null);

      await AddreportArticles(req, res);

      expect(reportarticlesModel.findOne).toHaveBeenCalledWith({ link: req.body.link });
      expect(reportarticlesModel.findOneAndUpdate).toHaveBeenCalledWith({ link: req.body.link }, { num: req.body.num + 1 });
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Article Report Failed" });
    });

    // it('should handle failure to create an new article report', async () => {
    //   // Setup: Simulate existing article but update fails
    //   reportarticlesModel.findOne.mockResolvedValue(null);
    //   // reportarticlesModel.findOneAndUpdate.mockResolvedValue(null);
    //   reportarticlesModel.prototype.save = jest.fn().mockResolvedValue({title:2});

    //   await AddreportArticles(req, res);

    //   expect(reportarticlesModel.findOne).toHaveBeenCalledWith({ link: req.body.link });
    //   // expect(reportarticlesModel.findOneAndUpdate).toHaveBeenCalledWith({ link: req.body.link }, { num: req.body.num + 1 });
    //   // expect(reportarticlesModel.prototype.save).not.toHaveBeenCalled();
    //   expect(res.status).toHaveBeenCalledWith(210);
    //   expect(res.json).toHaveBeenCalledWith({ success: false, message: "Article Report Failed" });
    // });

    it('should handle failure to create a new article report', async () => {
      // Setup: Simulate no existing article and save fails
      reportarticlesModel.findOne.mockResolvedValue(null);
      reportarticlesModel.prototype.save = jest.fn().mockImplementation(() => {
        throw new Error('Save failed');
      });

      await AddreportArticles(req, res);

      expect(reportarticlesModel.findOne).toHaveBeenCalledWith({ link: req.body.link });
      expect(reportarticlesModel.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(210);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Article Report Failed" });
    });

   

    
  });
  
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should report an article successfully when it does not exist', async () => {
      // Setup: Simulate no existing article
      reportarticlesModel.findOne.mockResolvedValue(null);
      reportarticlesModel.prototype.save = jest.fn().mockResolvedValue(true);

      await AddreportArticles(req, res);

      expect(reportarticlesModel.findOne).toHaveBeenCalledWith({ link: req.body.link });
      expect(reportarticlesModel.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Article Reported Successfully" });
    });

    it('should update an existing article successfully', async () => {
      // Setup: Simulate existing article
      reportarticlesModel.findOne.mockResolvedValue({ link: req.body.link, num: 1 });
      reportarticlesModel.findOneAndUpdate.mockResolvedValue(true);

      await AddreportArticles(req, res);

      expect(reportarticlesModel.findOne).toHaveBeenCalledWith({ link: req.body.link });
      expect(reportarticlesModel.findOneAndUpdate).toHaveBeenCalledWith({ link: req.body.link }, { num: req.body.num + 1 });
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Article Reported Successfully" });
    });
  });

});

// End of unit tests for: AddreportArticles
