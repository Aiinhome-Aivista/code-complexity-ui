// Flow/dependency data for folder structure visualization

export interface FlowNode {
  id: string;
  name: string;
  type: "file" | "folder" | "table";
  category: "component" | "api" | "util" | "model" | "config";
  fields?: Array<{ name: string; type: string }>;
  dependencies?: string[]; // IDs of nodes this depends on
  x: number;
  y: number;
}

export const flowNodes: FlowNode[] = [
  // Models/Tables
  {
    id: "user",
    name: "user",
    type: "table",
    category: "model",
    x: 50,
    y: 50,
    fields: [
      { name: "id", type: "uuid" },
      { name: "username", type: "text" },
      { name: "email", type: "text" },
      { name: "created_at", type: "timestamp" },
    ],
  },
  {
    id: "user_credentials",
    name: "user_credentials",
    type: "table",
    category: "model",
    x: 50,
    y: 280,
    fields: [
      { name: "id", type: "uuid" },
      { name: "user_id", type: "uuid" },
      { name: "password_hash", type: "text" },
      { name: "salt", type: "text" },
    ],
    dependencies: ["user"],
  },
  {
    id: "user_session",
    name: "user_session",
    type: "table",
    category: "model",
    x: 50,
    y: 480,
    fields: [
      { name: "id", type: "uuid" },
      { name: "user_id", type: "uuid" },
      { name: "token", type: "text" },
      { name: "expires_at", type: "timestamp" },
    ],
    dependencies: ["user"],
  },
  {
    id: "address_master",
    name: "address_master",
    type: "table",
    category: "model",
    x: 350,
    y: 50,
    fields: [
      { name: "id", type: "uuid" },
      { name: "user_id", type: "uuid" },
      { name: "street", type: "text" },
      { name: "city", type: "text" },
      { name: "country", type: "text" },
    ],
    dependencies: ["user"],
  },
  {
    id: "user_level_master",
    name: "user_level_master",
    type: "table",
    category: "model",
    x: 350,
    y: 250,
    fields: [
      { name: "id", type: "uuid" },
      { name: "level_name", type: "text" },
      { name: "permissions", type: "jsonb" },
    ],
  },
  {
    id: "user_type_master",
    name: "user_type_master",
    type: "table",
    category: "model",
    x: 350,
    y: 420,
    fields: [
      { name: "id", type: "uuid" },
      { name: "type_name", type: "text" },
      { name: "description", type: "text" },
    ],
  },

  // API Layer
  {
    id: "auth_api",
    name: "auth.ts",
    type: "file",
    category: "api",
    x: 650,
    y: 100,
    fields: [
      { name: "login()", type: "async function" },
      { name: "register()", type: "async function" },
      { name: "logout()", type: "async function" },
      { name: "validateToken()", type: "function" },
    ],
    dependencies: ["user", "user_credentials", "user_session"],
  },
  {
    id: "users_api",
    name: "users.ts",
    type: "file",
    category: "api",
    x: 650,
    y: 350,
    fields: [
      { name: "getUserById()", type: "async function" },
      { name: "updateUser()", type: "async function" },
      { name: "deleteUser()", type: "async function" },
      { name: "getUserProfile()", type: "async function" },
    ],
    dependencies: ["user", "address_master", "user_level_master"],
  },

  // Components
  {
    id: "login_component",
    name: "LoginForm.tsx",
    type: "file",
    category: "component",
    x: 950,
    y: 80,
    fields: [
      { name: "email", type: "state" },
      { name: "password", type: "state" },
      { name: "handleSubmit()", type: "function" },
      { name: "validateForm()", type: "function" },
    ],
    dependencies: ["auth_api", "validators"],
  },
  {
    id: "user_profile",
    name: "UserProfile.tsx",
    type: "file",
    category: "component",
    x: 950,
    y: 280,
    fields: [
      { name: "userData", type: "state" },
      { name: "isEditing", type: "state" },
      { name: "handleUpdate()", type: "function" },
      { name: "loadProfile()", type: "async function" },
    ],
    dependencies: ["users_api"],
  },
  {
    id: "dashboard",
    name: "Dashboard.tsx",
    type: "file",
    category: "component",
    x: 950,
    y: 480,
    fields: [
      { name: "stats", type: "state" },
      { name: "loading", type: "state" },
      { name: "fetchData()", type: "async function" },
    ],
    dependencies: ["users_api", "auth_api"],
  },

  // Utils
  {
    id: "validators",
    name: "validators.ts",
    type: "file",
    category: "util",
    x: 1250,
    y: 50,
    fields: [
      { name: "validateEmail()", type: "function" },
      { name: "validatePassword()", type: "function" },
      { name: "sanitizeInput()", type: "function" },
    ],
  },
  {
    id: "helpers",
    name: "helpers.ts",
    type: "file",
    category: "util",
    x: 1250,
    y: 200,
    fields: [
      { name: "formatDate()", type: "function" },
      { name: "generateId()", type: "function" },
      { name: "parseJWT()", type: "function" },
    ],
  },
];
