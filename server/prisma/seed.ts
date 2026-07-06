import { prisma } from '../src/config/database';
import { hashPassword } from '../src/utils/bcrypt';
import { Priority, Status } from '@prisma/client';

async function main(): Promise<void> {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.activityLog.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.taskLabel.deleteMany();
  await prisma.label.deleteMany();
  await prisma.task.deleteMany();
  await prisma.column.deleteMany();
  await prisma.boardMember.deleteMany();
  await prisma.board.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create users
  const demoPassword = await hashPassword('password123');

  const owner = await prisma.user.create({
    data: {
      email: 'demo@kanban.com',
      password: demoPassword,
      name: 'Demo User',
      avatarUrl: null,
      role: 'MEMBER',
    },
  });

  const teammate = await prisma.user.create({
    data: {
      email: 'teammate@kanban.com',
      password: demoPassword,
      name: 'Teammate',
      avatarUrl: null,
      role: 'MEMBER',
    },
  });

  console.log('👥 Created users');

  // Create labels
  const labels = await Promise.all([
    prisma.label.create({ data: { name: 'Bug', color: '#EF4444' } }),
    prisma.label.create({ data: { name: 'Feature', color: '#3B82F6' } }),
    prisma.label.create({ data: { name: 'Design', color: '#8B5CF6' } }),
    prisma.label.create({ data: { name: 'Urgent', color: '#F59E0B' } }),
    prisma.label.create({ data: { name: 'Documentation', color: '#10B981' } }),
  ]);

  console.log('🏷️  Created labels');

  // Create board
  const board = await prisma.board.create({
    data: {
      title: 'Q3 Product Roadmap',
      description: 'Planning and tracking for the third quarter deliverables',
      ownerId: owner.id,
      members: {
        create: [
          { userId: owner.id, role: 'OWNER' },
          { userId: teammate.id, role: 'MEMBER' },
        ],
      },
    },
  });

  console.log('📋 Created board');

  // Create columns
  const columns = await Promise.all([
    prisma.column.create({ data: { boardId: board.id, title: 'Backlog', order: 0 } }),
    prisma.column.create({ data: { boardId: board.id, title: 'To Do', order: 1 } }),
    prisma.column.create({ data: { boardId: board.id, title: 'In Progress', order: 2 } }),
    prisma.column.create({ data: { boardId: board.id, title: 'Review', order: 3 } }),
    prisma.column.create({ data: { boardId: board.id, title: 'Done', order: 4 } }),
  ]);

  console.log('📊 Created columns');

  // Create tasks
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const tasks = await Promise.all([
    // Backlog tasks
    prisma.task.create({
      data: {
        boardId: board.id,
        columnId: columns[0].id,
        title: 'Research competitor analysis',
        description: 'Analyze top 3 competitors and document findings',
        priority: Priority.MEDIUM,
        status: Status.BACKLOG,
        dueDate: nextWeek,
        order: 0,
        createdById: owner.id,
        labels: { create: [{ labelId: labels[4].id }] },
      },
    }),
    prisma.task.create({
      data: {
        boardId: board.id,
        columnId: columns[0].id,
        title: 'Draft API specification',
        description: 'Design REST API endpoints for v2',
        priority: Priority.HIGH,
        status: Status.BACKLOG,
        dueDate: tomorrow,
        order: 1,
        createdById: owner.id,
        assignedToId: teammate.id,
        labels: { create: [{ labelId: labels[1].id }] },
      },
    }),

    // To Do tasks
    prisma.task.create({
      data: {
        boardId: board.id,
        columnId: columns[1].id,
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        priority: Priority.HIGH,
        status: Status.TODO,
        dueDate: tomorrow,
        order: 0,
        createdById: owner.id,
        labels: { create: [{ labelId: labels[1].id }, { labelId: labels[3].id }] },
        checklist: {
          create: [
            { text: 'Configure test runner', order: 0, isCompleted: true },
            { text: 'Set up deployment script', order: 1, isCompleted: false },
            { text: 'Add environment variables', order: 2, isCompleted: false },
          ],
        },
      },
    }),
    prisma.task.create({
      data: {
        boardId: board.id,
        columnId: columns[1].id,
        title: 'Update user documentation',
        description: 'Refresh the getting started guide with new screenshots',
        priority: Priority.LOW,
        status: Status.TODO,
        dueDate: nextWeek,
        order: 1,
        createdById: teammate.id,
        labels: { create: [{ labelId: labels[4].id }] },
      },
    }),

    // In Progress tasks
    prisma.task.create({
      data: {
        boardId: board.id,
        columnId: columns[2].id,
        title: 'Implement drag and drop',
        description: 'Integrate @dnd-kit for column and task reordering',
        priority: Priority.URGENT,
        status: Status.IN_PROGRESS,
        dueDate: now,
        order: 0,
        createdById: owner.id,
        assignedToId: owner.id,
        labels: { create: [{ labelId: labels[1].id }, { labelId: labels[3].id }] },
        checklist: {
          create: [
            { text: 'Install dnd-kit packages', order: 0, isCompleted: true },
            { text: 'Implement column sorting', order: 1, isCompleted: true },
            { text: 'Implement cross-column task moves', order: 2, isCompleted: false },
          ],
        },
      },
    }),

    // Review tasks
    prisma.task.create({
      data: {
        boardId: board.id,
        columnId: columns[3].id,
        title: 'Code review: auth module',
        description: 'Review JWT implementation and password hashing',
        priority: Priority.HIGH,
        status: Status.REVIEW,
        dueDate: tomorrow,
        order: 0,
        createdById: teammate.id,
        assignedToId: owner.id,
        labels: { create: [{ labelId: labels[0].id }] },
      },
    }),

    // Done tasks
    prisma.task.create({
      data: {
        boardId: board.id,
        columnId: columns[4].id,
        title: 'Project setup',
        description: 'Initialize repository with folder structure and tooling',
        priority: Priority.MEDIUM,
        status: Status.DONE,
        order: 0,
        createdById: owner.id,
        labels: { create: [{ labelId: labels[1].id }] },
      },
    }),
  ]);

  console.log('✅ Created tasks');

  // Add comments
  await Promise.all([
    prisma.comment.create({
      data: {
        taskId: tasks[2].id,
        userId: teammate.id,
        content: 'Great progress! Let me know when the deployment script is ready for review.',
      },
    }),
    prisma.comment.create({
      data: {
        taskId: tasks[4].id,
        userId: teammate.id,
        content: 'The cross-column moves are tricky. Happy to pair on this!',
      },
    }),
  ]);

  console.log('💬 Created comments');

  // Add activity logs
  await Promise.all([
    prisma.activityLog.create({
      data: {
        taskId: tasks[4].id,
        userId: owner.id,
        action: 'moved task',
        details: 'Moved to "In Progress"',
      },
    }),
    prisma.activityLog.create({
      data: {
        taskId: tasks[5].id,
        userId: teammate.id,
        action: 'updated task',
        details: 'Changed priority to HIGH',
      },
    }),
  ]);

  console.log('📋 Created activity logs');

  console.log('✨ Seed completed successfully!');
  console.log('');
  console.log('Demo credentials:');
  console.log('  Email: demo@kanban.com');
  console.log('  Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });