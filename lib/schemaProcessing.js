"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSchema = exports.replaceOnlyQuery = exports.removeServiceRemainings = void 0;
function removeServiceRemainings(schema) {
    schema = schema.replace("_service: Service\n", "");
    schema = schema.replace("type Service {\n  sdl: String\n}\n\n", "");
    return schema;
}
exports.removeServiceRemainings = removeServiceRemainings;
function replaceOnlyQuery(schema) {
    var schemaArray = schema.split("\n");
    for (var i = 0; i < schemaArray.length; i++) {
        var line = schemaArray[i];
        line = line.replace(/\s+/g, " ").trim();
        if (line.indexOf("type Query") !== -1 &&
            line.indexOf("extend type Query") === -1)
            schemaArray[i] = line.replace("type", "extend type");
    }
    return schemaArray.join("\n");
}
exports.replaceOnlyQuery = replaceOnlyQuery;
function processSchema(stringSchema) {
    var schema = stringSchema.split("\n");
    for (var i = 0; i < schema.length; i++) {
        var line = schema[i];
        if (line.indexOf("type Query") !== -1 &&
            line.indexOf("extend type Query") === -1) {
            schema[i] = line.replace("type", "extend type");
            var nextLine = schema[i + 1];
            // If it's empty Query remove it
            if (nextLine.replace(/\s/g, "") === "}") {
                schema[i] = "";
                schema[i + 1] = "";
            }
        }
        if (line.indexOf("type Mutation") !== -1 &&
            line.indexOf("extend type Mutation") === -1)
            schema[i] = line.replace("type", "extend type");
        if (line.indexOf("type Subscription") !== -1 &&
            line.indexOf("extend type Subscription") === -1)
            schema[i] = line.replace("type", "extend type");
    }
    return schema.join("\n");
}
exports.processSchema = processSchema;
