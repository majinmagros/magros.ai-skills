# Manifest — Structure, Install Patterns, Conflicts

## Manifest Structure

```toml
# .flox/env/manifest.toml

[install]
# Packages to install — the core of the environment
ripgrep.pkg-path = "ripgrep"
jq.pkg-path = "jq"

[vars]
# Static environment variables
DATABASE_URL = "postgres://localhost:5432/myapp"

[hook]
# Non-interactive setup scripts (run every activation)
on-activate = """
  echo "Environment ready"
"""

[profile]
# Shell functions and aliases (available in interactive shell)
common = """
  alias dev="npm run dev"
"""

[options]
# Supported platforms
systems = ["x86_64-linux", "aarch64-linux", "x86_64-darwin", "aarch64-darwin"]
```

## Package Installation Patterns

### Basic Installation

```toml
[install]
nodejs.pkg-path = "nodejs"
python.pkg-path = "python311"
rustup.pkg-path = "rustup"
```

### Version Pinning

```toml
[install]
nodejs.pkg-path = "nodejs"
nodejs.version = "^20.0"          # Semver range: latest 20.x

postgres.pkg-path = "postgresql"
postgres.version = "16.2"         # Exact version
```

### Platform-Specific Packages

```toml
[install]
# Linux-only tools
valgrind.pkg-path = "valgrind"
valgrind.systems = ["x86_64-linux", "aarch64-linux"]

# macOS frameworks
Security.pkg-path = "darwin.apple_sdk.frameworks.Security"
Security.systems = ["x86_64-darwin", "aarch64-darwin"]

# GNU tools on macOS (where BSD defaults differ)
coreutils.pkg-path = "coreutils"
coreutils.systems = ["x86_64-darwin", "aarch64-darwin"]
```

### Resolving Package Conflicts

When two packages install the same binary, use `priority` (lower number wins):

```toml
[install]
gcc.pkg-path = "gcc12"
gcc.priority = 3

clang.pkg-path = "clang_18"
clang.priority = 5               # gcc wins file conflicts
```

Use `pkg-group` to group packages that should resolve versions together:

```toml
[install]
python.pkg-path = "python311"
python.pkg-group = "python-stack"

pip.pkg-path = "python311Packages.pip"
pip.pkg-group = "python-stack"    # Resolves together with python
```
