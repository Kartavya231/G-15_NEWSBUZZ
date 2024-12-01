import React, { useEffect, useState } from "react";
import { GET } from "../api";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  LinearProgress,
  Fade,
  Stack,
  Chip,
  Divider
} from "@mui/material";
import {
  NavigateNext,
  NavigateBefore,
  Send,
  Check,
  Close
} from "@mui/icons-material";

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(10).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [quizReport, setQuizReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GET('/api/quiz/getquestions');
        setQuestions(response.data);
        setLoading(false);
      } catch (e) {
        console.log("Error fetching data:", e);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOptionClick = (option) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestion] = option;
    setSelectedAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmitQuiz = () => {
    let calculatedScore = 0;
    const reportData = questions.map((question, index) => {
      const isCorrect = selectedAnswers[index] === question.answer;
      if (isCorrect) calculatedScore++;
      return {
        question: question.questions,
        selectedAnswer: selectedAnswers[index],
        correctAnswer: question.answer,
        isCorrect,
        options: [question.optionA, question.optionB, question.optionC, question.optionD],
        isAttempted: selectedAnswers[index] !== null,
      };
    });

    setScore(calculatedScore);
    setQuizReport(reportData);
    setShowResults(true);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (showResults) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Fade in>
          <Box>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" gutterBottom>
                Quiz Results
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                <Chip
                  label={`Score: ${score}/${questions.length}`}
                  color="primary"
                  size="large"
                  sx={{ fontSize: '1.2rem', py: 2 }}
                />
                <Chip
                  label={`${Math.round((score / questions.length) * 100)}%`}
                  color={score / questions.length >= 0.6 ? "success" : "error"}
                  size="large"
                  sx={{ fontSize: '1.2rem', py: 2 }}
                />
              </Box>
            </Paper>

            <Stack spacing={2}>
              {quizReport.map((item, index) => (
                <Paper key={index} elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Question {index + 1}: {item.question}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {item.options.map((option, optIndex) => (
                      <Box
                        key={optIndex}
                        sx={{
                          p: 1,
                          my: 1,
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          bgcolor: option === item.correctAnswer
                            ? 'success.light'
                            : option === item.selectedAnswer && !item.isCorrect
                              ? 'error.light'
                              : 'background.paper'
                        }}
                      >
                        {option === item.correctAnswer ? (
                          <Check color="success" sx={{ mr: 1 }} />
                        ) : option === item.selectedAnswer && !item.isCorrect ? (
                          <Close color="error" sx={{ mr: 1 }} />
                        ) : null}
                        <Typography
                          sx={{
                            color: option === item.correctAnswer
                              ? 'success.dark'
                              : option === item.selectedAnswer && !item.isCorrect
                                ? 'error.dark'
                                : 'text.primary'
                          }}
                        >
                          {option}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Fade>
      </Container>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Fade in>
        <Card elevation={3}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8 }}
          />
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" color="primary" gutterBottom>
                News Quiz
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Question {currentQuestion + 1} of {questions.length}
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom>
              {currentQuestionData.questions}
            </Typography>

            <RadioGroup
              value={selectedAnswers[currentQuestion] || ''}
              onChange={(e) => handleOptionClick(e.target.value)}
            >
              <Stack spacing={2} sx={{ my: 3 }}>
                {["A", "B", "C", "D"].map((label) => (
                  <Paper
                    key={label}
                    variant="outlined"
                    sx={{
                      borderColor: selectedAnswers[currentQuestion] === currentQuestionData[`option${label}`]
                        ? 'primary.main'
                        : 'divider',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    <FormControlLabel
                      value={currentQuestionData[`option${label}`]}
                      control={<Radio />}
                      label={currentQuestionData[`option${label}`]}
                      sx={{
                        width: '100%',
                        m: 0,
                        p: 2
                      }}
                    />
                  </Paper>
                ))}
              </Stack>
            </RadioGroup>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                startIcon={<NavigateBefore />}
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              {currentQuestion === questions.length - 1 ? (
                <Button
                  variant="contained"
                  endIcon={<Send />}
                  onClick={handleSubmitQuiz}
                  disabled={selectedAnswers.some((answer, index) => index <= currentQuestion && answer === null)}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  variant="contained"
                  endIcon={<NavigateNext />}
                  onClick={handleNextQuestion}
                  disabled={!selectedAnswers[currentQuestion]}
                >
                  Next
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
};

export default QuizApp;