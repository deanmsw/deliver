import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  const trev = await prisma.user.upsert({
    where: { email: 'trev@email.com' },
    update: {},

    create: {

      email: 'trev@email.com',

      firstName: 'Trev',

      lastName: 'Strong',

      // password: ''

      // posts: {

      //   create: {

      //     title: 'Check out Prisma with Next.js',

      //     content: 'https://www.prisma.io/nextjs',

      //     published: true,

      //   },

      // },

    },

  })

  const dean = await prisma.user.upsert({

    where: { email: 'dean@email.com' },

    update: {},

    create: {

      email: 'dean@email.com',

      firstName: 'Dean',

      lastName: 'Scotthorne'

      // posts: {

      //   create: [

      //     {

      //       title: 'Follow Prisma on Twitter',

      //       content: 'https://twitter.com/prisma',

      //       published: true,

      //     },

      //     {

      //       title: 'Follow Nexus on Twitter',

      //       content: 'https://twitter.com/nexusgql',

      //       published: true,

      //     },

      //   ],

      // },

    },

  })

  console.log({ dean, trev })

}

main()

  .then(async () => {

    await prisma.$disconnect()

  })

  .catch(async (e) => {

    console.error(e)

    await prisma.$disconnect()

    process.exit(1)

  })