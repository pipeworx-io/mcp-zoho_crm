# mcp-zoho_crm

Zoho CRM MCP Pack — wraps the Zoho CRM API v6

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `zoho_list_records` | List records from a Zoho CRM module (e.g., Leads, Contacts, Deals). |
| `zoho_get_record` | Get a single record by ID from a Zoho CRM module. |
| `zoho_search_records` | Search records in a Zoho CRM module using criteria. |
| `zoho_create_record` | Create a new record in a Zoho CRM module. |
| `zoho_list_modules` | List all available modules in Zoho CRM. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "zoho_crm": {
      "url": "https://gateway.pipeworx.io/zoho_crm/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use zoho_crm
```

## License

MIT
