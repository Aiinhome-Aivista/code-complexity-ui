// Mock data for Code Quality Analysis Tool

export type RiskLevel = "safe" | "moderate" | "high" | "critical" | "low";
export type ExperienceLevel = "Junior" | "Mid" | "Senior";
export type MetricType =
  | "Complexity"
  | "Security"
  | "Reliability"
  | "Performance"
  | "Size";

export interface HeatmapData {
  file: string;
  lines: number;
  complexity: number;
  security: number;
  performance: number;
  size: number;
}

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  risk: RiskLevel;
  children?: FileNode[];
  path: string;
  lines?: number;
  isPublic?: boolean;
  hasUnvalidatedInputs?: boolean;
}

export interface Issue {
  id: string;
  type: "security" | "validation" | "performance" | "complexity";
  severity: RiskLevel;
  line: number;
  message: string;
  rule: string;
  confidence: number;
  explanation: string;
  facts: string[];
  original_snippet?: string;
  suggested_fix?: string;
}

export interface Endpoint {
  id: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  auth: boolean;
  paramCount: number;
  validationCoverage: number;
  isPublic: boolean;
  missingValidation: boolean;
}

export const fileTree: FileNode[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    risk: "moderate",
    path: "/src",
    children: [
      {
        id: "1-1",
        name: "components",
        type: "folder",
        risk: "safe",
        path: "/src/components",
        children: [
          {
            id: "1-1-1",
            name: "Header.tsx",
            type: "file",
            risk: "safe",
            path: "/src/components/Header.tsx",
            lines: 124,
          },
          {
            id: "1-1-2",
            name: "Dashboard.tsx",
            type: "file",
            risk: "moderate",
            path: "/src/components/Dashboard.tsx",
            lines: 456,
          },
          {
            id: "1-1-3",
            name: "UserAuth.tsx",
            type: "file",
            risk: "high",
            path: "/src/components/UserAuth.tsx",
            lines: 892,
          },
        ],
      },
      {
        id: "1-2",
        name: "api",
        type: "folder",
        risk: "high",
        path: "/src/api",
        children: [
          {
            id: "1-2-1",
            name: "auth.ts",
            type: "file",
            risk: "high",
            path: "/src/api/auth.ts",
            lines: 567,
            isPublic: true,
            hasUnvalidatedInputs: true,
          },
          {
            id: "1-2-2",
            name: "users.ts",
            type: "file",
            risk: "high",
            path: "/src/api/users.ts",
            lines: 734,
            isPublic: true,
            hasUnvalidatedInputs: false,
          },
          {
            id: "1-2-3",
            name: "payments.ts",
            type: "file",
            risk: "moderate",
            path: "/src/api/payments.ts",
            lines: 423,
            isPublic: false,
            hasUnvalidatedInputs: true,
          },
        ],
      },
      {
        id: "1-3",
        name: "utils",
        type: "folder",
        risk: "safe",
        path: "/src/utils",
        children: [
          {
            id: "1-3-1",
            name: "validators.ts",
            type: "file",
            risk: "safe",
            path: "/src/utils/validators.ts",
            lines: 234,
          },
          {
            id: "1-3-2",
            name: "helpers.ts",
            type: "file",
            risk: "safe",
            path: "/src/utils/helpers.ts",
            lines: 178,
          },
        ],
      },
      {
        id: "1-4",
        name: "index.ts",
        type: "file",
        risk: "safe",
        path: "/src/index.ts",
        lines: 45,
      },
      {
        id: "1-5",
        name: "App.tsx",
        type: "file",
        risk: "moderate",
        path: "/src/App.tsx",
        lines: 312,
      },
    ],
  },
  {
    id: "2",
    name: "tests",
    type: "folder",
    risk: "safe",
    path: "/tests",
    children: [
      {
        id: "2-1",
        name: "auth.test.ts",
        type: "file",
        risk: "safe",
        path: "/tests/auth.test.ts",
        lines: 156,
      },
      {
        id: "2-2",
        name: "users.test.ts",
        type: "file",
        risk: "safe",
        path: "/tests/users.test.ts",
        lines: 203,
      },
    ],
  },
];

export const projectHealth = {
  overallScore: 72,
  ratings: {
    readability: 4.2,
    modularity: 3.8,
    security: 2.9,
    reliability: 3.5,
    performance: 3.2,
    sizeHealth: 4.0,
  },
  warnings: {
    publicEndpoints: 12,
    missingValidation: 8,
    performanceRisks: 5,
  },
};

export const endpoints: Endpoint[] = [
  {
    id: "1",
    endpoint: "/api/users",
    method: "GET",
    auth: false,
    paramCount: 3,
    validationCoverage: 33,
    isPublic: true,
    missingValidation: true,
  },
  {
    id: "2",
    endpoint: "/api/users/:id",
    method: "PUT",
    auth: true,
    paramCount: 8,
    validationCoverage: 87,
    isPublic: false,
    missingValidation: true,
  },
  {
    id: "3",
    endpoint: "/api/auth/login",
    method: "POST",
    auth: false,
    paramCount: 2,
    validationCoverage: 100,
    isPublic: true,
    missingValidation: false,
  },
  {
    id: "4",
    endpoint: "/api/auth/register",
    method: "POST",
    auth: false,
    paramCount: 5,
    validationCoverage: 60,
    isPublic: true,
    missingValidation: true,
  },
  {
    id: "5",
    endpoint: "/api/payments",
    method: "POST",
    auth: true,
    paramCount: 12,
    validationCoverage: 75,
    isPublic: false,
    missingValidation: true,
  },
  {
    id: "6",
    endpoint: "/api/payments/:id",
    method: "GET",
    auth: true,
    paramCount: 1,
    validationCoverage: 100,
    isPublic: false,
    missingValidation: false,
  },
  {
    id: "7",
    endpoint: "/api/profile",
    method: "GET",
    auth: false,
    paramCount: 0,
    validationCoverage: 0,
    isPublic: true,
    missingValidation: true,
  },
  {
    id: "8",
    endpoint: "/api/profile",
    method: "PATCH",
    auth: true,
    paramCount: 15,
    validationCoverage: 53,
    isPublic: false,
    missingValidation: true,
  },
];

export const codeExample = `import express from 'express';
import { Request, Response } from 'express';

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  
  // SECURITY RISK: No input validation
  const user = await db.query(\`SELECT * FROM users WHERE id = \${userId}\`);
  
  // VALIDATION ISSUE: No null check
  return res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  
  // PERFORMANCE RISK: Synchronous password hashing
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  // SECURITY RISK: No input sanitization
  const newUser = await db.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
    [username, email, hashedPassword]
  );
  
  return res.status(201).json(newUser);
};`;

export const issuesForFile: Issue[] = [
  {
    id: "issue-1",
    type: "security",
    severity: "high",
    line: 7,
    message: "SQL Injection vulnerability detected",
    rule: "no-sql-injection",
    confidence: 95,
    explanation:
      "Direct string interpolation in SQL queries allows attackers to inject malicious SQL code. This can lead to unauthorized data access, modification, or deletion.",
    facts: [
      "User input directly concatenated into SQL query",
      "No parameterization or prepared statements used",
      "Critical database operation affected",
    ],
  },
  {
    id: "issue-2",
    type: "validation",
    severity: "high",
    line: 10,
    message: "Missing null/undefined check",
    rule: "null-check-required",
    confidence: 88,
    explanation:
      "The query result could be null or undefined if no user is found, but the code attempts to use it without validation. This can cause runtime errors and expose system behavior.",
    facts: [
      "Database query result not validated",
      "No error handling for empty results",
      "Direct use of potentially undefined value",
    ],
  },
  {
    id: "issue-3",
    type: "performance",
    severity: "moderate",
    line: 17,
    message: "Synchronous operation blocking event loop",
    rule: "no-sync-crypto",
    confidence: 92,
    explanation:
      "Synchronous password hashing blocks the Node.js event loop, preventing other requests from being processed. Under load, this can cause severe performance degradation.",
    facts: [
      "bcrypt.hashSync is blocking",
      "Event loop will be blocked for ~100ms per request",
      "Async alternative (bcrypt.hash) available",
    ],
  },
  {
    id: "issue-4",
    type: "security",
    severity: "moderate",
    line: 20,
    message: "Insufficient input sanitization",
    rule: "validate-user-input",
    confidence: 78,
    explanation:
      "User inputs (username, email) are not validated or sanitized before database insertion. Malformed or malicious data could compromise data integrity or cause injection attacks.",
    facts: [
      "No email format validation",
      "No username length/character restrictions",
      "Missing input sanitization layer",
    ],
  },
];

export const heatmapData = [
  {
    file: "auth.ts",
    lines: 567,
    complexity: 85,
    security: 92,
    performance: 45,
    size: 78,
  },
  {
    file: "users.ts",
    lines: 734,
    complexity: 78,
    security: 88,
    performance: 52,
    size: 85,
  },
  {
    file: "payments.ts",
    lines: 423,
    complexity: 62,
    security: 45,
    performance: 68,
    size: 55,
  },
  {
    file: "UserAuth.tsx",
    lines: 892,
    complexity: 91,
    security: 75,
    performance: 38,
    size: 92,
  },
  {
    file: "Dashboard.tsx",
    lines: 456,
    complexity: 55,
    security: 25,
    performance: 72,
    size: 58,
  },
  {
    file: "Header.tsx",
    lines: 124,
    complexity: 22,
    security: 15,
    performance: 88,
    size: 18,
  },
  {
    file: "validators.ts",
    lines: 234,
    complexity: 38,
    security: 12,
    performance: 82,
    size: 32,
  },
  {
    file: "helpers.ts",
    lines: 178,
    complexity: 28,
    security: 8,
    performance: 90,
    size: 24,
  },
];

export const performanceData = {
  buildTimeRisk: "moderate" as RiskLevel,
  responseTimeRisk: "high" as RiskLevel,
  largestFiles: [
    {
      name: "UserAuth.tsx",
      size: "89.2 KB",
      lines: 892,
      risk: "high" as RiskLevel,
    },
    {
      name: "users.ts",
      size: "73.4 KB",
      lines: 734,
      risk: "high" as RiskLevel,
    },
    {
      name: "auth.ts",
      size: "56.7 KB",
      lines: 567,
      risk: "moderate" as RiskLevel,
    },
    {
      name: "Dashboard.tsx",
      size: "45.6 KB",
      lines: 456,
      risk: "moderate" as RiskLevel,
    },
  ],
  godFunctions: [
    { name: "processUserData()", file: "users.ts", lines: 234, complexity: 45 },
    {
      name: "validateAndCreateUser()",
      file: "auth.ts",
      lines: 189,
      complexity: 38,
    },
    {
      name: "renderDashboard()",
      file: "Dashboard.tsx",
      lines: 156,
      complexity: 32,
    },
  ],
  projectSize: {
    totalFiles: 45,
    totalLines: 12543,
    avgFileSize: "23.4 KB",
  },
};
