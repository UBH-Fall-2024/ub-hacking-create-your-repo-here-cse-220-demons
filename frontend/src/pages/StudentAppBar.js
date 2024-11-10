import * as React from "react";
import {
  Box,
  AppBar,
  Typography,
  Button,
  Toolbar,
  IconButton,
} from "@mui/material";

export default function StudentAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            align="center"
            variant="h6"
            fontWeight="bold"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Student Portal
          </Typography>
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
