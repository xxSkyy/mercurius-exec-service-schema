const Fastify = require("fastify")
const mercurius = require("mercurius")
const { makeGatewayExecutableSchema } = require("../lib")
const path = require("path")

const users = {
  1: {
    id: "1",
    name: "John",
    username: "@john",
    books: [1, 2, 3],
  },
  2: {
    id: "2",
    name: "Jane",
    username: "@jane",
    books: [2, 3, 4],
  },
}

const books = {
  1: {
    name: "boka",
    year: 2115,
  },
  2: {
    name: "din",
    year: 2115,
  },
  3: {
    name: "bjorn",
    year: 2115,
  },
  4: {
    name: "dyret",
    year: 2115,
  },
}

const app = Fastify()
const schema = `
  type Query {
    me: User
    some(ids: [ID]): [User]
  }

  type User {
    id: ID!
    name: String
    username: String
    books: [Book]
  }

  type Book {
    name: String
    year: Int
  }
`

const resolvers = {
  Query: {
    some: ({}, { ids }, {}, {}) => {
      return ids.map((id) => users[id])
    },
    me: () => {
      return users["1"]
    },
  },
}

const loaders = {
  User: {
    async books(queries, { reply }) {
      return queries.map(({ obj }) => obj.books.map((bookId) => books[bookId]))
    },
  },
}

const init = async () => {
  const execSchema = await makeGatewayExecutableSchema({
    // schemaString: schema,
    // OR
    schemaPath: path.join(__dirname, "./schema.gql"),
    resolvers,
  })

  app.register(mercurius, {
    schema: execSchema,
    loaders,
    federationMetadata: true,
  })

  app.listen(3050)
  console.log("Running service on port 3050")
}

init()
