import React, { useState } from "react";
import Header from "./view/Header";
import Weather from "./view/Weather";
import Favorite from "./view/Favorite";
import { Switch, Route } from "react-router-dom";
import { Container, CssBaseline, MuiThemeProvider } from "@material-ui/core";
import theme,{darkTheme} from "./utils/theme";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  appContainer: { height: "100%",
    padding: 0,
   display: "flex", 
   justifyContent: "center" }
}));
function App() {
const classes = useStyles()
const [light,setLight] = useState(false)
const [cityKeyFetch,setCityKeyFetch] = useState('215854')
  return (
    <MuiThemeProvider theme={light ? theme : darkTheme}>
      <CssBaseline />
      <div className="App" style={{ height: "100vh" }}>
        <Header setLight={setLight} light={light}/>
        <Container className={classes.appContainer}
        >
          <Switch>
            <Route exact path="/">
              <Weather cityKeyFetch={cityKeyFetch} setCityKeyFetch={setCityKeyFetch}/>
            </Route>
            <Route path="/favorite">
              <Favorite cityKeyFetch={cityKeyFetch} setCityKeyFetch={setCityKeyFetch}/>
            </Route>
          </Switch>
        </Container>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
