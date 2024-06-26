import type { Config } from "jest"

const config: Config = {
    roots: ["<rootDir>/src"],
    testMatch: [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    clearMocks: true,
    collectCoverage: false,
    transformIgnorePatterns: ["\\\\node_modules\\\\"],
    preset: "@shelf/jest-mongodb",
    moduleNameMapper: {
        "@/(.*)": "<rootDir>/src/$1",
    },
}

export default config
