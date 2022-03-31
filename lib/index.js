"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGatewayExecutableSchema = void 0;
var graphql_1 = require("graphql");
var schema_1 = require("@graphql-tools/schema");
var loadSchema_1 = require("./loadSchema");
var schemaProcessing_1 = require("./schemaProcessing");
function makeGatewayExecutableSchema(_a) {
    var schemaPath = _a.schemaPath, schemaString = _a.schemaString, resolvers = _a.resolvers;
    return __awaiter(this, void 0, void 0, function () {
        var serviceInfo, schema, _b, convertedSchema, tempSchema, schemaToProcess, processedSchema;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!schemaPath && !schemaString)
                        throw new Error("schemaPath or schemaString is required");
                    serviceInfo = "\n  type Service {\n    sdl: String\n  }\n\n  type Query {\n    _service: Service\n  }";
                    if (!schemaPath) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, loadSchema_1.loadSchemaFile)(schemaPath)];
                case 1:
                    _b = _c.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _b = schemaString;
                    _c.label = 3;
                case 3:
                    schema = _b;
                    convertedSchema = (0, schemaProcessing_1.replaceOnlyQuery)(schema);
                    tempSchema = "".concat(serviceInfo).concat(convertedSchema);
                    schemaToProcess = (0, graphql_1.printSchema)((0, schema_1.makeExecutableSchema)({
                        typeDefs: tempSchema,
                        resolvers: resolvers,
                    }));
                    processedSchema = (0, schemaProcessing_1.removeServiceRemainings)(schemaToProcess);
                    processedSchema = (0, schemaProcessing_1.processSchema)(processedSchema);
                    // Add resolver
                    resolvers.Query = resolvers.Query || {};
                    resolvers.Query._service = function () {
                        return { sdl: "".concat(processedSchema) };
                    };
                    ///
                    return [2 /*return*/, (0, schema_1.makeExecutableSchema)({
                            typeDefs: tempSchema,
                            resolvers: resolvers,
                        })];
            }
        });
    });
}
exports.makeGatewayExecutableSchema = makeGatewayExecutableSchema;
