# Stdlib, Enums, Files and Performance

## Key Rules

| Rule | Summary |
|------|---------|
| **SL.1** | Use libraries wherever possible |
| **SL.2** | Prefer the standard library to other libraries |
| **SL.con.1** | Prefer `std::array` or `std::vector` over C arrays |
| **SL.con.2** | Prefer `std::vector` by default |
| **SL.str.1** | Use `std::string` to own character sequences |
| **SL.str.2** | Use `std::string_view` to refer to character sequences |
| **SL.io.50** | Avoid `endl` (use `'\n'` -- `endl` forces a flush) |

```cpp
// SL.con.1 + SL.con.2: Prefer vector/array over C arrays
const std::array<int, 4> fixed_data{1, 2, 3, 4};
std::vector<std::string> dynamic_data;

// SL.str.1 + SL.str.2: string owns, string_view observes
std::string build_greeting(std::string_view name) {
    return "Hello, " + std::string(name) + "!";
}

// SL.io.50: Use '\n' not endl
std::cout << "result: " << value << '\n';
```

## Enumerations (Enum.*)

## Key Rules

| Rule | Summary |
|------|---------|
| **Enum.1** | Prefer enumerations over macros |
| **Enum.3** | Prefer `enum class` over plain `enum` |
| **Enum.5** | Don't use ALL_CAPS for enumerators |
| **Enum.6** | Avoid unnamed enumerations |

```cpp
// Enum.3 + Enum.5: Scoped enum, no ALL_CAPS
enum class Color { red, green, blue };
enum class LogLevel { debug, info, warning, error };

// BAD: plain enum leaks names, ALL_CAPS clashes with macros
enum { RED, GREEN, BLUE };           // Enum.3 + Enum.5 + Enum.6 violation
#define MAX_SIZE 100                  // Enum.1 violation -- use constexpr
```

## Source Files & Naming (SF.*, NL.*)

## Key Rules

| Rule | Summary |
|------|---------|
| **SF.1** | Use `.cpp` for code files and `.h` for interface files |
| **SF.7** | Don't write `using namespace` at global scope in a header |
| **SF.8** | Use `#include` guards for all `.h` files |
| **SF.11** | Header files should be self-contained |
| **NL.5** | Avoid encoding type information in names (no Hungarian notation) |
| **NL.8** | Use a consistent naming style |
| **NL.9** | Use ALL_CAPS for macro names only |
| **NL.10** | Prefer `underscore_style` names |

## Header Guard

```cpp
// SF.8: Include guard (or #pragma once)
#ifndef PROJECT_MODULE_WIDGET_H
#define PROJECT_MODULE_WIDGET_H

// SF.11: Self-contained -- include everything this header needs
#include <string>
#include <vector>

namespace project::module {

class Widget {
public:
    explicit Widget(std::string name);
    const std::string& name() const;

private:
    std::string name_;
};

}  // namespace project::module

#endif  // PROJECT_MODULE_WIDGET_H
```

## Naming Conventions

```cpp
// NL.8 + NL.10: Consistent underscore_style
namespace my_project {

constexpr int max_buffer_size = 4096;  // NL.9: not ALL_CAPS (it's not a macro)

class tcp_connection {                 // underscore_style class
public:
    void send_message(std::string_view msg);
    bool is_connected() const;

private:
    std::string host_;                 // trailing underscore for members
    int port_;
};

}  // namespace my_project
```

## Anti-Patterns

- `using namespace std;` in a header at global scope (SF.7)
- Headers that depend on inclusion order (SF.10, SF.11)
- Hungarian notation like `strName`, `iCount` (NL.5)
- ALL_CAPS for anything other than macros (NL.9)

## Performance (Per.*)

## Key Rules

| Rule | Summary |
|------|---------|
| **Per.1** | Don't optimize without reason |
| **Per.2** | Don't optimize prematurely |
| **Per.6** | Don't make claims about performance without measurements |
| **Per.7** | Design to enable optimization |
| **Per.10** | Rely on the static type system |
| **Per.11** | Move computation from run time to compile time |
| **Per.19** | Access memory predictably |

## Guidelines

```cpp
// Per.11: Compile-time computation where possible
constexpr auto lookup_table = [] {
    std::array<int, 256> table{};
    for (int i = 0; i < 256; ++i) {
        table[i] = i * i;
    }
    return table;
}();

// Per.19: Prefer contiguous data for cache-friendliness
std::vector<Point> points;           // GOOD: contiguous
std::vector<std::unique_ptr<Point>> indirect_points; // BAD: pointer chasing
```

## Anti-Patterns

- Optimizing without profiling data (Per.1, Per.6)
- Choosing "clever" low-level code over clear abstractions (Per.4, Per.5)
- Ignoring data layout and cache behavior (Per.19)
