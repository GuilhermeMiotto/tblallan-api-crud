require('dotenv/config');
const bcrypt = require('bcrypt');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('../src/generated/prisma/client');

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  const password1 = await bcrypt.hash('senha123', 10);
  const password2 = await bcrypt.hash('senha456', 10);
  const password3 = await bcrypt.hash('senha789', 10);

  await prisma.user.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      email: 'joao@example.com',
      name: 'João Silva',
      password: password1,
      posts: {
        create: [
          {
            title: 'Primeiro Post do João',
            content: 'Este é o primeiro post de João sobre tecnologia',
            published: true,
          },
          {
            title: 'Segundo Post do João',
            content: 'Mais um post interessante sobre desenvolvimento',
            published: true,
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'maria@example.com',
      name: 'Maria Santos',
      password: password2,
      posts: {
        create: [
          {
            title: 'Post de Maria',
            content: 'Maria compartilhando suas experiências',
            published: true,
          },
        ],
      },
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'pedro@example.com',
      name: 'Pedro Costa',
      password: password3,
      posts: {
        create: [
          {
            title: 'Reflexão de Pedro',
            content: 'Pensamentos sobre a vida e tecnologia',
            published: false,
          },
        ],
      },
    },
  });

  console.log('Seed completed!');
  console.log('Users created:', { user1, user2, user3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
