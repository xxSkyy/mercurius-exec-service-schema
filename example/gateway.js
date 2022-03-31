const fastify = require("fastify")
const mercurius = require("mercurius")

const gateway = fastify()

// Run service first

const services = [
  {
    name: "user",
    url: "http://localhost:3050/graphql",
  },
]

gateway.register(mercurius, {
  gateway: {
    services,
    pollingInterval: 2000,
  },
})

gateway.listen(3040)
console.log(`Running gateway on port 3040!`)
