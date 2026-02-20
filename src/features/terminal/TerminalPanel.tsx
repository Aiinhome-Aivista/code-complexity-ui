"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";
import TerminalIconMUI from "@mui/icons-material/Terminal";
import MinimizeIcon from "@mui/icons-material/Remove";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { commonService } from "@/services/common_apiservice";

interface TerminalPanelProps {
    onMinimize: () => void;
    onClose: () => void;
}

interface TerminalLine {
    type: "input" | "output" | "error" | "info";
    text: string;
}

export function TerminalPanel({ onMinimize, onClose }: TerminalPanelProps) {
    const [lines, setLines] = useState<TerminalLine[]>([
        { type: "output", text: "Type a command and press Enter." },
    ]);
    const [currentCommand, setCurrentCommand] = useState("");
    const [isExecuting, setIsExecuting] = useState(false);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { activeSessionId } = useUIStore();
    const { user } = useAuthStore();

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines]);

    // Auto-focus input
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleCommand = useCallback(async (cmd: string) => {
        if (!cmd.trim()) return;

        // Add command to history
        setCommandHistory((prev) => [...prev, cmd]);
        setHistoryIndex(-1);

        // Show the command in output
        setLines((prev) => [...prev, { type: "input", text: `$ ${cmd}` }]);

        // Handle local commands
        if (cmd.trim() === "clear") {
            setLines([]);
            return;
        }
        if (cmd.trim() === "help") {
            setLines((prev) => [
                ...prev,
                { type: "info", text: "Available commands:" },
                { type: "info", text: "  clear    — Clear the terminal" },
                { type: "info", text: "  help     — Show this help" },
                { type: "info", text: "  Any other command is sent to the server" },
            ]);
            return;
        }

        // Get user ID
        let userId: number | string | undefined = user?.id;
        if (!userId) {
            try {
                userId = JSON.parse(localStorage.getItem("userdata") || "{}").id;
            } catch { /* ignore */ }
        }

        if (!userId || !activeSessionId) {
            setLines((prev) => [
                ...prev,
                { type: "error", text: "Error: User or session not found." },
            ]);
            return;
        }

        setIsExecuting(true);

        try {
            const response = await commonService.executeCommand({
                user_id: userId,
                session_id: activeSessionId,
                command: cmd,
            });

            if (response) {
                const output = response?.output || response?.message || response?.data || JSON.stringify(response);
                String(output).split("\n").forEach((line: string) => {
                    setLines((prev) => [...prev, { type: "output", text: line }]);
                });
            } else {
                setLines((prev) => [...prev, { type: "output", text: "No output received." }]);
            }
        } catch (error: any) {
            const errOutput = error?.response?.data?.output || error?.response?.data?.message || error?.message || "Command execution failed.";
            String(errOutput).split("\n").forEach((line: string) => {
                setLines((prev) => [...prev, { type: "error", text: line }]);
            });
        } finally {
            setIsExecuting(false);
        }
    }, [user, activeSessionId]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isExecuting) {
            handleCommand(currentCommand);
            setCurrentCommand("");
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
                setHistoryIndex(newIndex);
                setCurrentCommand(commandHistory[newIndex]);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex !== -1) {
                const newIndex = historyIndex + 1;
                if (newIndex >= commandHistory.length) {
                    setHistoryIndex(-1);
                    setCurrentCommand("");
                } else {
                    setHistoryIndex(newIndex);
                    setCurrentCommand(commandHistory[newIndex]);
                }
            }
        }
    };

    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    const getLineColor = (type: TerminalLine["type"]) => {
        switch (type) {
            case "input": return "text-cyan-400";
            case "output": return "text-slate-300";
            case "error": return "text-red-400";
            case "info": return "text-indigo-400";
        }
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-1.5 bg-gray-800 border-t border-gray-500 select-none flex-shrink-0">
                <div className="flex items-center gap-2">
                    <button onClick={onMinimize} className="w-5 h-5 rounded-full bg-indigo-500/60 hover:bg-indigo-400 transition-colors flex items-center justify-center cursor-pointer" title="Minimize">
                        <MinimizeIcon sx={{ fontSize: 12 }} className="text-white" />
                    </button>
                    <button onClick={onClose} className="w-5 h-5 rounded-full bg-indigo-500/60 hover:bg-indigo-400 transition-colors flex items-center justify-center cursor-pointer" title="Close">
                        <CloseIcon sx={{ fontSize: 12 }} className="text-white" />
                    </button>
                    <div className="h-3 w-px bg-slate-500 mx-1" />
                    <TerminalIconMUI sx={{ fontSize: 14 }} className="text-indigo-400" />
                    <span className="text-xs font-semibold text-slate-300 tracking-wide">Terminal</span>
                    {activeSessionId && (
                        <span className="text-xs text-slate-400 font-mono">— session: {activeSessionId}</span>
                    )}
                </div>
                <div className="flex items-center gap-1.5">
                    {isExecuting && <span className="text-xs text-yellow-300 animate-pulse mr-2">Running...</span>}
                    <span className={`w-2 h-2 rounded-full ${activeSessionId ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
                    <span className={`text-xs ${activeSessionId ? "text-green-400" : "text-red-400"}`}>
                        {activeSessionId ? "Connected" : "Disconnected"}
                    </span>
                </div>
            </div>

            {/* Terminal body */}
            <div
                ref={scrollRef}
                onClick={handleContainerClick}
                className="flex-1 overflow-y-auto cursor-text font-mono text-sm leading-relaxed bg-gray-800 px-6 py-1.5 custom-scrollbar"
            >
                {lines.map((line, i) => (
                    <div key={i} className={`${getLineColor(line.type)} whitespace-pre-wrap break-all`}>
                        {line.text}
                    </div>
                ))}

                {/* Active input line */}
                <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-cyan-400 flex-shrink-0">$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={currentCommand}
                        onChange={(e) => setCurrentCommand(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isExecuting}
                        className="flex-1 bg-transparent text-slate-200 outline-none border-none font-mono text-sm caret-indigo-400 disabled:opacity-50"
                        autoFocus
                        spellCheck={false}
                        autoComplete="off"
                    />
                </div>
            </div>
        </>
    );
}
