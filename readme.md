# Generate executable query with middleware supports that works with Mercurius federation mode.

It supports:

- Loading schema from string
- Loading schema from file with imports (IE `#import User from types/user.gql`) support

It doesn't support:

- Federation SDL schemas (no ETA)

---

## Usage:

```ts
// Import / Require
// const { makeGatewayExecutableSchema } = require("@xxskyy/mercurius-exec-service-schema")
import { makeGatewayExecutableSchema } from "@xxskyy/mercurius-exec-service-schema"

const resolvers = {
 Query: {
   version: () => "1.0.0"
 } 
}

const schema = `
type Query {
  version: String
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

## **If you use wildcard in Query shield remember to add ` _service: allow,` to Query rules.**

## Example:

```ts
const permissions = shield({
  Query: {
    "*": and(isAuthenticated, rateLimitRule({ window: "20s", max: 100 })),
    _service: allow,
  },
})
```
