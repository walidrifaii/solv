/** Build OpenAPI doc. `baseUrl` should be the public https origin (from the request). */
export function getOpenApiDocument(baseUrl?: string) {
  const fallback = process.env.APP_URL ?? "http://localhost:3000";
  const candidate = (baseUrl || fallback).trim().replace(/\/$/, "");

  // Swagger "Try it out" only works with http/https — never mysql://, blank, or localhost:80 behind a proxy
  let appUrl = /^https?:\/\//i.test(candidate)
    ? candidate
    : "http://localhost:3000";

  try {
    const host = new URL(appUrl).hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1") {
      const envUrl = process.env.APP_URL?.trim().replace(/\/$/, "");
      if (envUrl && /^https?:\/\//i.test(envUrl)) {
        appUrl = envUrl;
      }
    }
  } catch {
    appUrl = "http://localhost:3000";
  }

  return {
    openapi: "3.0.3",
    info: {
      title: "Solv API",
      version: "1.0.0",
      description:
        "Solv coffee & tea shop API. Auth uses httpOnly JWT cookies (access + refresh) — tokens are never returned in the response body. Products and categories are read-only.",
    },
    servers: [{ url: appUrl, description: "Current host" }],
    tags: [
      { name: "Auth" },
      { name: "Admin Auth" },
      { name: "Products" },
      { name: "Categories" },
      { name: "Orders" },
      { name: "Subscribers" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "solv_access",
          description: "Access JWT set as httpOnly cookie after login/register/refresh",
        },
      },
      schemas: {
        ApiError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                message: { type: "string" },
                details: {},
              },
            },
          },
        },
        PaginationMeta: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            total: { type: "integer" },
            totalPages: { type: "integer" },
            hasNext: { type: "boolean" },
            hasPrev: { type: "boolean" },
          },
        },
        Client: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            name: { type: "string" },
            phone: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    paths: {
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register client",
          description: "Creates account and sets `solv_access` + `solv_refresh` httpOnly cookies.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 8 },
                    phone: { type: "string", nullable: true },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "Registered (cookies set)" },
            "409": { description: "Email already exists" },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login",
          description: "Sets JWT cookies — no tokens in body.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Logged in (cookies set)" },
            "401": { description: "Invalid credentials" },
          },
        },
      },
      "/api/auth/refresh": {
        post: {
          tags: ["Auth"],
          summary: "Refresh access token",
          description: "Uses `solv_refresh` cookie; rotates refresh token and sets new cookies.",
          responses: {
            "200": { description: "Cookies refreshed" },
            "401": { description: "Missing/invalid refresh cookie" },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Logout",
          description: "Revokes refresh token and clears auth cookies.",
          responses: {
            "200": { description: "Logged out" },
          },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Current client profile",
          security: [{ cookieAuth: [] }],
          responses: {
            "200": { description: "Profile" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/admin/auth/login": {
        post: {
          tags: ["Admin Auth"],
          summary: "Admin login",
          description:
            "Sets `solv_admin_access` + `solv_admin_refresh` httpOnly cookies (separate from client cookies).",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Admin logged in (cookies set)" },
            "401": { description: "Invalid credentials" },
          },
        },
      },
      "/api/admin/auth/refresh": {
        post: {
          tags: ["Admin Auth"],
          summary: "Refresh admin access token",
          responses: {
            "200": { description: "Admin cookies refreshed" },
            "401": { description: "Missing/invalid refresh cookie" },
          },
        },
      },
      "/api/admin/auth/logout": {
        post: {
          tags: ["Admin Auth"],
          summary: "Admin logout",
          responses: {
            "200": { description: "Logged out" },
          },
        },
      },
      "/api/admin/auth/me": {
        get: {
          tags: ["Admin Auth"],
          summary: "Current admin profile",
          responses: {
            "200": { description: "Admin profile" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/products": {
        get: {
          tags: ["Products"],
          summary: "List products (paginated)",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 12, maximum: 50 } },
            { name: "categoryId", in: "query", schema: { type: "string" } },
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "featured", in: "query", schema: { type: "string", enum: ["true", "false"] } },
            { name: "inStock", in: "query", schema: { type: "string", enum: ["true", "false"] } },
          ],
          responses: {
            "200": { description: "Paginated products" },
          },
        },
      },
      "/api/products/{slug}": {
        get: {
          tags: ["Products"],
          summary: "Get product by slug",
          parameters: [
            { name: "slug", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Product" },
            "404": { description: "Not found" },
          },
        },
      },
      "/api/categories": {
        get: {
          tags: ["Categories"],
          summary: "List categories (paginated)",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 50 } },
          ],
          responses: {
            "200": {
              description: "Paginated categories (includes imagePath)",
            },
          },
        },
      },
      "/api/categories/{id}": {
        get: {
          tags: ["Categories"],
          summary: "Get category by id or slug",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Category" },
            "404": { description: "Not found" },
          },
        },
      },
      "/api/orders": {
        get: {
          tags: ["Orders"],
          summary: "List my orders (paginated)",
          security: [{ cookieAuth: [] }],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 12, maximum: 50 } },
          ],
          responses: {
            "200": { description: "Paginated orders" },
            "401": { description: "Unauthorized" },
          },
        },
        post: {
          tags: ["Orders"],
          summary: "Create order (guest or logged-in)",
          description: "If logged in, attaches `clientId`. Snapshots price/discount on each line item.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "guestName",
                    "guestEmail",
                    "guestPhone",
                    "deliveryCity",
                    "deliveryAddress",
                    "items",
                  ],
                  properties: {
                    guestName: { type: "string" },
                    guestEmail: { type: "string", format: "email" },
                    guestPhone: { type: "string" },
                    deliveryCity: { type: "string" },
                    deliveryAddress: { type: "string" },
                    notes: { type: "string", nullable: true },
                    deliveryFee: { type: "number", default: 0 },
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        required: ["productId", "quantity"],
                        properties: {
                          productId: { type: "string" },
                          quantity: { type: "integer", minimum: 1 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "Order created" },
            "400": { description: "Validation / stock error" },
          },
        },
      },
      "/api/subscribers": {
        post: {
          tags: ["Subscribers"],
          summary: "Subscribe to newsletter",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: {
                    email: { type: "string", format: "email" },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "Subscribed" },
          },
        },
      },
    },
  };
}
