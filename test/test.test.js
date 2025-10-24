// test/test.test.js
const { execSync } = require("child_process");
const path = require("path");

describe("zk-arb CLI Test Suite", () => {
  const cliPath = path.resolve(__dirname, "../bin/cli.js");

  test("CLI should display help without crashing", () => {
    expect(() => {
      execSync(`node ${cliPath} --help`, { stdio: "pipe" });
    }).not.toThrow();
  });

  test("zk-arb test command should run successfully", () => {
    const output = execSync(`node ${cliPath} test`, { encoding: "utf-8" });
    expect(output).toMatch(/success|passed|ok/i);
  });

  test("CLI version flag should return valid version number", () => {
    const output = execSync(`node ${cliPath} --version`, { encoding: "utf-8" });
    expect(output.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
