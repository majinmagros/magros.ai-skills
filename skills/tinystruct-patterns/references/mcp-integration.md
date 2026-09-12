# MCP Server and Tools Integration

tinystruct provides native support for the Model Context Protocol (MCP) starting with SDK version **`1.7.26`**.
The MCP APIs (e.g., `org.tinystruct.mcp.MCPTool`, `org.tinystruct.mcp.MCPServer`, `org.tinystruct.mcp.MCPException`) are included directly in the core dependency:
```xml
<dependency>
    <groupId>org.tinystruct</groupId>
    <artifactId>tinystruct</artifactId>
    <version>1.7.26</version>
</dependency>
```

> **SECURITY WARNING (Prompt Injection):**
> Tool return values are fed directly back into the AI model's context window. You **MUST** validate and sanitize all caller-supplied arguments before including them in the tool's return string. Failure to sanitize inputs can allow an attacker to inject adversarial instructions (Prompt Injection) that override the model's behavior. Always validate length, character sets, and nullity.

**To create an MCP Tool:**
1. Extend `org.tinystruct.mcp.MCPTool`.
2. Annotate operations with `@Action` and declare parameters using `@Argument` within the `arguments` array.
3. Accept parameters as explicit method arguments matching the keys in `@Argument`. (Do **not** use `getContext().getAttribute(...)` for tool arguments).

```java
import org.tinystruct.mcp.MCPTool;
import org.tinystruct.mcp.MCPException;
import org.tinystruct.system.annotation.Action;
import org.tinystruct.system.annotation.Argument;

public class MyCustomTool extends MCPTool {
    public MyCustomTool() {
        super("custom", "A custom tool for demonstrating MCP");
    }

    @Action(
        value = "custom/hello",
        description = "Say hello to someone",
        arguments = {
            @Argument(key = "name", description = "The name to greet", type = "string", optional = false)
        }
    )
    public String hello(String name) throws MCPException {
        // SECURITY: Validate/sanitize tool inputs before returning to the model
        // to prevent prompt injection vulnerabilities.
        if (name == null || name.length() > 50 || !name.matches("^[a-zA-Z0-9 ]+$")) {
            throw new MCPException("Invalid name provided");
        }
        return "Hello, " + name + "!";
    }
}
```

**To deploy an MCP Server:**
1. Extend `org.tinystruct.mcp.MCPServer`.
2. Override `init()` and register your tools using `this.registerTool()`. The framework automatically scans and maps the `@Action` methods.

```java
import org.tinystruct.mcp.MCPServer;

public class MyMCPServer extends MCPServer {
    @Override
    public void init() {
        super.init();
        this.registerTool(new MyCustomTool());
    }

    @Override
    public String version() {
        return "1.0.0";
    }
}
```

Run the server via the dispatcher:
```bash
bin/dispatcher start --import org.tinystruct.system.HttpServer --import com.example.MyMCPServer
```
