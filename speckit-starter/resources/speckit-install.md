# Spec Kit — Installation & Verification

A one-page manual for installing GitHub's [Spec Kit](https://github.com/github/spec-kit) on macOS and Windows, wiring it to the Globant AI gateway, and confirming the install works.

---

## What you need before you start

- A terminal
  - **macOS**: Terminal, iTerm2, or the VS Code integrated terminal
  - **Windows**: PowerShell (not CMD). Run as a regular user unless noted otherwise.
- Internet access
- Globant AI gateway credentials (provided by the workshop host or your team)

---

## macOS

### 1. Install `uv`

`uv` is the fast Python package manager Spec Kit runs on.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Open a new terminal window after the installer finishes so your `PATH` picks up `uv`.

### 2. Install the Spec Kit CLI

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

This installs the `specify` command globally.

### 3. Verify the install

```bash
uv --version
specify --help
```

You should see a `uv` version string and the `specify` CLI help output.

---

## Windows

### 1. Install `uv`

Open **PowerShell** and run:

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Close and reopen PowerShell so your `PATH` picks up `uv`.

### 2. Run the Spec Kit CLI via `uvx`

On Windows, the recommended path is to run `specify` directly through `uvx` (no global install step):

```powershell
uv --version
uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT>
```

Replace `<PROJECT>` with the folder name you want Spec Kit to scaffold into.

> **Tip.** If you prefer a global `specify` command on Windows, you can also run
> `uv tool install specify-cli --from git+https://github.com/github/spec-kit.git`
> — same as the macOS step.

### 3. Verify the install

```powershell
uv --version
uvx --from git+https://github.com/github/spec-kit.git specify --help
```

You should see the `specify` CLI help output.

---

## Initialize Spec Kit in a project

From inside the folder where you want Spec Kit artifacts:

**macOS**
```bash
specify init <PROJECT>
```

**Windows**
```powershell
uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT>
```

This creates the `.specify/` scaffolding (templates, memory, constitution) inside `<PROJECT>`.

---

## Configure the Globant AI gateway

When Spec Kit prompts for an LLM provider during `specify init` (or any time you re-run `specify` and need to change provider settings), use the values below.

| Field | Value |
|-------|-------|
| Provider ID | `aws` |
| Base URL | `https://api.clients.geai.globant.com/chat/completions` |
| Model ID | `globant_dgx/GLM-4.6` |

**Both macOS and Windows**: the prompts are identical — answer with the three values above.

You can re-open the configuration at any time by running:

**macOS**
```bash
specify
```

**Windows**
```powershell
uvx --from git+https://github.com/github/spec-kit.git specify
```

---

## Final verification

After init + provider config, confirm everything is wired up:

1. **CLI reachable**
   - macOS: `specify --help`
   - Windows: `uvx --from git+https://github.com/github/spec-kit.git specify --help`
2. **Project scaffolded** — the target folder has a `.specify/` directory with `templates/`, `memory/`, and a `constitution.md`.
3. **Provider reachable** — run `specify` and confirm the configured provider/model show the values above, and that a test prompt returns without a connection or auth error.

If all three check out, you're ready to run the Spec Kit flow: `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`.

---

## Troubleshooting

- **`specify: command not found` (macOS)** — open a new terminal so the updated `PATH` is loaded, or run `source ~/.zshrc`. If still missing, re-run step 2.
- **`uv : The term 'uv' is not recognized` (Windows)** — close and reopen PowerShell. If still missing, check that `%USERPROFILE%\.local\bin` is on your `PATH`.
- **TLS/certificate errors on the install URL** — you may be behind a corporate proxy; use a direct network or your org's documented proxy settings.
- **Auth error on first LLM call** — double-check the Base URL has no trailing slash and the model ID is exactly `globant_dgx/GLM-4.6` (case-sensitive).
