# Security Tooling

## perlcritic Security Policies

```ini
# .perlcriticrc — security-focused configuration
severity = 3
theme = security + core

# Require three-arg open
[InputOutput::RequireThreeArgOpen]
severity = 5

# Require checked system calls
[InputOutput::RequireCheckedSyscalls]
functions = :builtins
severity = 4

# Prohibit string eval
[BuiltinFunctions::ProhibitStringyEval]
severity = 5

# Prohibit backtick operators
[InputOutput::ProhibitBacktickOperators]
severity = 4

# Require taint checking in CGI
[Modules::RequireTaintChecking]
severity = 5

# Prohibit two-arg open
[InputOutput::ProhibitTwoArgOpen]
severity = 5

# Prohibit bare-word filehandles
[InputOutput::ProhibitBarewordFileHandles]
severity = 5
```

## Running perlcritic

```bash
# Check a file
perlcritic --severity 3 --theme security lib/MyApp/Handler.pm

# Check entire project
perlcritic --severity 3 --theme security lib/

# CI integration
perlcritic --severity 4 --theme security --quiet lib/ || exit 1
```
