const path = require("path");
const os = require("os");

function getCircomPath() {
  const platform = os.platform();
  const binDir = path.join(__dirname, "..", "bin");

  if (platform === "linux") return path.join(binDir, "circom-linux-amd64");
  if (platform === "darwin") return path.join(binDir, "circom-macos-amd64");
  if (platform === "win32") return path.join(binDir, "circom-windows-amd64.exe");

  throw new Error(`Unsupported platform: ${platform}`);
}

module.exports = { getCircomPath };