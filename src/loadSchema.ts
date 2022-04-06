import { loadSchema } from "@graphql-tools/load"
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader"
import { printSchema } from "graphql"
import * as fs from "fs"

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

export async function readSchemaFile(path: string) {
  try {
    const schema = await fs.readFileSync(path, "utf-8")

    return schema
  } catch (e) {
    throw Error(`Can't load schema file: ${e}`)
  }
}
