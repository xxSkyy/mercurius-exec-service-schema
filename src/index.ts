import { printSchema } from "graphql"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { loadSchemaFile, readSchemaFile } from "./loadSchema"
import {
  processSchema,
  removeServiceRemainings,
  replaceOnlyQuery,
} from "./schemaProcessing"
import { buildSubgraphSchema } from "@apollo/subgraph"
import { gql } from "graphql-tag"

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

  // const serviceInfo = `
  // type Service {
  //   sdl: String
  // }

  // type Query {
  //   _service: Service
  // }`

  // Load schema from file or use schema string
  let schema: string = schemaPath
    ? await readSchemaFile(schemaPath)
    : schemaString

  // First just replace query to extend, later all query types will be processed after making executable schema
  // const convertedSchema = replaceOnlyQuery(schema)

  /// Prepare schema for mercurius
  // Add service data to the schema
  // const tempSchema = `${serviceInfo}${convertedSchema}`
  ///

  /// Process and add schema resolver for gatway
  // Merge schema to get rid of extended Queries Mutations Subscriptions
  // const schemaToProcess = printSchema(
  //   makeExecutableSchema({
  //     typeDefs: tempSchema,
  //     resolvers,
  //   })
  // )

  const documentSchema = gql`
    ${schema}
  `

  const subgraphSchema = buildSubgraphSchema([
    {
      typeDefs: documentSchema,
      resolvers,
    },
  ])

  // let processedSchema = removeServiceRemainings(schemaToProcess)
  // processedSchema = processSchema(processedSchema)

  // Add resolver
  // resolvers.Query = resolvers.Query || {}
  // resolvers.Query._service = () => {
  //   return { sdl: `${processedSchema}` }
  // }
  ///

  return makeExecutableSchema({
    typeDefs: subgraphSchema,
    resolvers,
  })
}
