import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    background: {
      default: "#5ea4f8",
    },
    text: {
        primary: "#000000",
      },
  },
  typography: {
    color: "black",
    fontFamily: ['"Merriweather Sans"', "Josefin Sans"].join(","),
  },
  button: {
    color: "black",
    fontFamily: ['"Josefin Sans"', "Merriweather Sans"].join(","),
  },
});

export const darkTheme = createMuiTheme({
  palette: {
    background: {
      default: "#222222",
    },
    text: {
      primary: "#616771",
    },
  },
  typography: {
      h4:{
          color: "black"
      },
      subtitle2:{
          color: "grey"
      },
      subtitle1:{
          color: "black"
      },
      h6:{
          color: "black"
      },
    fontFamily: ['"Merriweather Sans"', "Josefin Sans"].join(","),
  },
  button: {
    fontFamily: ['"Josefin Sans"', "Merriweather Sans"].join(","),
  },
});

export default theme;
