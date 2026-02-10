"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import {
  CloudUpload,
  InsertDriveFile,
  GitHub,
} from "@mui/icons-material";
import { cn } from "@/lib/utils";
import { commonService } from "@/services/common_apiservice";
import { Snackbar, Alert, CircularProgress } from "@mui/material";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess?: () => void;
}

export function UploadModal({
  open,
  onOpenChange,
  onUploadSuccess,
}: UploadModalProps) {
  const { user } = useAuthStore();
  const [projectName, setProjectName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    name: string;
    type: "file" | "git";
    size?: number;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [loadingText, setLoadingText] = useState("Uploading Project...");
  const [uploadMode, setUploadMode] = useState<"file" | "git">("file");
  const [gitUrl, setGitUrl] = useState("");
  const [gitBranch, setGitBranch] = useState("");
  const [gitToken, setGitToken] = useState("");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (isUploading) {
      const texts = [
        "Uploading Project...",
        "Analyzing Project Structure..."
      ];
      let index = 0;
      setLoadingText(texts[0]);

      const interval = setInterval(() => {
        index = (index + 1) % texts.length;
        setLoadingText(texts[index]);
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [isUploading]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (uploadMode !== "file") return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        setSelectedFiles(files);
        const name = files.length === 1
          ? files[0].name
          : `${files.length} files (${files.slice(0, 2).map(f => f.name).join(", ")}${files.length > 2 ? ", ..." : ""})`;

        setSelectedItem({
          name,
          type: "file",
          size: files.reduce((acc, file) => acc + file.size, 0),
        });
      }
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      const name = files.length === 1
        ? files[0].name
        : `${files.length} files (${files.slice(0, 2).map(f => f.name).join(", ")}${files.length > 2 ? ", ..." : ""})`;

      setSelectedItem({
        name,
        type: "file",
        size: files.reduce((acc, file) => acc + file.size, 0),
      });
    }
  };

  const handleUpload = async () => {
    if (!projectName.trim()) return;

    if (!user) {
      setToast({
        open: true,
        message: "User not authenticated. Please log in.",
        severity: "error",
      });
      return;
    }

    // Git Upload
    if (uploadMode === "git") {
      if (!gitUrl.trim()) return;

      try {
        setIsUploading(true);
        setLoadingText("Cloning Repository...");

        await commonService.uploadGit({
          user_id: user.id || 7, // Fallback as per user request example if user.id missing, largely safe
          project_name: projectName.trim(),
          repo_url: gitUrl.trim(),
          branch: gitBranch.trim() || "main",
          token: gitToken.trim(),
        });

        setToast({
          open: true,
          message: "Git project imported successfully!",
          severity: "success",
        });
        if (onUploadSuccess) onUploadSuccess();
        onOpenChange(false);
        resetSelection();
      } catch (error) {
        console.error("Git upload failed", error);
        setToast({
          open: true,
          message: "Failed to import from Git. Please check Repository URL and credentials.",
          severity: "error",
        });
      } finally {
        setIsUploading(false);
      }
      return;
    }

    if (!selectedItem) return;

    const formData = new FormData();
    formData.append("user_id", user.id.toString());
    formData.append("project_name", projectName.trim());

    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
    }

    // Create new abort controller
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsUploading(true);
      console.log("Starting upload...");
      await commonService.uploadFiles(formData, controller.signal);
      console.log("Upload successful");
      setToast({
        open: true,
        message: "Project uploaded successfully!",
        severity: "success",
      });
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      onOpenChange(false);
      resetSelection();
    } catch (error: any) {
      if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
        console.log("Upload cancelled by user");
        return;
      }
      console.error("Upload failed", error);
      setToast({
        open: true,
        message: "Failed to upload project. Please try again.",
        severity: "error",
      });
    } finally {
      setIsUploading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsUploading(false);
    resetSelection();
    onOpenChange(false);
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const resetSelection = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedItem(null);
    setSelectedFiles([]);
    setProjectName("");
    setGitUrl("");
    setGitBranch("");
    setGitToken("");
    setUploadMode("file");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gray-200 p-4 border-gray-400 text-gray-900 [&>button>svg]:!text-red-700/80">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Upload Project
          </DialogTitle>
          <DialogDescription className="text-gray-700">
            Upload your codebase to analyze and generate a heatmap.
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        {!isUploading && !selectedItem && (
          <div className="flex border-b border-gray-300 mb-4">
            <button
              className={cn(
                "flex-1 pb-3 text-sm font-medium transition-all relative cursor-pointer hover:bg-gray-50/50",
                uploadMode === "file"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              )}
              onClick={() => {
                setUploadMode("file");
                setGitUrl("");
              }}
            >
              Upload Files
              {uploadMode === "file" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-t-full" />
              )}
            </button>
            <button
              className={cn(
                "flex-1 pb-3 text-sm font-medium transition-all relative cursor-pointer hover:bg-gray-50/50",
                uploadMode === "git"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              )}
              onClick={() => {
                setUploadMode("git");
                setSelectedItem(null);
                setGitBranch("");
                setGitToken("");
              }}
            >
              Import from Git
              {uploadMode === "git" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-t-full" />
              )}
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {!isUploading && (
            <div className="space-y-2">
              <Label
                htmlFor="project-name"
                className="text-gray-700 font-semibold"
              >
                Project Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="project-name"
                placeholder="e.g. Code Analysis App"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-gray-150 border border-gray-500/50 text-gray-900 focus:border-gray-500/10 placeholder:text-gray-500"
              />
            </div>
          )}

          <div
            className={cn(
              "relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 overflow-hidden min-h-[250px]",
              isDragging ? "border-blue-600 bg-blue-100" : "border-gray-500 ",
            )}
            onDragOver={uploadMode === "file" ? handleDragOver : undefined}
            onDragLeave={uploadMode === "file" ? handleDragLeave : undefined}
            onDrop={uploadMode === "file" ? handleDrop : undefined}
          >
            {isUploading && (
              <div className="absolute inset-0 bg-white/95 dark:bg-neutral-900/95 z-50 flex flex-col items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
                {/* Scanner Animation Container */}
                <div className="relative w-24 h-24 mb-8">
                  {/* File Icon Base */}
                  <div className="absolute inset-0 flex items-center justify-center text-blue-100 dark:text-blue-900/30">
                    <InsertDriveFile style={{ fontSize: 80 }} />
                  </div>

                  {/* Scanning Beam */}
                  <div
                    className="absolute z-10 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                    style={{
                      animation: 'scan 2s ease-in-out infinite'
                    }}
                  />

                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:10px_10px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
                </div>

                <style dangerouslySetInnerHTML={{
                  __html: `
                    @keyframes scan {
                      0% { top: 0%; opacity: 0; }
                      15% { top: 0%; opacity: 1; }
                      50% { top: 100%; opacity: 1; }
                      85% { top: 100%; opacity: 0; }
                      100% { top: 0%; opacity: 0; }
                    }
                  `
                }} />

                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 animate-pulse mb-2">
                  {loadingText}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Please wait while we process your files...
                </p>
              </div>
            )}

            {/* Hidden Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              multiple // Allow multiple files selection if needed, but logic currently expects zip mainly or just one file visually
              className="hidden"
              onChange={handleFileChange}
            />

            {uploadMode === "git" ? (
              <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-gray-800/20 flex items-center justify-center mb-4 text-gray-800">
                  <GitHub style={{ fontSize: 32 }} />
                </div>
                <div className="w-full space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="git-url" className="text-gray-700 font-medium ml-1">
                      Repository URL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="git-url"
                      placeholder="e.g. https://github.com/username/repository"
                      value={gitUrl}
                      onChange={(e) => setGitUrl(e.target.value)}
                      className="bg-white border-gray-400 text-gray-900 placeholder:text-gray-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="git-branch" className="text-gray-700 font-medium ml-1">
                        Branch
                      </Label>
                      <Input
                        id="git-branch"
                        placeholder="e.g. main or master"
                        value={gitBranch}
                        onChange={(e) => setGitBranch(e.target.value)}
                        className="bg-white border-gray-400 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="git-token" className="text-gray-700 font-medium ml-1">
                        Token (Optional)
                      </Label>
                      <Input
                        id="git-token"
                        type="password"
                        placeholder="e.g. github_pat_..."
                        value={gitToken}
                        onChange={(e) => setGitToken(e.target.value)}
                        className="bg-white border-gray-400 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {selectedItem ? (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 z-10">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-blue-700/90">
                      <InsertDriveFile style={{ fontSize: 32 }} />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                      {selectedItem.name}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {selectedItem.type === "file" && selectedItem.size
                        ? `${(selectedItem.size / 1024).toFixed(1)} KB`
                        : `Selected`}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 text-red-700 hover:text-red-800 hover:bg-red-200 cursor-pointer"
                      onClick={resetSelection}
                      disabled={isUploading}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 z-10 w-full">
                    <div className="w-16 h-16 rounded-full bg-blue-800/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                      <CloudUpload
                        className="text-gray-700 group-hover:text-blue-700 transition-colors"
                        style={{ fontSize: 32 }}
                      />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-lg font-medium text-gray-900">
                        Drag and drop to upload
                      </h4>
                      <p className="text-sm text-gray-700">
                        or choose an option below
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 mt-2 w-full max-w-xs mx-auto">
                      <Button
                        disabled={isDragging}
                        variant="secondary"
                        size="default"
                        className="w-full bg-blue-800/20 hover:bg-blue-800/30 hover:scale-101 text-gray-900 h-10 justify-start px-4 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileClick();
                        }}
                      >
                        <InsertDriveFile className="mr-3 h-5 w-5 text-gray-600" />
                        <span>Select Files</span>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="cursor-pointer border-gray-500 text-white bg-gray-800/30 hover:bg-gray-800/40"
            onClick={handleCancelUpload}
          >
            Cancel
          </Button>
          <Button
            disabled={(!selectedItem && uploadMode === "file") || (uploadMode === "git" && !gitUrl) || isUploading || !projectName.trim()}
            onClick={handleUpload}
            className={cn(
              "bg-blue-800/80 hover:bg-blue-700/80 text-white cursor-pointer shadow-sm",
              isUploading && "text-xs",
            )}
          >
            {isUploading ? "Processing..." : (uploadMode === "git" ? "Import" : "Upload")}
          </Button>
        </DialogFooter>
      </DialogContent>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{
            width: "100%",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
