# Generate executable query that works with Mercurius gateway .

## V3 versions brings breaking changes, support for Federation SDL but drops support for `#import` from other files, only single file schema supported, for V2 version refer [here](https://www.npmjs.com/package/@xxskyy/mercurius-exec-service-schema/v/2.0.8)

It supports:

- Loading schema from string
- Loading schema from file
- Federation SDL schemas
- Loaders for n + 1 queries

It doesn't support:

- Loading schema file with imports (IE `#import User from types/user.gql`) support

---

## Usage:

```ts
// Import / Require
// const { makeGatewayExecutableSchema } = require("@xxskyy/mercurius-exec-service-schema")
import { makeGatewayExecutableSchema } from "@xxskyy/mercurius-exec-service-schema"

const resolvers = {
 Query: {
   versions: () => [
     {id: 1, iteration: "0.0.1"},
     {id: 2, iteration: "0.0.2"},
     {id: 3, iteration: "0.0.3"},
     {id: 4, iteration: "0.0.4"},
   ]
 }
}

const schema = `
extend type Query {
  versions: [Version]
}

type Version @key(fields: "id") {
  id: ID!
  iteration: String
}
`

// Function needs 2 of 3 inputs
// resolvers - reuqired - gql resovler
// and
// schemaPath - path to .gql schema file
// or
// schemaString - string with gql schema

const executableSchema = await makeGatewayExecutableSchema({
  schemaString: schema
  // or
  // schemaPath: "./schema.gql",
  resolvers,
})

// Returned schema are executable schema ready to apply middlewares
```

## **If you use wildcard in Query shield remember to add ` _service: allow,` and ` _entities: allow,` to Query rules.**

## Example:

```ts
const permissions = shield({
  Query: {
    "*": and(isAuthenticated, rateLimitRule({ window: "20s", max: 100 })),
    _service: allow,
    _entities: allow,
  },
})
```
