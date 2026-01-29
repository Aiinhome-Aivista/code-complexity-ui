"use client";

import {
  Shield,
  Warning as AlertTriangle,
  Lock,
  LockOpen as Unlock,
} from "@mui/icons-material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Endpoint, endpoints } from "@/data/mockData";

interface APIAnalysisViewProps {
  endpoints: Endpoint[];
}

export function APIAnalysisView({ endpoints }: APIAnalysisViewProps) {
  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700";
      case "POST":
        return "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700";
      case "PUT":
        return "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700";
      case "DELETE":
        return "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700";
      case "PATCH":
        return "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-700";
      default:
        return "bg-neutral-50 dark:bg-neutral-900/30 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700";
    }
  };

  const getValidationColor = (coverage: number) => {
    if (coverage >= 80) return "text-green-600 dark:text-green-500";
    if (coverage >= 50) return "text-yellow-600 dark:text-yellow-500";
    return "text-red-600 dark:text-red-500";
  };

  const publicEndpoints = endpoints.filter((e) => e.isPublic);
  const missingValidation = endpoints.filter((e) => e.missingValidation);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl text-neutral-900 dark:text-neutral-100 mb-1">
          API & Parameter Analysis
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Security and validation coverage for all endpoints
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <Shield sx={{ fontSize: 20 }} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-mono text-neutral-900 dark:text-neutral-100">
                  {endpoints.length}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Total Endpoints</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Unlock sx={{ fontSize: 20 }} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-mono text-red-600 dark:text-red-400">
                  {publicEndpoints.length}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Public Endpoints</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900/50 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <AlertTriangle sx={{ fontSize: 20 }} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-mono text-yellow-600 dark:text-yellow-400">
                  {missingValidation.length}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  Missing Validation
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Endpoints Table */}
      <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-neutral-900 dark:text-neutral-100">Endpoint Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-200 dark:border-neutral-800 hover:bg-transparent">
                <TableHead className="text-neutral-500 dark:text-neutral-400">Endpoint</TableHead>
                <TableHead className="text-neutral-500 dark:text-neutral-400">Method</TableHead>
                <TableHead className="text-neutral-500 dark:text-neutral-400">Auth</TableHead>
                <TableHead className="text-neutral-500 dark:text-neutral-400 text-right">
                  Parameters
                </TableHead>
                <TableHead className="text-neutral-500 dark:text-neutral-400 text-right">
                  Validation
                </TableHead>
                <TableHead className="text-neutral-500 dark:text-neutral-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {endpoints.map((endpoint) => (
                <TableRow
                  key={endpoint.id}
                  className={`border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 ${
                    endpoint.isPublic && endpoint.missingValidation
                      ? "bg-red-50 dark:bg-red-950/10"
                      : endpoint.missingValidation
                        ? "bg-yellow-50 dark:bg-yellow-950/10"
                        : ""
                  }`}
                >
                  <TableCell className="font-mono text-sm text-neutral-700 dark:text-neutral-300">
                    {endpoint.endpoint}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getMethodColor(endpoint.method)}`}
                    >
                      {endpoint.method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {endpoint.auth ? (
                        <>
                          <Lock sx={{ fontSize: 14 }} className="text-green-600 dark:text-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-500">Yes</span>
                        </>
                      ) : (
                        <>
                          <Unlock sx={{ fontSize: 14 }} className="text-red-600 dark:text-red-500" />
                          <span className="text-xs text-red-600 dark:text-red-500">No</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-neutral-700 dark:text-neutral-300">
                    {endpoint.paramCount}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`font-mono text-sm ${getValidationColor(endpoint.validationCoverage)}`}
                    >
                      {endpoint.validationCoverage}%
                    </span>
                  </TableCell>
                  <TableCell>
                    {endpoint.isPublic && endpoint.missingValidation ? (
                      <Badge variant="destructive" className="text-xs">
                        High Risk
                      </Badge>
                    ) : endpoint.missingValidation ? (
                      <Badge
                        variant="outline"
                        className="text-xs border-yellow-200 dark:border-yellow-700 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20"
                      >
                        Needs Review
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs border-green-200 dark:border-green-700 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20"
                      >
                        OK
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Parameter Breakdown */}
      <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-neutral-900 dark:text-neutral-100">
            Parameter Breakdown Example
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              Endpoint: /api/users/:id (PUT)
            </h4>
            <div className="space-y-3 bg-neutral-50 dark:bg-neutral-950 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div>
                <h5 className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                  Headers
                </h5>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <code className="text-blue-600 dark:text-blue-400">Authorization</code>
                    <Badge
                      variant="outline"
                      className="text-xs border-green-200 dark:border-green-700 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20"
                    >
                      Validated
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <code className="text-blue-600 dark:text-blue-400">Content-Type</code>
                    <Badge
                      variant="outline"
                      className="text-xs border-green-200 dark:border-green-700 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20"
                    >
                      Validated
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                  Auth Context
                </h5>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <code className="text-blue-600 dark:text-blue-400">userId</code>
                    <Badge
                      variant="outline"
                      className="text-xs border-green-200 dark:border-green-700 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20"
                    >
                      Validated
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <code className="text-blue-600 dark:text-blue-400">role</code>
                    <Badge
                      variant="outline"
                      className="text-xs border-green-200 dark:border-green-700 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20"
                    >
                      Validated
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                  Request Body
                </h5>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <code className="text-blue-600 dark:text-blue-400">username</code>
                    <Badge
                      variant="outline"
                      className="text-xs border-green-200 dark:border-green-700 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20"
                    >
                      Validated
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <code className="text-blue-600 dark:text-blue-400">email</code>
                    <Badge
                      variant="outline"
                      className="text-xs border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20"
                    >
                      Missing
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <code className="text-blue-600 dark:text-blue-400">profile.bio</code>
                    <Badge
                      variant="outline"
                      className="text-xs border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20"
                    >
                      Missing
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ApiAnalysisPage() {
  return <APIAnalysisView endpoints={endpoints} />;
}
