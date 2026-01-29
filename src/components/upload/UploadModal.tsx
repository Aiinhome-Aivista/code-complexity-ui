"use client";

import { useState, useRef } from "react";
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
  Folder as FolderIcon,
} from "@mui/icons-material";
import { cn } from "@/lib/utils";
import { commonService } from "@/services/common_apiservice";
import { Snackbar, Alert } from "@mui/material";
import { useAuthStore } from "@/store/authStore";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess?: () => void;
}

// Add type for webkitdirectory
declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

export function UploadModal({
  open,
  onOpenChange,
  onUploadSuccess,
}: UploadModalProps) {
  const { user } = useAuthStore();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    name: string;
    type: "file" | "folder";
    count?: number;
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 1) {
        setSelectedItem({
          name: `${files.length} files selected`,
          type: "folder",
          count: files.length,
        });
      } else {
        const file = files[0];
        setSelectedItem({
          name: file.name,
          type: "file",
          size: file.size,
        });
      }
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFolderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    folderInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      if (files.length > 1) {
        setSelectedItem({
          name: `${files.length} files selected`,
          type: "file",
          count: files.length,
        });
      } else {
        const file = files[0];
        setSelectedItem({
          name: file.name,
          type: "file",
          size: file.size,
        });
      }
    }
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      const folderName =
        files[0].webkitRelativePath.split("/")[0] || "Selected Folder";

      setSelectedItem({
        name: folderName,
        type: "folder",
        count: files.length,
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedItem) return;

    if (!user) {
      setToast({
        open: true,
        message: "User not authenticated. Please log in.",
        severity: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("user_id", user.id.toString());

    if (fileInputRef.current?.files?.length) {
      Array.from(fileInputRef.current.files).forEach((file) => {
        formData.append("files", file);
      });
    } else if (folderInputRef.current?.files?.length) {
      Array.from(folderInputRef.current.files).forEach((file) => {
        formData.append("files", file);
      });
    }

    try {
      setIsUploading(true);
      console.log("Starting upload...");
      await commonService.uploadFiles(formData);
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
      setSelectedItem(null);
    } catch (error) {
      console.error("Upload failed", error);
      setToast({
        open: true,
        message: "Failed to upload project. Please try again.",
        severity: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const resetSelection = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedItem(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (folderInputRef.current) folderInputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gray-300 border-gray-400 text-gray-900 [&>button>svg]:!text-black">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Upload Project
          </DialogTitle>
          <DialogDescription className="text-gray-700">
            Upload your codebase to analyze and generate a heatmap.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div
            className={cn(
              "relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 overflow-hidden",
              isDragging
                ? "border-blue-600 bg-blue-100"
                : "border-gray-500 ",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Hidden Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              ref={folderInputRef}
              type="file"
              className="hidden"
              {...({ webkitdirectory: "", directory: "" } as any)}
              onChange={handleFolderChange}
            />

            {selectedItem ? (
              <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 z-10">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-blue-700">
                  {selectedItem.type === "folder" ? (
                    <FolderIcon style={{ fontSize: 32 }} />
                  ) : (
                    <InsertDriveFile style={{ fontSize: 32 }} />
                  )}
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-1">
                  {selectedItem.name}
                </h4>
                <p className="text-sm text-gray-700">
                  {selectedItem.type === "file" && selectedItem.size
                    ? `${(selectedItem.size / 1024).toFixed(1)} KB`
                    : `${selectedItem.count} files`}
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
                <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
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
                    className="w-full bg-gray-400/60 hover:bg-gray-400/30 hover:scale-101 border border-gray-400 text-gray-900 h-10 justify-start px-4 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent bubbling
                      handleFileClick();
                    }}
                  >
                    <InsertDriveFile className="mr-3 h-5 w-5 text-gray-600" />
                    <span>Select File</span>
                  </Button>
                  <Button
                    disabled={isDragging}
                    variant="secondary"
                    size="default"
                    className="w-full bg-gray-400/60 hover:bg-gray-400/30 hover:scale-101  border border-gray-400 text-gray-900 h-10 justify-start px-4 cursor-pointer"
                    onClick={handleFolderClick}
                  >
                    <FolderIcon className="mr-3 h-5 w-5 text-gray-600" />
                    <span>Select Folder</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="cursor-pointer border-gray-500 text-white bg-gray-800/40 hover:bg-gray-800/50"
            disabled={isUploading}
            onClick={() => {
              resetSelection();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!selectedItem || isUploading}
            onClick={handleUpload}
            className={cn(
              "bg-blue-700 hover:bg-blue-800 text-white cursor-pointer shadow-sm",
              isUploading && "text-xs",
            )}
          >
            {isUploading ? "Uploading..." : "Upload"}
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
            bgcolor:
              toast.severity === "success"
                ? "#00a545ff" // Matching "Done" green
                : "#ae0000ff", // Matching "Failed" red
            color: "#ffffff",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
