import { printSchema } from "graphql"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { loadSchemaFile } from "./loadSchema"
import {
  processSchema,
  removeServiceRemainings,
  replaceOnlyQuery,
} from "./schemaProcessing"

export async function makeGatewayExecutableSchema({
  schemaPath,
  schemaString,
  resolvers,
}: {
  schemaPath?: string
  schemaString?: string
  resolvers: any
}) {
  if (!schemaPath && !schemaString)
    throw new Error("schemaPath or schemaString is required")

  const serviceInfo = `
  type Service {
    sdl: String
  }

  type Query {
    _service: Service
  }`

  // Load schema from file or use schema string
  let schema: string = schemaPath
    ? await loadSchemaFile(schemaPath)
    : schemaString

  // First just replace query to extend, later all query types will be processed after making executable schema
  const convertedSchema = replaceOnlyQuery(schema)

  /// Prepare schema for mercurius
  // Add service data to the schema
  const tempSchema = `${serviceInfo}${convertedSchema}`
  ///

  /// Process and add schema resolver for gatway
  // Merge schema to get rid of extended Queries Mutations Subscriptions
  const schemaToProcess = printSchema(
    makeExecutableSchema({
      typeDefs: tempSchema,
      resolvers,
    })
  )

  let processedSchema = removeServiceRemainings(schemaToProcess)
  processedSchema = processSchema(processedSchema)

  // Add resolver
  resolvers.Query = resolvers.Query || {}
  resolvers.Query._service = () => {
    return { sdl: `${processedSchema}` }
  }
  ///

  return makeExecutableSchema({
    typeDefs: tempSchema,
    resolvers,
  })
}
