import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import { awardAchievementToUser } from './achievement.service';

// Type pour la création d'un quiz avec ses questions et choix
type QuizWithQuestionsAndChoices = Prisma.QuizCreateInput & {
  questions: (Prisma.QuestionCreateInput & {
    choices: Prisma.ChoiceCreateInput[];
  })[];
};

// --- Service pour créer un Quiz complet ---
export const createQuiz = async (data: QuizWithQuestionsAndChoices) => {
  const { title, lesson, questions } = data;

  return prisma.$transaction(async (tx) => {
    // 1. Créer le Quiz
    const newQuiz = await tx.quiz.create({
      data: {
        title,
        lesson,
      },
    });

    // 2. Créer les questions et les choix
    for (const questionData of questions) {
      const { text, choices } = questionData;
      await tx.question.create({
        data: {
          text,
          quizId: newQuiz.id,
          choices: {
            create: choices,
          },
        },
      });
    }

    return newQuiz;
  });
};

// --- Service pour récupérer un Quiz (pour un étudiant, sans les réponses) ---
export const getQuizForStudent = async (quizId: string) => {
  return prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          choices: {
            select: {
              id: true,
              text: true,
            },
          },
        },
      },
    },
  });
};

// --- Service pour soumettre une tentative de Quiz ---
export const submitQuizAttempt = async (
  studentId: string,
  quizId: string,
  submission: { answers: { questionId: string; choiceId: string }[], timeSpent: number }
) => {
  const { answers, timeSpent } = submission;

  return prisma.$transaction(async (tx) => {
    // 1. Récupérer les bonnes réponses pour toutes les questions du quiz
    const correctChoices = await tx.choice.findMany({
      where: {
        question: { quizId: quizId },
        isCorrect: true,
      },
      select: { id: true, questionId: true },
    });

    // 2. Calculer le score
    let score = 0;
    for (const answer of answers) {
      const isCorrect = correctChoices.some(
        (c) => c.questionId === answer.questionId && c.id === answer.choiceId
      );
      if (isCorrect) {
        score++;
      }
    }
    const finalScore = correctChoices.length > 0 ? (score / correctChoices.length) * 100 : 0;

    // 3. Créer la tentative de quiz
    const attempt = await tx.quizAttempt.create({
      data: {
        score: finalScore,
        timeSpent,
        student: { connect: { id: studentId } },
        quiz: { connect: { id: quizId } },
        answers: {
          create: answers.map((a) => ({
            question: { connect: { id: a.questionId } },
            choice: { connect: { id: a.choiceId } },
          })),
        },
      },
      include: {
        answers: true, // Inclure les réponses dans le résultat
      },
    });

    // 4. Si le score est parfait, tenter d'attribuer un succès
    if (finalScore >= 100) {
      const achievement = await tx.achievement.findUnique({
        where: { code: 'PERFECT_QUIZ_SCORE' }, // L'admin doit créer ce succès
        select: { id: true },
      });

      if (achievement) {
        await awardAchievementToUser(studentId, achievement.id, tx);
      }
    }

    // 5. Retourner le résultat complet
    return {
      attemptId: attempt.id,
      score: attempt.score,
      totalQuestions: correctChoices.length,
      correctAnswers: score,
      results: answers.map(answer => ({
        ...answer,
        isCorrect: correctChoices.some(c => c.questionId === answer.questionId && c.id === answer.choiceId)
      }))
    };
  });
};

// --- Service pour récupérer un Quiz avec ses réponses (pour un professeur/admin) ---
export const getQuizWithAnswers = async (quizId: string) => {
  return prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          choices: true, // Inclure toutes les informations sur les choix
        },
      },
    },
  });
};