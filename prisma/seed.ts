import { PrismaClient, UserRole, CourseLevel, PublishStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // --- Clean up existing data ---
  // The order of deletion is important to avoid foreign key constraint violations.
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.choice.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.paymentItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.course.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.message.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleaned up existing data.');

  // --- Create Users ---
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  const teacher1 = await prisma.user.create({
    data: {
      email: 'teacher1@example.com',
      password: hashedPassword,
      firstName: 'Alice',
      lastName: 'Teacher',
      role: UserRole.TEACHER,
      profile: {
        create: {
            bio: 'Experienced language instructor with a passion for teaching beginners.'
        }
      }
    },
  });

  const student1 = await prisma.user.create({
    data: {
      email: 'student1@example.com',
      password: hashedPassword,
      firstName: 'Bob',
      lastName: 'Student',
      role: UserRole.STUDENT,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'student2@example.com',
      password: hashedPassword,
      firstName: 'Charlie',
      lastName: 'Learner',
      role: UserRole.STUDENT,
    },
  });

  console.log(`Created users: admin, ${teacher1.firstName}, ${student1.firstName}, ${student2.firstName}`);

  // --- Create Courses ---
  const courseA1 = await prisma.course.create({
    data: {
      title: 'Introduction to French - A1',
      description: 'A beginner course for students starting their journey with the French language.',
      level: CourseLevel.A1,
      price: 49.99,
      status: PublishStatus.PUBLISHED,
      teacherId: teacher1.id,
      lessons: {
        create: [
          { title: 'Lesson 1: Greetings & Introductions', content: 'Learn basic French greetings...', order: 1 },
          { title: 'Lesson 2: The Alphabet & Numbers', content: 'Master the French alphabet and counting.', order: 2 },
          { title: 'Lesson 3: Basic Verbs (être & avoir)', content: 'Understand and use the two most important verbs.', order: 3 },
        ],
      },
    },
  });

  const courseB1 = await prisma.course.create({
    data: {
      title: 'Intermediate French - B1',
      description: 'Deepen your understanding of French grammar and vocabulary.',
      level: CourseLevel.B1,
      price: 79.99,
      status: PublishStatus.PUBLISHED,
      featured: true,
      teacherId: teacher1.id,
      lessons: {
        create: [
          { title: 'Lesson 1: Past Tenses (Passé Composé vs. Imparfait)', content: 'Learn the difference and when to use each.', order: 1 },
          { title: 'Lesson 2: The Subjunctive Mood', content: 'Explore the complexities of the subjunctive.', order: 2 },
        ],
      },
    },
  });

  console.log(`Created courses: "${courseA1.title}" and "${courseB1.title}"`);

  // --- Create Enrollments ---
  await prisma.enrollment.create({
      data: {
          studentId: student1.id,
          courseId: courseA1.id,
          progress: 25.5,
      }
  });

  await prisma.enrollment.create({
      data: {
          studentId: student2.id,
          courseId: courseA1.id,
          progress: 50,
      }
  });

  await prisma.enrollment.create({
      data: {
          studentId: student1.id,
          courseId: courseB1.id,
          progress: 10,
      }
  });

  console.log('Created enrollments for students.');

  // --- Create a Product ---
  await prisma.product.create({
      data: {
          name: 'French Vocabulary Flashcards',
          description: 'A set of 500 high-quality flashcards for all levels.',
          price: 19.99,
          category: 'study-aids'
      }
  });

  console.log('Created a sample product.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });