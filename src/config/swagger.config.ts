import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MLDA E-Learning Platform API',
      version: '1.0.0',
      description:
        'API complète pour la plateforme de formation en ligne MLDA. Elle gère les utilisateurs, les cours, les inscriptions, la progression, les quiz, et bien plus.',
      contact: {
        name: 'MLDA Support',
        email: 'support@mlda.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // --- Modèles de base ---
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'cuid' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string', enum: ['STUDENT', 'TEACHER', 'ADMIN'] },
          },
        },
        Course: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'cuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            level: { type: 'string', enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
            price: { type: 'number', format: 'float' },
            thumbnail: { type: 'string', format: 'uri' },
            status: { type: 'string', enum: ['DRAFT', 'PUBLISHED'] },
          },
        },
        Lesson: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'cuid' },
            title: { type: 'string' },
            content: { type: 'string' },
            order: { type: 'integer' },
            videoUrl: { type: 'string', format: 'uri' },
          },
        },
        Product: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'cuid' },
              name: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'number', format: 'float' },
              category: { type: 'string' },
              active: { type: 'boolean' },
            },
        },
        Choice: {
          type: 'object',
          required: ['text', 'isCorrect'],
          properties: {
            text: { type: 'string', description: 'Le texte du choix de réponse' },
            isCorrect: { type: 'boolean', description: 'Indique si c\'est la bonne réponse' },
          },
        },
        Question: {
          type: 'object',
          required: ['text', 'choices'],
          properties: {
            text: { type: 'string', description: 'La question elle-même' },
            choices: {
              type: 'array',
              items: { $ref: '#/components/schemas/Choice' },
              minItems: 2,
              description: 'Liste des choix de réponse pour la question'
            },
          },
        },
        Quiz: {
          type: 'object',
          required: ['title', 'lessonId', 'questions'],
          properties: {
            title: { type: 'string', description: 'Le titre du quiz' },
            lessonId: { type: 'string', format: 'cuid', description: 'ID de la leçon associée' },
            questions: {
              type: 'array',
              items: { $ref: '#/components/schemas/Question' },
              minItems: 1,
              description: 'Liste des questions du quiz'
            },
          },
        },
        // --- Schémas pour les requêtes ---
        LoginRequest: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' },
            }
        },
        RegisterRequest: {
            type: 'object',
            required: ['email', 'password', 'firstName', 'lastName'],
            properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string', minLength: 8 },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
            }
        },
        // --- Schémas pour les réponses ---
        AuthResponse: {
            type: 'object',
            properties: {
                user: { $ref: '#/components/schemas/User' },
                token: { type: 'string' },
                message: { type: 'string' },
            }
        },
        ErrorResponse: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                errors: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            path: { type: 'string' },
                            message: { type: 'string' },
                        }
                    }
                }
            }
        }
      },
    },
  },
  apis: ['./src/api/routes/*.ts'], // Chemin vers les fichiers de routes
};

export const swaggerSpec = swaggerJsdoc(options);