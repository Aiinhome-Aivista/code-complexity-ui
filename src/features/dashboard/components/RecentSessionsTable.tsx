"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { commonService } from "@/services/common_apiservice";
import { useUIStore } from "@/store/uiStore";
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
  MenuItem,
  Select,
  FormControl,
  SelectChangeEvent,
  Skeleton,
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
  const [sessions, setSessions] = useState<SessionDataTableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const router = useRouter();
  const { setProjectResults, setHeatmapData } = useUIStore();
  const { user } = useAuthStore();

  const handleViewResults = async (id: number | string) => {
    try {
      const response = await commonService.getResults(id);
      if (response && response.isSuccess) {
        setProjectResults(response.data);
        
        router.push("/code-health");

        // Find the selected session to construct dynamic payload
        const selectedSession = sessions.find((s) => s.id === id);

        if (selectedSession) {
          // Fetch Heatmap Data in background with dynamic IDs
          const heatmapPayload = {
            "project_id": selectedSession.id,
            "session_id": selectedSession.session_id,
            "metric": "complexity"
          };
          
          commonService.getHeatmapData(heatmapPayload)
              .then((heatmapResponse) => {
                  if (heatmapResponse) {
                      setHeatmapData(heatmapResponse);
                  }
              })
              .catch((err) => {
                  console.error("Error fetching heatmap data:", err);
              });
        } else {
             console.warn("Could not find session details for heatmap fetch, ID:", id);
        }
      }
    } catch (error) {
      console.error("Error fetching project results:", error);
    }
  };

  const fetchSessions = async (search?: string, status?: string) => {
    if (!user) return; // Wait for user to be loaded

    try {
      setLoading(true);
      const response = await commonService.getSessionDataTable(
        user.id.toString(),
        search,
        status,
      );
      if (response?.isSuccess) {
        setSessions(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoading(false);
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
          disabled={loading}
        >
          <Refresh className={loading ? "animate-spin" : ""} />
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
                <TableCell align="right">Relationship Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
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
                    <TableCell align="right">
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={60}
                        height={24}
                      />
                    </TableCell>
                    <TableCell align="right">
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
                      bgcolor: "rgb(229 231 235)", // gray-200
                      cursor: "pointer",
                      "&:hover": { bgcolor: "rgb(209 213 219) !important" }, // gray-300
                      transition: "background-color 0.2s",
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
                        label={session.relationship_status || "N/A"}
                        size="small"
                        sx={{
                          ...getStatusChipColor(session.relationship_status),
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
                    <TableCell align="right">
                      <Chip
                        label={session.visualization_status || "N/A"}
                        size="small"
                        sx={{
                          ...getStatusChipColor(
                            session.visualization_status || "N/A",
                          ),
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 0.5,
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{
                            color: "var(--text-secondary)",
                            "&:hover": { color: "var(--primary-main)" },
                          }}
                        >
                          <Visibility fontSize="medium" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            color: "var(--text-secondary)",
                            "&:hover": { color: "var(--danger-main)" },
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
    </Box>
  );
}
