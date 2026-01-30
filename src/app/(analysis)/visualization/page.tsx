"use client";

import React from "react";
import { useUIStore } from "@/store/uiStore";
import { Card, CardContent } from "@/components/ui/Card";

function Page() {
  const { projectResults } = useUIStore();
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  const graphUrl = projectResults?.graph_url;

  if (!hydrated) {
    return null; // Or a loading spinner
  }

  return (
    <div className="p-6 space-y-6 flex flex-col h-full">
      <div>
        <h1 className="text-2xl text-neutral-900 dark:text-neutral-100 mb-1">
          Project Visualization
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Relationship graph and structural analysis of your codebase
        </p>
      </div>

      <Card className="bg-gray-300 border-neutral-200  shadow-sm flex-1 overflow-hidden min-h-[600px]">
        <CardContent className="p-0 h-full w-full custom-scrollbar overflow-auto">
          {graphUrl ? (
            <iframe
              src={graphUrl}
              className="w-full h-full border-none custom-scrollbar bg-gray-200 dark:bg-neutral-900"
              title="Project Relationship Graph"
              sandbox="allow-scripts allow-same-origin"
              style={{
                colorScheme: "dark light",
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-500 italic">
              No visualization available. Please analyze a project first.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
