"use client";

import { useUIStore } from "@/store/uiStore";
import { Close as X, Code as CodeIcon } from "@mui/icons-material";
import { Tooltip, IconButton } from "@mui/material";

export function CodeTabs() {
    const openFiles = useUIStore((state) => state.openFiles);
    const selectedFileNode = useUIStore((state) => state.selectedFileNode);
    const setSelectedFileNode = useUIStore((state) => state.setSelectedFileNode);
    const removeOpenFile = useUIStore((state) => state.removeOpenFile);

    if (!openFiles || openFiles.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-1 overflow-hidden h-full items-end mr-4 min-w-0">
            <div className="flex items-end h-full w-full min-w-0">
                {openFiles.map((file) => {
                    const isActive = selectedFileNode?.id === file.id;

                    return (
                        <div
                            key={file.id}
                            onClick={() => setSelectedFileNode(file)}
                            className={`group flex items-center h-full px-2 md:px-3 min-w-[60px] max-w-[200px] flex-1 cursor-pointer border-r border-neutral-300 dark:border-neutral-700 transition-colors select-none ${isActive
                                ? "bg-white dark:bg-neutral-900 border-t-2 border-t-indigo-500 text-indigo-700 dark:text-indigo-400"
                                : "bg-gray-200/50 dark:bg-neutral-900/40 text-neutral-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 border-t-2 border-t-transparent"
                                }`}
                        >
                            <Tooltip title={file.path || file.name} placement="bottom" enterDelay={500}>
                                <div className="flex items-center flex-1 min-w-0">
                                    <CodeIcon sx={{ fontSize: 14 }} className={`mr-2 flex-shrink-0 ${isActive ? 'text-indigo-500' : 'text-neutral-400'}`} />
                                    <span className="text-xs font-mono truncate">{file.name}</span>
                                </div>
                            </Tooltip>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeOpenFile(file.id);
                                }}
                                className={`ml-2 rounded-sm p-0.5 hover:bg-gray-300 dark:hover:bg-neutral-700 transition-colors flex-shrink-0 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                            >
                                <X sx={{ fontSize: 12 }} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
