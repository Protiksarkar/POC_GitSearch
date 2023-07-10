import React from 'react'
import { Typography, Box } from "@mui/material";

function NoMatch() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <Typography variant="h3" gutterBottom>
        Page not found
      </Typography>
      <Typography variant="body1" gutterBottom>
        The page you are looking for does not exist.
      </Typography>
    </Box>
  );
}

export default NoMatch