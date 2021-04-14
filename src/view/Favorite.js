import React, { useEffect, useState } from "react";
import { usePersistentState, ApiKey } from "../utils/helpers";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
} from "@material-ui/core";
import { makeStyles} from "@material-ui/core/styles";
import { useHistory, Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: "7rem",
  },
  paper: {
    height: 200,
    width: 200,
    display: "flex",
    flexDirection: "column",
    justifyContent: "cenetr",
    alignItems: "center",
    border: "1px solid grey",
    margin: "0,auto",
    cursor: "pointer",
    [theme.breakpoints.up("sm")]: {
      width: "200px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      padding: "2rem",
    },
  },
  loader: {
    display: "flex",
    alignSelf: "center",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  gridContainer: {
    justifyContent: "center",
  },
  message: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  paperWrapper: {
    [theme.breakpoints.up("sm")]: {
      flexWrap: "nowrap",
    },
  },
}));

const Favorite = () => {
  const classes = useStyles();
  const [favorite, setFavorite] = usePersistentState("favoriteList", []);
  const [favsArray, setfavsArray] = useState([]);
  const [pageFetchToggle, setPageFetchToggle] = useState(true);
  let history = useHistory();
  useEffect(() => {
    async function fetchMyAPI() {
      const arr = [];
      for (let city of favorite) {
        let response = await fetch(
          `https://dataservice.accuweather.com/currentconditions/v1/${city.cityKey}/?apikey=${ApiKey}`
        );
        let json = await response.json();
        arr.push(json[0]);
        setPageFetchToggle(true);
      }
      setfavsArray(arr);
    }
    fetchMyAPI();
  }, []);

  const favCitySelector = (selectedCity) => {
    history.push({
      pathname: "/",
      state: { selectedCity: selectedCity },
    });
  };

  return (
    <>
      {pageFetchToggle ? (
        <Box className={classes.wrapper}>
          <Grid container className={classes.gridContainer}>
            <Grid item xs={12} md={12} style={{ marginBottom: "3rem" }}>
              {favsArray.length > 0 ? (
                <Typography variant="h5" align="center">
                  Your Favorite Cities!
                </Typography>
              ) : (
                <Typography variant="h5" align="center">
                  Plesae Add Favorite City
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid container className={classes.paperWrapper} direction="row">
            {favsArray.map((item, key) => (
              <Grid
                item
                key={key}
                xs={12}
                sm={6}
                onClick={() => favCitySelector(favorite[key])}
              >
                <Paper className={classes.paper}>
                  <Typography variant="h6" align="center">
                    {favorite[key] ? favorite[key].cityName : null}
                  </Typography>
                  <Typography variant="subtitle2" align="center">
                    {item.Temperature
                      ? `${item.Temperature.Metric.Value} °${item.Temperature.Metric.Unit}`
                      : null}
                  </Typography>
                  <Typography variant="subtitle1" align="center">
                    {item.WeatherText}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Box className={classes.message}>
          <Typography variant="h4" align="center">
            No favorite right now.
          </Typography>
          <IconButton component={Link} to="/">
            <Typography variant="subtitle2">Back to home</Typography>
          </IconButton>
          <CircularProgress className={classes.loader} />
        </Box>
      )}
    </>
  );
};

export default Favorite;
