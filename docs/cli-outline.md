# 📘 zkArb SDK – CLI Outline

### Command: `compile`

**Usage:**
```bash
zkArb compile <circomFilePath>
```

**Arguments:**

- `<circomFilePath>` — Path to the `.circom` file you want to compile.

---

**Description:**

Compiles a Circom circuit into the necessary intermediate artifacts used for proof generation.  
The compilation process will generate files like:

- `.r1cs` — circuit constraints representation  
- `.wasm` — WebAssembly file for witness generation  
- `.zkey` — proving key for proof generation  

---