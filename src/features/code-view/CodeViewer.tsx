"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
    Warning as AlertTriangle,
    Shield,
    Bolt as Zap,
    ContentCopy as Copy,
    Close as X,
    ChevronLeft,
    ChevronRight,
    FactCheck,
    CheckCircle,
    Search,
    ExpandLess,
    ExpandMore,
    TextFields,
} from "@mui/icons-material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Snackbar, Alert, Tooltip } from "@mui/material";
import { Issue } from "@/data/mockData";
import { CodeTabs } from "./CodeTabs";
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getFileLanguage } from "@/lib/utils";
import { useTheme } from "next-themes";

interface FileCodeViewProps {
    code: string;
    issues: Issue[];
    fileName: string;
    onIgnore: (id: string) => void;
    onApplyFix: (issue: Issue) => void;
    exitingIssueIds: Set<string>;
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <Tooltip title={copied ? "Copied!" : "Copy code"}>
            <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-800"
                onClick={handleCopy}
            >
                {copied ? (
                    <CheckCircle sx={{ fontSize: 12 }} className="text-green-600" />
                ) : (
                    <Copy sx={{ fontSize: 12 }} className="text-neutral-500" />
                )}
            </Button>
        </Tooltip>
    );
}

export function CodeViewer({
    code,
    issues,
    fileName,
    onIgnore,
    onApplyFix,
    exitingIssueIds,
}: FileCodeViewProps) {
    const { theme, systemTheme } = useTheme();
    const isDarkMode = theme === "dark" || (theme === "system" && systemTheme === "dark");
    const [isCollapsed, setIsCollapsed] = useState(false); // Change to false for tabs? Or keep false as default

    // Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [matchCase, setMatchCase] = useState(false);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const codeLines = code.split("\n");

    // Search Logic
    const matches = useMemo(() => {
        if (!searchQuery) return [];
        const results: { lineIndex: number; start: number; end: number }[] = [];
        codeLines.forEach((line, i) => {
            let startIndex = 0;
            let index;
            const targetLine = matchCase ? line : line.toLowerCase();
            const targetQuery = matchCase ? searchQuery : searchQuery.toLowerCase();

            while ((index = targetLine.indexOf(targetQuery, startIndex)) > -1) {
                results.push({ lineIndex: i, start: index, end: index + searchQuery.length });
                startIndex = index + searchQuery.length;
            }
        });
        return results;
    }, [codeLines, searchQuery, matchCase]);

    // Reset match index when query changes
    useEffect(() => {
        setCurrentMatchIndex(matches.length > 0 ? 0 : -1);
    }, [matches.length]);

    const handleNextMatch = () => {
        if (matches.length === 0) {
            if (searchQuery.trim() !== "") {
                setSnackbarOpen(true);
            }
            return;
        }
        setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
    };

    const handlePrevMatch = () => {
        if (matches.length === 0) {
            if (searchQuery.trim() !== "") {
                setSnackbarOpen(true);
            }
            return;
        }
        setCurrentMatchIndex((prev) => (prev - 1 + matches.length) % matches.length);
    };

    // Auto-scroll to match
    useEffect(() => {
        if (currentMatchIndex >= 0 && matches[currentMatchIndex]) {
            const match = matches[currentMatchIndex];
            const lineElement = document.getElementById(`line-${match.lineIndex}`);
            if (lineElement) {
                lineElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [currentMatchIndex, matches]);

    // Auto-show/hide snackbar based on matches
    useEffect(() => {
        if (searchQuery && matches.length === 0) {
            setSnackbarOpen(true);
        } else {
            setSnackbarOpen(false);
        }
    }, [searchQuery, matches]);

    // Focus input when search opens
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        } else {
            setSearchQuery("");
            setSnackbarOpen(false);
        }
    }, [isSearchOpen]);


    const getIssueIcon = (type: Issue["type"]) => {
        switch (type) {
            case "security":
                return <Shield sx={{ fontSize: 16 }} className="text-red-500" />;
            case "validation":
                return (
                    <AlertTriangle sx={{ fontSize: 16 }} className="text-yellow-500" />
                );
            case "performance":
                return <Zap sx={{ fontSize: 16 }} className="text-orange-500" />;
            default:
                return (
                    <AlertTriangle sx={{ fontSize: 16 }} className="text-neutral-500" />
                );
        }
    };

    const getIssueBgColor = (severity: Issue["severity"]) => {
        switch (severity) {
            case "high":
                return "bg-red-50 dark:bg-red-950/30 border-l-red-500";
            case "moderate":
                return "bg-yellow-50 dark:bg-yellow-950/30 border-l-yellow-500";
            case "safe":
                return "bg-green-50 dark:bg-green-950/30 border-l-green-500";
        }
    };

    const issuesByLine = issues.reduce(
        (acc, issue) => {
            if (!acc[issue.line]) {
                acc[issue.line] = [];
            }
            acc[issue.line].push(issue);
            return acc;
        },
        {} as Record<number, Issue[]>,
    );

    return (
        <div className="flex h-full min-h-0 bg-white dark:bg-neutral-900 absolute inset-0">
            {/* Left Panel - Code Editor */}
            <div className="flex-1 border-r border-neutral-400 dark:border-neutral-700 flex flex-col min-w-0">
                <div className="h-8 border-b border-neutral-400 dark:border-neutral-700 px-4 flex items-center justify-between bg-gray-200 dark:bg-neutral-900 flex-shrink-0">
                    <CodeTabs />

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {isSearchOpen ? (
                            <div className="flex items-center bg-gray-300/40 dark:bg-neutral-800 rounded-md px-2 py-0.5 h-7 animate-in fade-in slide-in-from-right-4 duration-200 gap-1 mt-0.5">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Find..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none outline-none text-[13px] w-24 md:w-36 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            if (e.shiftKey) handlePrevMatch();
                                            else handleNextMatch();
                                        }
                                        if (e.key === "Escape") setIsSearchOpen(false);
                                    }}
                                />

                                {/* Match Case */}
                                <Tooltip title="Match Case">
                                    <button
                                        onClick={() => setMatchCase(!matchCase)}
                                        className={`rounded-sm p-0.5 transition-colors ${matchCase ? "bg-neutral-400/30 text-neutral-600 dark:text-neutral-300" : "text-neutral-500 hover:bg-neutral-400/20 dark:hover:bg-neutral-700"}`}
                                    >
                                        <TextFields sx={{ fontSize: 14 }} />
                                    </button>
                                </Tooltip>

                                <div className="h-3 w-px bg-neutral-400/50 dark:bg-neutral-700/50 mx-1" />

                                {/* Arrows */}
                                <div className="flex items-center gap-0.5">
                                    <button onClick={handlePrevMatch} className="hover:bg-neutral-400/20 dark:hover:bg-neutral-700 rounded-sm p-0.5 text-neutral-500 transition-colors">
                                        <ExpandLess sx={{ fontSize: 16 }} />
                                    </button>
                                    <button onClick={handleNextMatch} className="hover:bg-neutral-400/20 dark:hover:bg-neutral-700 rounded-sm p-0.5 text-neutral-500 transition-colors">
                                        <ExpandMore sx={{ fontSize: 16 }} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-1 pl-1 ml-1 border-l border-neutral-400/50 dark:border-neutral-700/50">
                                    <span className="text-[11px] text-neutral-500 min-w-[24px] text-center font-mono">
                                        {matches.length > 0 ? `${currentMatchIndex + 1}/${matches.length}` : "0/0"}
                                    </span>
                                    <button onClick={() => setIsSearchOpen(false)} className="ml-1 hover:bg-neutral-400/30 dark:hover:bg-neutral-700/60 rounded-sm p-0.5 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors cursor-pointer">
                                        <X sx={{ fontSize: 14 }} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Tooltip title="Find in file (Ctrl+F)">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300" onClick={() => setIsSearchOpen(true)}>
                                    <Search sx={{ fontSize: 18 }} />
                                </Button>
                            </Tooltip>
                        )}
                        <Tooltip title="Copy full code">
                            <span className="h-8 w-8 flex items-center justify-center">
                                <CopyButton text={code} />
                            </span>
                        </Tooltip>
                        <Badge
                            variant="outline"
                            className={`text-xs border-neutral-200 text-neutral-700 cursor-pointer transition-colors ${issues.length === 0 ? "bg-green-300" : "bg-red-300"
                                }`}
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            {issues.length} issues
                        </Badge>
                    </div>
                </div>
                <ScrollArea className="flex-1 bg-gray-100 dark:bg-neutral-950 min-h-0" ref={scrollAreaRef as any}>
                    <div className="text-[13px] leading-relaxed pb-32">
                        <SyntaxHighlighter
                            language={getFileLanguage(fileName)}
                            style={isDarkMode ? vscDarkPlus : prism}
                            customStyle={{ margin: 0, padding: '1rem 0', background: 'transparent' }}
                            wrapLines={true}
                            showLineNumbers={true}
                            lineNumberStyle={{ minWidth: '3.5rem', paddingRight: '1rem', color: isDarkMode ? '#6e7681' : '#9ca3af', textAlign: 'right', userSelect: 'none' }}
                            renderer={({ rows, stylesheet, useInlineStyles }) => {
                                return (
                                    <div style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                                        {rows.map((row: any, i: number) => {
                                            const lineNumber = i + 1;
                                            
                                            // Base class
                                            let className = `table-row transition-colors border-l-2 border-transparent ${isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5"} `;
                                            let style: React.CSSProperties = { display: 'table-row' };
                                            
                                            const isSearchMatch = matches.some(m => m.lineIndex === lineNumber - 1);
                                            const isCurrentMatch = matches[currentMatchIndex]?.lineIndex === lineNumber - 1;

                                            if (isCurrentMatch) {
                                                className += "bg-amber-200/50 dark:bg-amber-900/50 border-l-amber-500 ";
                                            } else if (isSearchMatch) {
                                                className += "bg-amber-100/30 dark:bg-amber-900/30 border-l-amber-300 ";
                                            }

                                            // Issue highlighting
                                            const lineIssues = issuesByLine[lineNumber];
                                            if (lineIssues?.length > 0) {
                                                const highestSeverityIssue = lineIssues.sort((a, b) => {
                                                    const severityOrder = { high: 3, moderate: 2, safe: 1 };
                                                    return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
                                                })[0];
                                                
                                                if (highestSeverityIssue.severity === "high") {
                                                    className += "bg-red-500/10 border-l-red-500 ";
                                                } else if (highestSeverityIssue.severity === "moderate") {
                                                    className += "bg-yellow-500/10 border-l-yellow-500 ";
                                                } else {
                                                    className += "bg-green-500/10 border-l-green-500 ";
                                                }
                                            }

                                            // Render Row
                                            return (
                                                <div key={i} className={className} style={style}>
                                                    {/* Line Number Cell */}
                                                    <div style={{
                                                        display: 'table-cell',
                                                        minWidth: '3.5rem',
                                                        paddingRight: '1rem',
                                                        color: isDarkMode ? '#6e7681' : '#9ca3af',
                                                        textAlign: 'right',
                                                        userSelect: 'none'
                                                    }}>
                                                        {lineNumber}
                                                    </div>
                                                    
                                                    {/* Code Cell */}
                                                    <div style={{
                                                        display: 'table-cell',
                                                        wordBreak: 'break-all',
                                                        whiteSpace: 'pre-wrap',
                                                        paddingLeft: '1rem',
                                                        width: '100%'
                                                    }}>
                                                        {row.children.map((child: any, j: number) => {
                                                            const nodeProps = {
                                                                key: `${i}-${j}`,
                                                                className: child.properties?.className?.join(' '),
                                                                style: useInlineStyles ? child.properties?.style : undefined
                                                            };
                                                            
                                                            return <span {...nodeProps}>{child.children?.[0]?.value || ''}</span>;
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            }}
                        >
                            {code}
                        </SyntaxHighlighter>
                    </div>
                </ScrollArea>
            </div>

            {/* Right Panel - Issue Details */}
            <div
                className={`bg-gray-200 dark:bg-neutral-900 flex flex-col flex-shrink-0 border-l border-neutral-300 dark:border-neutral-700 transition-all duration-300 ease-in-out ${isCollapsed ? "w-[50px]" : "w-[420px]"
                    }`}
            >
                <div className="h-12 border-b border-neutral-300 dark:border-neutral-700 px-2 flex items-center justify-between bg-gray-200 dark:bg-neutral-900 overflow-hidden flex-shrink-0">
                    {!isCollapsed && (
                        <span className="text-sm text-neutral-900 dark:text-neutral-300 ml-2 whitespace-nowrap">
                            Issue Details
                        </span>
                    )}
                    <Tooltip title={isCollapsed ? "Open Issue Details" : "Close Issue Details"}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-400/20"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            {isCollapsed ? <ChevronLeft className="text-neutral-500" /> : <ChevronRight className="text-neutral-500" />}
                        </Button>
                    </Tooltip>
                </div>
                <ScrollArea className={`flex-1 min-h-0 ${isCollapsed ? "hidden" : "block"}`}>
                    {issues.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-60 hover:opacity-100 transition-opacity min-h-[400px]">
                            <div className="w-24 h-24 mb-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                <FactCheck sx={{ fontSize: 48 }} className="text-neutral-400 dark:text-neutral-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                0 Issues Found
                            </h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-[240px] leading-relaxed">
                                We've analyzed this file and couldn't find any issues. Looks good!
                            </p>
                        </div>
                    ) : (
                        <div className="p-4 space-y-4 pb-20">
                            {issues.map((issue) => (
                                <div
                                    key={issue.id}
                                    className={`transition-all duration-500 ease-in-out ${exitingIssueIds.has(issue.id)
                                        ? "opacity-0 translate-x-full max-h-0 overflow-hidden mb-0"
                                        : "opacity-100 max-h-[2000px]"
                                        }`}
                                >
                                    <Card
                                        className={`${getIssueBgColor(
                                            issue.severity,
                                        )} border-l-4 border-t-0 border-r-0 border-b-0 rounded-l-none bg-gray-200 dark:bg-neutral-800 shadow-sm`}
                                    >
                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-2">
                                                    <div className="mt-0.5">{getIssueIcon(issue.type)}</div>
                                                    <div>
                                                        <CardTitle className="text-sm text-neutral-900 dark:text-neutral-100 mb-1 leading-snug break-words whitespace-normal">
                                                            {issue.message}
                                                        </CardTitle>
                                                        <div className="flex items-center gap-2 mt-1.5">
                                                            <Badge
                                                                variant={
                                                                    issue.severity === "high"
                                                                        ? "destructive"
                                                                        : "secondary"
                                                                }
                                                                className={`text-[10px] h-5 px-1.5 ${issue.severity === "safe"
                                                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                                    : ""
                                                                    }`}
                                                            >
                                                                {issue.severity}
                                                            </Badge>
                                                            <span className="text-xs text-neutral-500">
                                                                Line {issue.line}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3 pt-0">
                                            {/* Facts */}
                                            {issue.facts && issue.facts.length > 0 && (
                                                <div>
                                                    <h4 className="text-[10px] text-neutral-500 mb-1.5 uppercase tracking-wider font-semibold">
                                                        Facts
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {issue.facts.map((fact, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="text-xs text-neutral-600 dark:text-neutral-400 flex gap-2"
                                                            >
                                                                <span className="text-neutral-400 dark:text-neutral-600">
                                                                    •
                                                                </span>
                                                                <span>{fact}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Rule */}
                                            <div>
                                                <h4 className="text-[10px] text-neutral-500 mb-1 uppercase tracking-wider font-semibold">
                                                    Rule Triggered
                                                </h4>
                                                <code className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-1.5 py-0.5 rounded font-mono border border-blue-200 dark:border-blue-900/50 break-all whitespace-normal">
                                                    {issue.rule}
                                                </code>
                                            </div>

                                            {/* Confidence */}
                                            <div>
                                                <h4 className="text-[10px] text-neutral-500 mb-1 uppercase tracking-wider font-semibold">
                                                    Confidence
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500"
                                                            style={{ width: `${issue.confidence}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                                                        {issue.confidence}%
                                                    </span>
                                                </div>
                                            </div>

                                            {/* AI Explanation */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h4 className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                                                        Suggested Explanation
                                                    </h4>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] h-4 px-1 border-purple-200 dark:border-purple-900/50 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/10"
                                                    >
                                                        AI
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed bg-gray-300 dark:bg-neutral-900/50 p-2.5 rounded border border-neutral-300 dark:border-neutral-800/50">
                                                    {issue.explanation}
                                                </p>
                                            </div>

                                            {/* Original Snippet */}
                                            {issue.original_snippet && (
                                                <div className="mt-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                                                            Current Code
                                                        </h4>
                                                    </div>
                                                    <pre className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/10 p-2 rounded border border-red-200 dark:border-red-900/30 whitespace-pre-wrap break-all font-mono overflow-x-hidden">
                                                        <code>{issue.original_snippet}</code>
                                                    </pre>
                                                </div>
                                            )}

                                            {/* Suggested Fix */}
                                            {issue.suggested_fix && (
                                                <div className="mt-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                                                            Suggested Fix
                                                        </h4>
                                                        <CopyButton text={issue.suggested_fix} />
                                                    </div>
                                                    <pre className="text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/10 p-2 rounded border border-green-200 dark:border-green-900/30 whitespace-pre-wrap break-all font-mono overflow-x-hidden">
                                                        <code>{issue.suggested_fix}</code>
                                                    </pre>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-1">
                                                <Button
                                                    size="sm"
                                                    className="flex-1 h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white border-none cursor-pointer font-medium"
                                                    onClick={() => onApplyFix(issue)}
                                                    disabled={!issue.suggested_fix}
                                                >
                                                    <CheckCircle sx={{ fontSize: 14 }} className="mr-1.5" />
                                                    Apply Fix
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="flex-1 h-7 text-xs bg-gray-400 hover:bg-gray-500 text-gray-900 border-none cursor-pointer"
                                                    onClick={() => onIgnore(issue.id)}
                                                >
                                                    <X sx={{ fontSize: 14 }} className="mr-1.5" />
                                                    Ignore
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>
            <Snackbar
                open={snackbarOpen}
                transitionDuration={0}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert
                    severity="info"
                    variant="filled"
                    className="bg-indigo-200 text-indigo-900 shadow-md"
                    sx={{
                        width: "100%",
                        borderRadius: 2,
                    }}
                >
                    No match found
                </Alert>
            </Snackbar>
        </div >
    );
}
