"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePasswordStrength = validatePasswordStrength;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.hashToken = hashToken;
exports.verifyTokenHash = verifyTokenHash;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const errors_1 = require("./errors");
const DEFAULT_SALT_ROUNDS = 12;
const PASSWORD_RULES = {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireDigit: true,
};
function validatePasswordStrength(password) {
    if (password.length < PASSWORD_RULES.minLength) {
        throw new errors_1.WeakPasswordError(`Password must be at least ${PASSWORD_RULES.minLength} characters`);
    }
    if (password.length > PASSWORD_RULES.maxLength) {
        throw new errors_1.WeakPasswordError(`Password must be at most ${PASSWORD_RULES.maxLength} characters`);
    }
    if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
        throw new errors_1.WeakPasswordError("Password must contain at least one uppercase letter");
    }
    if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
        throw new errors_1.WeakPasswordError("Password must contain at least one lowercase letter");
    }
    if (PASSWORD_RULES.requireDigit && !/\d/.test(password)) {
        throw new errors_1.WeakPasswordError("Password must contain at least one digit");
    }
}
async function hashPassword(password, saltRounds = DEFAULT_SALT_ROUNDS) {
    validatePasswordStrength(password);
    return bcryptjs_1.default.hash(password, saltRounds);
}
async function verifyPassword(password, passwordHash) {
    return bcryptjs_1.default.compare(password, passwordHash);
}
async function hashToken(token) {
    return bcryptjs_1.default.hash(token, 10);
}
async function verifyTokenHash(token, hash) {
    return bcryptjs_1.default.compare(token, hash);
}
//# sourceMappingURL=password.js.map