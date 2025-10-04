import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Activer CORS pour toutes les routes
app.use(express.json()); // Pour parser les corps de requête en JSON

// Importer les routes
import authRoutes from './api/routes/auth.routes';
import courseRoutes from './api/routes/course.routes';
import lessonRoutes from './api/routes/lesson.routes';
import enrollmentRoutes from './api/routes/enrollment.routes';
import progressRoutes from './api/routes/progress.routes';
import userRoutes from './api/routes/user.routes';
import quizRoutes from './api/routes/quiz.routes';
import messageRoutes from './api/routes/message.routes';
import achievementRoutes from './api/routes/achievement.routes';
import profileRoutes from './api/routes/profile.routes';
import productRoutes from './api/routes/product.routes';
import paymentRoutes from './api/routes/payment.routes';
import statsRoutes from './api/routes/stats.routes';
import announcementRoutes from './api/routes/announcement.routes';
import campaignRoutes from './api/routes/campaign.routes';

// Route de test
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running and healthy!' });
});

// Utiliser les routes de l'API
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/campaigns', campaignRoutes);

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';

// ... (previous routes)

// --- Swagger Docs ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Démarrer le serveur
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
  console.log(`📚 API Docs available at http://localhost:${port}/api-docs`);
});

export default app;