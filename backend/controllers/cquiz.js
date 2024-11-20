import quiz_model from '../models/mquiz.js';

const getQuiz = async (req, res, next) => {
  const questions = await quiz_model.aggregate([{ $sample: { size: 10 } }]);
  res.send(questions);
};

export { getQuiz };