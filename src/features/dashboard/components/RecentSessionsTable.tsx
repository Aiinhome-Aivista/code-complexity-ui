"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { commonService } from "@/services/common_apiservice";
import { useUIStore } from "@/store/uiStore";
import { useSessionStore } from "@/store/sessionStore";
import type { SessionDataTableItem } from "@/types/common_api_types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Box,
  Typography,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search,
  Refresh,
  Visibility,
  Delete,
  SearchOff,
} from "@mui/icons-material";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface Session {
  id: string;
  name: string;
  files: string[];
  date: string;
  datatypes: "Done" | "Pending" | "Failed";
  relationships: "Done" | "Pending" | "Failed";
  visualization: "Done" | "Pending" | "Failed";
  insights: "Done" | "Pending" | "Failed";
  status: "Completed" | "Pending" | "Failed";
}

const mockSessions: Session[] = Array.from({ length: 15 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `project-analysis-session-${i + 1}`,
  files:
    i % 2 === 0
      ? ["src/app.tsx", "src/utils.ts"]
      : ["components/Header.tsx", "lib/api.ts", "styles/main.css"],
  date: new Date(Date.now() - i * 86400000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }),
  datatypes: "Done",
  relationships: i % 3 === 0 ? "Pending" : "Done",
  visualization: i % 4 === 0 ? "Failed" : "Done",
  insights: i % 2 === 0 ? "Pending" : "Done",
  status: i % 3 === 0 ? "Pending" : i % 4 === 0 ? "Failed" : "Completed",
}));

const getStatusChipColor = (status: string) => {
  const normalizedStatus = status?.toLowerCase();
  switch (normalizedStatus) {
    case "done":
    case "completed":
      return { bgcolor: "rgba(222, 222, 222, 0.55)", color: "#00a545ff" };
    case "pending":
      return { bgcolor: "rgba(222, 222, 222, 0.55)  ", color: "#9d7f05ff" };
    case "failed":
      return { bgcolor: "rgba(222, 222, 222, 0.55)", color: "#ae0000ff" };
    default:
      return { bgcolor: "rgba(222, 222, 222, 0.55)", color: "#a3a3a3" };
  }
};

import { useAuthStore } from "@/store/authStore";

export function RecentSessionsTable({
  refreshTrigger = 0,
}: {
  refreshTrigger?: number;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Delete & Toast State
  const [confirmSnackbarOpen, setConfirmSnackbarOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | string | null>(
    null,
  );
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const router = useRouter();
  const {
    setProjectResults,
    setHeatmapData,
    fileNodeData, // Added for logging
    setFileNodeData,
    setActiveProjectName,
    setActiveSessionId,
    setFlowData,
  } = useUIStore();
  const {
    sessions,
    setSessions,
    isSessionsLoading,
    setIsSessionsLoading,
  } = useSessionStore();
  const { user } = useAuthStore();

  const handleViewResults = async (id: number | string) => {
    try {
      const response = await commonService.getResults(id);
      if (response && response.isSuccess) {
        setProjectResults(response.data);

        // Find the selected session...
        const selectedSession = sessions.find((s) => s.id === id);

        if (selectedSession) {
          setActiveProjectName(selectedSession.name);
          setActiveSessionId(selectedSession.session_id); // Set active session ID
          router.push("/code-health");

          // Fetch Heatmap Data and FileNode Data in background with dynamic IDs
          const heatmapPayload = {
            project_id: selectedSession.id,
            session_id: selectedSession.session_id,
          };

          // Heatmap Call
          commonService
            .getHeatmapData(heatmapPayload)
            .then((heatmapResponse) => {
              if (heatmapResponse) {
                setHeatmapData(heatmapResponse);
              }
            })
            .catch((err) => {
              console.error("Error fetching heatmap data:", err);
            });

          // FileNode Call (Dynamic Payload)
          const fileNodePayload = {
            user_id: user?.id,
            session_id: selectedSession.session_id,
          };

          commonService
            .getFileNodeData(fileNodePayload)
            .then((fileNodeResponse) => {
              if (fileNodeResponse) {
                console.log("FileNodeData fetched from API:", fileNodeResponse);
                setFileNodeData(fileNodeResponse);
              }
            })
            .catch((err) => {
              console.error("Error fetching file node data:", err);
            });

          // Flow Data Call
          const flowPayload = {
            project_id: selectedSession.id,
            session_id: selectedSession.session_id,
          };

          commonService
            .getFlowData(flowPayload)
            .then((flowResponse) => {
              if (flowResponse) {
                setFlowData(flowResponse);
              }
            })
            .catch((err) => {
              console.error("Error fetching flow data:", err);
            });
        } else {
          console.warn(
            "Could not find session details for heatmap fetch, ID:",
            id,
          );
        }
      }
    } catch (error) {
      console.error("Error fetching project results:", error);
    }
  };

  const handleDeleteClick = (id: number | string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTargetId(id);
    setConfirmSnackbarOpen(true);
  };

  const handleCancelDelete = () => {
    setConfirmSnackbarOpen(false);
    setDeleteTargetId(null);
  };

  const activeDelete = async () => {
    if (!deleteTargetId) return;
    const targetId = deleteTargetId;
    setConfirmSnackbarOpen(false);

    try {
      await commonService.deleteProject(targetId);
      setToast({
        open: true,
        message: "Session deleted successfully",
        severity: "success",
      });
      if (user) fetchSessions();
    } catch (error) {
      console.error("Error deleting session:", error);
      setToast({
        open: true,
        message: "Failed to delete session",
        severity: "error",
      });
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const fetchSessions = async (search?: string, status?: string) => {
    if (!user) return; // Wait for user to be loaded

    try {
      setIsSessionsLoading(true);
      const response = await commonService.getSessionDataTable(
        user.id.toString(),
        search,
        status,
      );
      if (response?.isSuccess) {
        setSessions(response.data);
        setToast({
          open: true,
          message: "Sessions refreshed successfully",
          severity: "success",
        });
      } else {
        setToast({
          open: true,
          message: "Failed to fetch sessions",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      setToast({
        open: true,
        message: "Network error: Failed to fetch sessions",
        severity: "error",
      });
    } finally {
      setIsSessionsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]); // Add user dependency so it fetches once available

  useEffect(() => {
    if (refreshTrigger > 0 && user) {
      fetchSessions();
    }
  }, [refreshTrigger, user]);

  // Log FileNodeData changes
  useEffect(() => {
    if (fileNodeData) {
      console.log("Current FileNodeData in Store:", fileNodeData);
      const storageState = localStorage.getItem('code-heatmap-storage-v1');
      console.log("LocalStorage State:", storageState ? JSON.parse(storageState) : "Empty");
    }
  }, [fileNodeData]);

  const handleRefresh = () => {
    if (user) fetchSessions();
  };

  const filteredSessions = sessions.filter((session) =>
    session.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedSessions = filteredSessions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "var(--text-primary)" }}
        >
          Analysis Sessions
        </Typography>
        <IconButton
          sx={{ color: "var(--text-secondary)" }}
          onClick={handleRefresh}
          disabled={isSessionsLoading}
        >
          <Refresh className={isSessionsLoading ? "animate-spin" : ""} />
        </IconButton>
      </Box>

      <Card
        className="p-4 bg-gray-200 dark:bg-neutral-800"
        style={{
          borderColor: "var(--card-border)",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-300 border-gray-400 text-gray-800 hover:bg-gray-300/80 dark:border-neutral-700 dark:text-neutral-300"
          >
            All Sessions
          </Button>

          <TextField
            size="small"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    sx={{ color: "var(--text-secondary)", fontSize: 20 }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 250,
              "& .MuiOutlinedInput-root": {
                bgcolor: "rgb(209 213 219)", // gray-300
                color: "var(--text-primary)",
                "& fieldset": { borderColor: "rgb(156 163 175)" }, // gray-400
                "&:hover fieldset": { borderColor: "var(--text-secondary)" },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--primary-main)",
                },
              },
              "& .MuiInputBase-input": {
                fontSize: "0.95rem",
                color: "var(--text-primary)",
              },
            }}
          />
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            bgcolor: "rgb(229 231 235)", // gray-200
            boxShadow: "none",
            border: 1,
            borderColor: "rgb(156 163 175)", // gray-400
            borderRadius: 2,
            width: "99%", // Prevent horizontal scroll on hover scale
            mx: "auto",
            overflowX: "hidden", // Hide potential overflow
          }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow
                sx={{
                  height: "45px", // Explicit height match
                  bgcolor: "rgb(209 213 219)", // gray-300
                  "& th": {
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "#1f2937", // gray-800
                    borderBottom: "1px solid rgb(156 163 175)", // gray-400
                    py: 1, // Compact header
                  },
                }}
              >
                <TableCell>Session Name</TableCell>
                <TableCell>Files Analyzed</TableCell>
                <TableCell align="center">API Analysis</TableCell>
                <TableCell align="center">Visualization</TableCell>
                <TableCell align="center">Heatmap</TableCell>
                <TableCell align="center">Code Health</TableCell>
                <TableCell align="center">Relationship Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isSessionsLoading ? (
                Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index} sx={{ height: "45px" }}>
                    <TableCell>
                      <Skeleton animation="wave" width="80%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" width="60%" />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={60}
                        height={24}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={60}
                        height={24}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={60}
                        height={24}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={60}
                        height={24}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={60}
                        height={24}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton animation="wave" width={40} />
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedSessions.length > 0 ? (
                paginatedSessions.map((session) => (
                  <TableRow
                    key={session.id}
                    sx={{
                      height: "45px", // Explicit height match
                      bgcolor: "rgb(243, 244, 246)",
                      cursor: "pointer",
                      transition: "all 0.1s ease-in-out",
                      "&:hover": {
                        bgcolor: "rgba(243, 244, 246, 0.1) !important",
                      },
                      borderBottom: "1px solid rgb(209 213 219)", // gray-300
                      "&:last-child td, &:last-child th": { border: 0 },
                      "& td": {
                        fontSize: "0.9rem",
                        py: 1, // Compact row
                        borderColor: "rgb(156 163 175)", // gray-400
                        color: "var(--text-primary)",
                      },
                    }}
                    onClick={() => handleViewResults(session.id)}
                  >
                    <TableCell>
                      <Typography
                        sx={{ fontWeight: 500, color: "var(--text-primary)" }}
                      >
                        {session.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "var(--text-secondary)" }}
                      >
                        {session.created_at}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{ color: "var(--text-secondary)", maxWidth: 200 }}
                    >
                      <Typography
                        noWrap
                        sx={{
                          fontSize: "0.9rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {session.files_analyzed || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={session.api_analysis_status || "N/A"}
                        size="small"
                        sx={{
                          ...getStatusChipColor(session.api_analysis_status),
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={session.visualization_status || "N/A"}
                        size="small"
                        sx={{
                          ...getStatusChipColor(session.visualization_status),
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={session.heatmap_status || "N/A"}
                        size="small"
                        sx={{
                          ...getStatusChipColor(session.heatmap_status),
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={session.code_health_status || "N/A"}
                        size="small"
                        sx={{
                          ...getStatusChipColor(session.code_health_status),
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={session.relationship_status || "N/A"}
                        size="small"
                        sx={{
                          ...getStatusChipColor(
                            session.relationship_status || "N/A",
                          ),
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 0.5,
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{
                            color: "var(--primary-main)",
                            "&:hover": { color: "#3730a3" }, // darker indigo on hover
                          }}
                        >
                          <Visibility fontSize="medium" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleDeleteClick(session.id, e)}
                          sx={{
                            color: "var(--danger-main)",
                            "&:hover": { color: "#dc2626" }, // darker red on hover
                          }}
                        >
                          <Delete fontSize="medium" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 8,
                        gap: 1.5,
                      }}
                    >
                      <div className="bg-gray-300 p-4 rounded-full mb-1">
                        <SearchOff
                          sx={{ fontSize: 32, color: "var(--text-secondary)" }}
                        />
                      </div>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        No sessions found
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "var(--text-secondary)" }}
                      >
                        {searchTerm
                          ? `No results matching "${searchTerm}"`
                          : "Get started by uploading your first project."}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredSessions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{
            borderTop: 1,
            borderColor: "rgb(156 163 175)", // gray-400
            color: "var(--text-secondary)",
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
            },
            "& .MuiTablePagination-select": {
              color: "var(--text-primary)",
            },
            "& .MuiIconButton-root": {
              color: "var(--text-secondary)",
              "&.Mui-disabled": {
                color: "rgb(156 163 175)", // gray-400
              },
            },
          }}
        />
      </Card>

      {/* Delete Confirmation Snackbar */}
      <Snackbar
        open={confirmSnackbarOpen}
        onClose={handleCancelDelete}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="warning"
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            alignItems: "center",
            "& .MuiAlert-message": {
              display: "flex",
              alignItems: "center",
              gap: 2,
            },
          }}
          action={
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelDelete}
                className="text-white hover:bg-white/20"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={activeDelete}
                className="bg-red-700 hover:bg-red-800 text-white border-0"
              >
                Delete
              </Button>
            </Box>
          }
        >
          Are you sure you want to delete this session?
        </Alert>
      </Snackbar>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
