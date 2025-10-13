# zkArb SDK – Repository Layout

This document provides an overview of the **zkArb SDK** repository structure and explains the purpose of each directory and file.  

It is intended to help new contributors and maintainers understand how the project is organized and where to add new features, documentation, or commands.

---

## 📂 Root Directory Overview

```
zkArb-sdk/
├── .github/
│   ├── workflows/
│   │   └── test.yml
├── bin/
│   └── circom-linux-amd64
│   └── circom-macos-amd64
│   └── circom-windows-amd64
│   ├── cli.js
│   ├── index.js
├── circomlib/
├── docs/
│   ├── build-artifacts.md
│   ├── cli-outline.md
│   ├── compile-artifacts.md
│   ├── cross-platform-compatibility.md
│   └── repository-layout.md
│   ├── test-suite.md
├── lib/
│   └── compile.js
│   └── getCircomPath.js
├── ptau/
│   └── pot12_final.ptau
├── test/
│   ├── circom/
│   │   └── hash.circom
│   │   └── multiplier.circom
│   │   └── simple.circom
│   │   └── voter.circom
│   └── compile.test.js
├── .gitignore
├── LICENSE
├── package-lock.json
├── package.json
├── pot12_0000.ptau
├── pot12_0001.ptau
└── README.md
```


## 📁 Folder Details

### **1. `bin/`**
This folder contains the executable files used by the CLI.

- **`cli.js`**  
  The main entry point for the zkArb Command Line Interface.  
  Currently includes the `compile` command (implementation pending).  
  Future CLI commands like `prove`, `verify`, and `deploy` will also be registered here.

---

### **2. `docs/`**
Houses all project documentation and developer logs.

- **`cli-outline.md`** – Documentation of available CLI commands, usage examples, and expected outputs.  
- **`DEVLOG.md`** – Developer journal or progress log for tracking feature additions, updates, and internal notes.  
- **`repository-layout.md`** – This file; describes the overall structure and purpose of each part of the project.

> 🗂️ Tip: Any future documentation (e.g., `architecture-overview.md`, `contributing.md`, or API references) should also reside in this folder.

---

## 📄 File Details

### **`.gitignore`**
Specifies which files and directories should be ignored by Git (e.g., `node_modules`, build artifacts, environment files).

---

### **`LICENSE`**
Defines the legal terms under which the zkArb SDK is distributed.  
All contributors must comply with this license when modifying or redistributing the code.

---

### **`package.json`**
Core metadata file for the Node.js project.  
It includes:
- Package name, version, and author information  
- Dependencies and scripts  
- Entry points for the CLI (e.g., linking `bin/cli.js` to a global `zkArb` command)