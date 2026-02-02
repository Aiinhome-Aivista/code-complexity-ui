import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Storage as Database,
  Description as FileCode,
  Inventory2 as Box,
  Settings,
  OpenInNew as ExternalLink,
} from "@mui/icons-material";

const getNodeIcon = (type: string, category: string) => {
  if (type === "table") return <Database sx={{ fontSize: 16 }} />;
  if (category === "component") return <Box sx={{ fontSize: 16 }} />;
  if (category === "util") return <Settings sx={{ fontSize: 16 }} />;
  return <FileCode sx={{ fontSize: 16 }} />;
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "model":
      return {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-700",
        text: "text-blue-600 dark:text-blue-400",
        accent: "bg-blue-600",
      };
    case "api":
      return {
        bg: "bg-green-50 dark:bg-green-900/20",
        border: "border-green-200 dark:border-green-700",
        text: "text-green-600 dark:text-green-400",
        accent: "bg-green-600",
      };
    case "component":
      return {
        bg: "bg-purple-50 dark:bg-purple-900/20",
        border: "border-purple-200 dark:border-purple-700",
        text: "text-purple-600 dark:text-purple-400",
        accent: "bg-purple-600",
      };
    case "util":
      return {
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        border: "border-yellow-200 dark:border-yellow-700",
        text: "text-yellow-600 dark:text-yellow-400",
        accent: "bg-yellow-600",
      };
    case "config":
      return {
        bg: "bg-orange-50 dark:bg-orange-900/20",
        border: "border-orange-200 dark:border-orange-700",
        text: "text-orange-600 dark:text-orange-400",
        accent: "bg-orange-600",
      };
    default:
      return {
        bg: "bg-gray-50 dark:bg-gray-900/20",
        border: "border-gray-200 dark:border-gray-700",
        text: "text-gray-600 dark:text-gray-400",
        accent: "bg-gray-600",
      };
  }
};

export default memo(function CustomNode({ data, selected }: NodeProps) {
  const { name, type, category, fields, dependenciesCount } = data;
  const colors = getCategoryColor(category);

  return (
    <div className="relative group">
      {/* Target Handle (Left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !-left-1.5 !bg-neutral-400 !border-2 !border-white dark:!border-neutral-900 transition-colors group-hover:!bg-blue-500"
      />

      <Card
        className={`${colors.bg} border ${
          selected ? "border-blue-500 ring-2 ring-blue-500/20" : colors.border
        } shadow-sm backdrop-blur-sm transition-all w-[280px]`}
      >
        <CardHeader className="pb-3 p-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div
                className={`${colors.accent} p-1.5 rounded-md flex-shrink-0 shadow-sm`}
              >
                <div className="text-white grid place-items-center">
                  {getNodeIcon(type, category)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <CardTitle
                    className={`text-sm font-semibold ${colors.text} truncate block`}
                    title={name}
                  >
                    {name}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge
                    variant="outline"
                    className={`text-[9px] px-1 py-0 h-4 ${colors.border} ${colors.text} bg-white/50 dark:bg-black/20`}
                  >
                    {type}
                  </Badge>
                  <span
                    className={`text-[10px] ${colors.text} opacity-80 capitalize`}
                  >
                    {category}
                  </span>
                </div>
              </div>
            </div>
            {dependenciesCount > 0 && (
              <div className="flex items-center text-neutral-400 bg-white/50 dark:bg-black/20 px-1.5 py-0.5 rounded text-[10px] border border-neutral-100 dark:border-neutral-800">
                {dependenciesCount}
                <ExternalLink sx={{ fontSize: 10, marginLeft: "2px" }} />
              </div>
            )}
          </div>
        </CardHeader>
        
        {fields && fields.length > 0 && (
          <CardContent className="pt-0 p-3">
            <div className="space-y-1 bg-white/60 dark:bg-black/10 rounded border border-neutral-200/50 dark:border-neutral-800/50 p-2">
              {fields.slice(0, 3).map((field: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-[11px] py-0.5 border-b border-dashed border-neutral-200 dark:border-neutral-800/50 last:border-0"
                >
                  <code className="text-neutral-700 dark:text-neutral-300 font-mono truncate max-w-[140px]" title={field.name}>
                    {field.name}
                  </code>
                  <span className="text-neutral-500 text-[10px] opacity-80">
                    {field.type}
                  </span>
                </div>
              ))}
              {fields.length > 3 && (
                <div className="text-[9px] text-neutral-400 text-center font-medium pt-1">
                  +{fields.length - 3} more
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Source Handle (Right) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !-right-1.5 !bg-neutral-400 !border-2 !border-white dark:!border-neutral-900 transition-colors group-hover:!bg-blue-500"
      />
    </div>
  );
});
