const { ApolloServer } = require('apollo-server')
const { readFileSync } = require('fs')
const path = require('path');
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const resolvers = {
  Query: {
    getAllUsers: async (parent, args, context) => {
      return context.prisma.user.findMany()
    },
    getUsers:async (parent, args, context, info) => {
      const where = args.filter
        ? {
          OR: [
            { name: { contains: args.filter } },
            { firstname: { contains: args.filter } },
            { lastname: { contains: args.filter } },
          ],
        }
        : {}
    
      const links = await context.prisma.user.findMany({
        where,
      })
    
      return links
    }
  },
  Mutation: {
    addUser:async  (parent, args, context) => {
      await context.prisma.user.create({
        data: {
          name: args.name,
          lastname: args.lastname,
          firstname: args.firstname,
          address: args.address,
          phone: args.phone,
        },
      })
      const allUsers = await context.prisma.user.findMany();
      return allUsers
    },
    updateUser:async (parent, args, context) => {
      await context.prisma.user.update({
        where: {
          id: args.id,
        },
        data: {
          name: args.name,
          lastname: args.lastname,
          firstname: args.firstname,
          address: args.address,
          phone: args.phone,
        },
      })
      
      const allUsers = await context.prisma.user.findMany();
      return allUsers
    },
    deleteUser:async (parent, args, context) => {
      await context.prisma.user.delete({
        where: {
          id: args.id
        },
      });
      const allUsers = await context.prisma.user.findMany();
      return allUsers
    }
  }
}

const server = new ApolloServer({
  typeDefs: readFileSync(path.join(__dirname, 'schema.graphql'),'utf8'),
  resolvers,
  context:{
    prisma,
  }
})

server.listen().then(({ url }) => 
  console.log(`Server is running on ${url}`)
)