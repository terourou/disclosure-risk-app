import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import React from "react";

type Props = {};

const MenuBar = (props: Props) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Disclosure Risk Calculator
          </Typography>
          <Button color="inherit">Home</Button>
          <Button color="inherit">About</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export { MenuBar };
