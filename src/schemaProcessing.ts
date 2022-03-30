export function removeServiceRemainings(schema: string) {
  schema = schema.replace("_service: Service\n", "")

  schema = schema.replace("type Service {\n  sdl: String\n}\n\n", "")

  return schema
}

export function replaceOnlyQuery(schema: string) {
  let schemaArray = schema.split("\n")
  for (let i = 0; i < schemaArray.length; i++) {
    let line = schemaArray[i]
    line = line.replace(/\s+/g, " ").trim()
    if (
      line.indexOf("type Query") !== -1 &&
      line.indexOf("extend type Query") === -1
    )
      schemaArray[i] = line.replace("type", "extend type")
  }
  return schemaArray.join("\n")
}

export function processSchema(stringSchema: string) {
  let schema = stringSchema.split("\n")
  for (let i = 0; i < schema.length; i++) {
    let line = schema[i]
    if (
      line.indexOf("type Query") !== -1 &&
      line.indexOf("extend type Query") === -1
    ) {
      schema[i] = line.replace("type", "extend type")

      let nextLine = schema[i + 1]
      // If it's empty Query remove it
      if (nextLine.replace(/\s/g, "") === "}") {
        schema[i] = ""
        schema[i + 1] = ""
      }
    }
    if (
      line.indexOf("type Mutation") !== -1 &&
      line.indexOf("extend type Mutation") === -1
    )
      schema[i] = line.replace("type", "extend type")
    if (
      line.indexOf("type Subscription") !== -1 &&
      line.indexOf("extend type Subscription") === -1
    )
      schema[i] = line.replace("type", "extend type")
  }
  return schema.join("\n")
}
