/**
 * Bun Test Configuration
 * @see https://bun.sh/docs/cli/test
 */

export default {
  // Test file patterns
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  
  // Coverage configuration
  coverage: {
    enabled: false,
    reporter: ["text", "json", "html"],
    exclude: [
      "node_modules/",
      "test/",
      "**/*.test.js",
      "**/*.spec.js"
    ]
  },
  
  // Test timeout in milliseconds
  timeout: 5000,
  
  // Run tests in parallel
  parallel: true
};
