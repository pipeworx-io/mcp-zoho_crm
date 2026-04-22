# mcp-zoho_crm

Zoho CRM MCP Pack — wraps the Zoho CRM API v6

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `zoho_list_records` | List records from a Zoho CRM module (e.g., Leads, Contacts, Deals). |
| `zoho_get_record` | Get a single record by ID from a Zoho CRM module. |
| `zoho_search_records` | Search records in a Zoho CRM module using criteria. |
| `zoho_create_record` | Create a new record in a Zoho CRM module. |
| `zoho_list_modules` | List all available modules in Zoho CRM. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "zoho_crm": {
      "url": "https://gateway.pipeworx.io/zoho_crm/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Zoho_crm data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
