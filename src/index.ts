interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Zoho CRM MCP Pack — wraps the Zoho CRM API v6
 *
 * OAuth: provider = 'zoho_crm', access token via _context.zoho_crm.accessToken.
 * Tools: list/get/search/create records, list modules.
 */


const API = 'https://www.zohoapis.com/crm/v6';

interface ZohoContext {
  zoho_crm?: { accessToken: string };
}

async function zohoGet(ctx: ZohoContext, path: string): Promise<unknown> {
  if (!ctx.zoho_crm) {
    return { error: 'connection_required', message: 'Connect your Zoho CRM account at https://pipeworx.io/account' };
  }
  const res = await fetch(`${API}${path}`, {
    headers: {
      Authorization: `Zoho-oauthtoken ${ctx.zoho_crm.accessToken}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Zoho CRM API error (${res.status}): ${text}`);
  }
  if (res.status === 204) return { data: [] };
  return res.json();
}

async function zohoPost(ctx: ZohoContext, path: string, body: unknown): Promise<unknown> {
  if (!ctx.zoho_crm) {
    return { error: 'connection_required', message: 'Connect your Zoho CRM account at https://pipeworx.io/account' };
  }
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${ctx.zoho_crm.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Zoho CRM API error (${res.status}): ${text}`);
  }
  return res.json();
}

const tools: McpToolExport['tools'] = [
  {
    name: 'zoho_list_records',
    description: 'List records from a Zoho CRM module (e.g., Leads, Contacts, Deals).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        module: { type: 'string', description: 'Module name (e.g., Leads, Contacts, Deals, Accounts)' },
        fields: { type: 'string', description: 'Comma-separated field names to return (e.g., "Last_Name,Email,Phone"). Defaults to common fields.' },
        per_page: { type: 'number', description: 'Records per page (max 200, default 20)' },
        page: { type: 'number', description: 'Page number (default 1)' },
      },
      required: ['module'],
    },
  },
  {
    name: 'zoho_get_record',
    description: 'Get a single record by ID from a Zoho CRM module.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        module: { type: 'string', description: 'Module name (e.g., Leads, Contacts, Deals)' },
        id: { type: 'string', description: 'Record ID' },
      },
      required: ['module', 'id'],
    },
  },
  {
    name: 'zoho_search_records',
    description: 'Search records in a Zoho CRM module using criteria.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        module: { type: 'string', description: 'Module name (e.g., Leads, Contacts, Deals)' },
        criteria: { type: 'string', description: 'Search criteria (e.g., "(Last_Name:equals:Smith)")' },
        per_page: { type: 'number', description: 'Records per page (max 200, default 20)' },
        page: { type: 'number', description: 'Page number (default 1)' },
      },
      required: ['module', 'criteria'],
    },
  },
  {
    name: 'zoho_create_record',
    description: 'Create a new record in a Zoho CRM module.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        module: { type: 'string', description: 'Module name (e.g., Leads, Contacts, Deals)' },
        data: { type: 'object', description: 'Record data as key-value pairs (e.g., { "Last_Name": "Smith", "Email": "john@example.com" })' },
      },
      required: ['module', 'data'],
    },
  },
  {
    name: 'zoho_list_modules',
    description: 'List all available modules in Zoho CRM.',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const context = (args._context ?? {}) as ZohoContext;
  delete args._context;

  switch (name) {
    case 'zoho_list_records': {
      const module = args.module as string;
      const fields = (args.fields as string) || 'Last_Name,First_Name,Email,Phone,Company';
      const perPage = (args.per_page as number) ?? 20;
      const page = (args.page as number) ?? 1;
      return zohoGet(context, `/${module}?fields=${encodeURIComponent(fields)}&per_page=${perPage}&page=${page}`);
    }

    case 'zoho_get_record': {
      const module = args.module as string;
      const id = args.id as string;
      return zohoGet(context, `/${module}/${id}`);
    }

    case 'zoho_search_records': {
      const module = args.module as string;
      const criteria = encodeURIComponent(args.criteria as string);
      const perPage = (args.per_page as number) ?? 20;
      const page = (args.page as number) ?? 1;
      return zohoGet(context, `/${module}/search?criteria=${criteria}&per_page=${perPage}&page=${page}`);
    }

    case 'zoho_create_record': {
      const module = args.module as string;
      const data = args.data as Record<string, unknown>;
      return zohoPost(context, `/${module}`, { data: [data] });
    }

    case 'zoho_list_modules': {
      return zohoGet(context, '/settings/modules');
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 10 }, provider: 'zoho_crm' } satisfies McpToolExport;
