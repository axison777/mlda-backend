import { z } from 'zod';

const choiceSchema = z.object({
  text: z.string().min(1, 'Choice text is required'),
  isCorrect: z.boolean(),
});

const questionSchema = z.object({
  text: z.string().min(1, 'Question text is required'),
  choices: z.array(choiceSchema).min(2, 'Each question must have at least 2 choices'),
});

export const createQuizSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Quiz title is required'),
    lessonId: z.string().cuid('A valid lesson ID is required'),
    questions: z.array(questionSchema).min(1, 'A quiz must have at least 1 question'),
  }),
});

export const submitAttemptSchema = z.object({
  params: z.object({
    quizId: z.string().cuid('Invalid quiz ID'),
  }),
  body: z.object({
    answers: z.array(
      z.object({
        questionId: z.string().cuid('Invalid question ID'),
        choiceId: z.string().cuid('Invalid choice ID'),
      })
    ).min(1, 'At least one answer is required'),
    timeSpent: z.number().int().positive('timeSpent must be a positive integer'),
  }),
});

export const quizIdParamSchema = z.object({
    params: z.object({
      id: z.string().cuid('Invalid quiz ID'),
    }),
  });