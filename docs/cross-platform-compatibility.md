# 🌍 Cross-Platform Compatibility – zkArb SDK

The zkArb SDK is designed to be fully **cross-platform**, allowing developers to compile Circom circuits and generate zkSNARK artifacts seamlessly on **Linux**, **macOS**, and **Windows** systems.

---

## 🧠 Overview

To ensure consistent behavior across operating systems, the SDK includes prebuilt **Circom binaries** for each supported platform.  
The correct binary is automatically selected by the internal utility script **getCircomPath.js** located in the `lib/` directory.

This approach eliminates the need for users to install Circom manually or handle environment-specific configurations.

---

## ⚙️ How Cross-Platform Support Works

1. When you run a command such as:
   ```
   npx zkarb-sdk compile <path-to-your-circom-file>
   ```
2. The SDK internally calls **getCircomPath.js**.
3. This script:
   - Detects your current operating system using Node’s `os` module.
   - Maps the detected OS to the correct Circom binary path.
   - Returns that binary path for use during circuit compilation.

---

## 🧩 Circom Binary Mapping

The following binaries are included in the `bin/` folder of the repository:

```
bin/
├── circom-linux           → Used on Linux systems
├── circom-macos           → Used on macOS systems
└── circom-windows.exe     → Used on Windows systems
```

These files are prebuilt and shipped with the SDK to guarantee compatibility without requiring manual compilation.

---

## 🧰 Internal File: lib/getCircomPath.js

This file is responsible for:
- Detecting the OS using the `os` package
- Returning the correct Circom binary path
- Ensuring that the CLI (`cli.js`) uses the right executable during circuit compilation

The returned path is then consumed by the `compileCircuit` function inside `lib/compile.js`.

---

## 🧪 Testing Across Platforms

The SDK’s cross-platform stability is verified using a **GitHub Actions CI workflow** located at:

```
.github/workflows/test.yml
```

This workflow runs automated tests on:
- **Ubuntu (Linux)**
- **macOS**
- **Windows**

Each environment runs:
```
npm install
npm test
```
to ensure that circuit compilation and artifact generation behave identically on all systems.

---

## ✅ Benefits of Cross-Platform Design

- **No manual setup:** Users don’t need to install Circom separately.
- **Consistency:** The same results across all supported operating systems.
- **Reliability:** Prevents binary mismatch or environment dependency issues.
- **Automation Ready:** Works seamlessly in CI/CD pipelines and remote build environments.

---

## 🧾 Summary

| Platform | Binary Used | Verified via CI |
|-----------|--------------|----------------|
| Linux     | `circom-linux` | ✅ |
| macOS     | `circom-macos` | ✅ |
| Windows   | `circom-windows.exe` | ✅ |

The zkArb SDK is built to work **everywhere**, making it an ideal tool for developers building zero-knowledge applications across different environments.


---

### 🔙 Back to Documentation Index

← **[Go back to Index](index.md)**

