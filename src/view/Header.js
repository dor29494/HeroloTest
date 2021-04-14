import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Container,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { Favorite, Home } from "@material-ui/icons";
import Brightness4Icon from "@material-ui/icons/Brightness4";
// CSS STYLES

const Header = ({ setLight, light }) => {
  return (
    <>
      <Box component="nav">
        <AppBar
          position="static"
          style={{ background: light ? "#E9EBEE" : "#202020" }}
        >
          <Container>
            <Toolbar>
              <IconButton component={Link} to="/favorite">
                <Favorite style={{ color: light ? "black" : "white" }} />
                <Typography variant="subtitle2">Favorite</Typography>
              </IconButton>
              <IconButton component={Link} to="/">
                <Home style={{ color: light ? "black" : "white" }} />
                <Typography variant="subtitle2">Home</Typography>
              </IconButton>
              <IconButton onClick={() => setLight(!light)}>
                <Brightness4Icon style={{ color: light ? "black" : "white" }} />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
    </>
  );
};

export default Header;
