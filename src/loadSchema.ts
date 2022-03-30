import { loadSchema } from "@graphql-tools/load"
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader"
import { printSchema } from "graphql"

export async function loadSchemaFile(path: string) {
  try {
    const schemaFile = await loadSchema(path, {
      loaders: [new GraphQLFileLoader()],
    })
    return printSchema(schemaFile)
  } catch (e) {
    throw Error(`Can't load schema file: ${e}`)
  }
}
