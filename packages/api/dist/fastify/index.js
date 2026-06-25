"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = exports.authPlugin = void 0;
var plugin_1 = require("./plugin");
Object.defineProperty(exports, "authPlugin", { enumerable: true, get: function () { return __importDefault(plugin_1).default; } });
var routes_1 = require("./routes");
Object.defineProperty(exports, "authRoutes", { enumerable: true, get: function () { return routes_1.authRoutes; } });
//# sourceMappingURL=index.js.map