/**
 * @file getCircomPath.js
 * @description
 * Determines the correct Circom binary to use based on the user's operating system.
 * 
 * The zkArb SDK is cross-platform and includes prebuilt Circom binaries for:
 *   - Linux
 *   - macOS (Darwin)
 *   - Windows
 * 
 * This utility ensures that the CLI and compiler modules always reference the correct
 * binary path, regardless of the system environment. It eliminates the need for users
 * to install Circom manually and ensures consistent compilation behavior across all OSes.
 */

const path = require("path");
const os = require("os");

/**
 * Returns the absolute path to the appropriate Circom binary
 * for the current operating system.
 * 
 * This function is used internally by the SDK during circuit compilation.
 * 
 * @function getCircomPath
 * @returns {string} - The absolute path to the correct Circom binary.
 * @throws {Error} - Throws an error if the OS is unsupported or if no matching binary is found.
 * 
 * @example
 * const { getCircomPath } = require("./getCircomPath");
 * const circomBinary = getCircomPath();
 * console.log(`Using Circom binary at: ${circomBinary}`);
 * 
 * // Typical returned paths:
 * // Linux:   /path/to/bin/circom-linux-amd64
 * // macOS:   /path/to/bin/circom-macos-amd64
 * // Windows: /path/to/bin/circom-windows-amd64.exe
 */

function getCircomPath() {
  const platform = os.platform();
  const binDir = path.join(__dirname, "..", "bin");

    /**
   * Map OS to corresponding Circom binary:
   * - Linux → circom-linux-amd64
   * - macOS → circom-macos-amd64
   * - Windows → circom-windows-amd64.exe
   * 
   * These filenames follow a consistent naming convention for maintainability.
   */

  if (platform === "linux") return path.join(binDir, "circom-linux-amd64");
  if (platform === "darwin") return path.join(binDir, "circom-macos-amd64");
  if (platform === "win32") return path.join(binDir, "circom-windows-amd64.exe");

  // Throw a descriptive error if the user's OS is not one of the supported platforms
  throw new Error(`Unsupported platform: ${platform}`);
}

// Export the function for use in other modules such as lib/compile.js or CLI logic
module.exports = { getCircomPath };