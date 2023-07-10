import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import { useDebounce } from "use-debounce";
import axios from "axios";
import moment from "moment";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export function SearchPage() {
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [owner, setOwner] = useState("");
  const [sortModel, setSortModel] = useState([]);
  const [debouncedSearch] = useDebounce(search, 1500);
  const [debouncedLanguage] = useDebounce(language, 1500);
  const [debouncedOwner] = useDebounce(owner, 1500);

  const columns = [
    { field: "name", headerName: "Name", flex: 2 },
    { field: "description", headerName: "Description", flex: 3 },
    { field: "owner", headerName: "User", flex: 2 },
    // { field: 'language', headerName: 'Language', flex: 1 },
    { field: "created_at", headerName: "Created", flex: 2, renderCell: (params) => moment(params.row.created_at).format("YYYY-MM-DD HH:mm:SS") },
    { field: "updated_at", headerName: "Last Updated", flex: 2, renderCell: (params) => moment(params.row.updated_at).format("YYYY-MM-DD HH:mm:SS") },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        return (
          <Button variant="contained" color="primary" onClick={() => handleViewClick(params)}>
            View
          </Button>
        );
      },
    },
  ];

  const fetchRepos = (intervalCall) => {
    const language = debouncedLanguage != "" ? `+language:${debouncedLanguage}` : "";
    const user = debouncedOwner != "" ? `+user:${debouncedOwner}` : "";
    const sort = sortModel && sortModel.length > 0 ? `&sort=${sortModel[0].field}&order=${sortModel[0].sort}` : "";
    const q_str = `${debouncedSearch}+in:name${language}${user}${sort}&page=${page + 1}&per_page=${pageSize}`;
    console.log(q_str);
    const url = `https://api.github.com/search/repositories?q=${q_str}`;
    axios
      .get(url)
      .then((response) => {
        setRepos(response.data.items.map((item) => ({ ...item, owner: item.owner.login })));
        setTotal(response.data.total_count);
        setLoading(false);
        clearInterval(intervalCall);
      })
      .catch((error) => {
        console.error(error);
        setLoading(true);
      });
  };

  useEffect(() => {
    if (debouncedSearch !== "") {
      setLoading(true);
      const intervalCall = setInterval(() => {
        fetchRepos(intervalCall);
      }, 8000);
      fetchRepos();
      return () => clearInterval(intervalCall);
    } else {
      setLoading(false);
      setRepos([]);
      setTotal(0);
    }
  }, [debouncedSearch, debouncedLanguage, debouncedOwner, sortModel, page]);

  const handleSortModelChange = (params) => {
    setSortModel(params);
  };

  function handleViewClick(params) {
    navigate(`/details/${params.id}`);
  }

  const handlePageChange = (params) => {
    setPage(params.page);
    setPageSize(params.pageSize);
  };

  return (
    <Box
      sx={style.BoxStyle}
    >
      <Typography variant="h4" gutterBottom>
        Github Repository Search
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // minHeight: '100vh',
          flexDirection: "row",
        }}
      >
        <TextField label="Search by name" variant="outlined" size="small" value={search} onChange={(event) => setSearch(event.target.value)} />
        <TextField label="Search by language" variant="outlined" size="small" value={language} onChange={(event) => setLanguage(event.target.value)} />
        <TextField label="Search by User" variant="outlined" size="small" value={owner} onChange={(event) => setOwner(event.target.value)} />
      </Box>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid loading={loading} rows={repos} columns={columns} rowCount={total} paginationModel={{ page, pageSize }} onPaginationModelChange={handlePageChange} paginationMode="server" sortingMode="server" sortModel={sortModel} onSortModelChange={handleSortModelChange} disableColumnFilter={true} />
      </div>
    </Box>
  );
}

const style = {
  BoxStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    flexDirection: "column",
  }
}