# Language Recipes — Python/uv, Node, Rust, Go, C/C++

### Python with uv

```toml
[install]
python.pkg-path = "python311"
uv.pkg-path = "uv"

[vars]
UV_CACHE_DIR = "$FLOX_ENV_CACHE/uv-cache"
PIP_CACHE_DIR = "$FLOX_ENV_CACHE/pip-cache"

[hook]
on-activate = """
  venv="$FLOX_ENV_CACHE/venv"
  if [ ! -d "$venv" ]; then
    uv venv "$venv" --python python3
  fi
  if [ -f "$venv/bin/activate" ]; then
    source "$venv/bin/activate"
  fi

  if [ -f requirements.txt ] && [ ! -f "$FLOX_ENV_CACHE/.deps_installed" ]; then
    uv pip install --python "$venv/bin/python" -r requirements.txt --quiet
    touch "$FLOX_ENV_CACHE/.deps_installed"
  fi
"""
```

### Node.js

```toml
[install]
nodejs.pkg-path = "nodejs"
nodejs.version = "^20.0"

[hook]
on-activate = """
  if [ -f package.json ] && [ ! -d node_modules ]; then
    npm install --silent
  fi
"""
```

### Rust

```toml
[install]
rustup.pkg-path = "rustup"
pkg-config.pkg-path = "pkg-config"
openssl.pkg-path = "openssl"

[vars]
RUSTUP_HOME = "$FLOX_ENV_CACHE/rustup"
CARGO_HOME = "$FLOX_ENV_CACHE/cargo"

[profile]
common = """
  export PATH="$CARGO_HOME/bin:$PATH"
"""
```

### Go

```toml
[install]
go.pkg-path = "go"
gopls.pkg-path = "gopls"
delve.pkg-path = "delve"

[vars]
GOPATH = "$FLOX_ENV_CACHE/go"
GOBIN = "$FLOX_ENV_CACHE/go/bin"

[profile]
common = """
  export PATH="$GOBIN:$PATH"
"""
```

### C/C++

```toml
[install]
gcc.pkg-path = "gcc13"
gcc.pkg-group = "compilers"

# IMPORTANT: gcc alone doesn't expose libstdc++ headers — you need gcc-unwrapped
gcc-unwrapped.pkg-path = "gcc-unwrapped"
gcc-unwrapped.pkg-group = "libraries"

cmake.pkg-path = "cmake"
cmake.pkg-group = "build"

gnumake.pkg-path = "gnumake"
gnumake.pkg-group = "build"

gdb.pkg-path = "gdb"
gdb.systems = ["x86_64-linux", "aarch64-linux"]
```
