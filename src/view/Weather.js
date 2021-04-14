import React, { useEffect, useState } from "react";
import {
  TextField,
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Avatar,
  Container,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { useLocation } from "react-router-dom";
import {
  usePersistentState,
  capitalizeFirstLetter,
  ApiKey,
} from "../utils/helpers";
import WbSunnyIcon from "@material-ui/icons/WbSunny";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    marginTop: "4rem",
    display: "flex",
    flexDirection: "column",
  },
  inputMenu: {
    justifyContent: "center",
    display: "flex",
    marginBottom: "3rem",

    "& .MuiAutocomplete-root": {
      minWidth: "100%",
      [theme.breakpoints.down("sm")]: {
        minWidth: "200px",
      },
    },
  },
  cityHolder: {
    marginRight: "1.5rem",
  },
  inputBar: {
    background: "white",

    "& .MuiAutocomplete-option": {
      background: "blue",
    },
  },
  paper: {
    height: 200,
    width: 200,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    border: "1px solid grey",
  },
  degreeHeadline: {
    alignSelf: "center",
    marginBottom: "10%",
    fontSize: "2rem",
  },
  daysHeadline: {
    marginTop: "3%",
  },
  loaderWrapper: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    padding: 0,
  },
  loader: {
    alignSelf: "center",
    marginBottom: "2rem",
    marginTop: "2rem",
  },
}));

const Weather = () => {
  const classes = useStyles();
  const [inputCityList, setInputCityList] = useState([]);
  const location = useLocation();
  const [chosenCity, setChosenCity] = useState(
    location?.state?.selectedCity
      ? location.state.selectedCity
      : {
          cityName: "Tel Aviv",
          cityKey: "215854",
        }
  );
  const [fiveDayForecast, setFiveDayForecast] = useState([]);
  const [favorite, setFavorite] = usePersistentState("favoriteList", []);
  const [favoriteToggle, setFavoriteToggle] = useState(false);
  const [tempToggle, setTempToggle] = useState(false);
  const [forecastFetchToggle, setForecastFetchToggle] = useState(false);

  // fething the 5 days forecast
  useEffect(() => {
    async function fetchMyAPI() {
      let response = await fetch(
        `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${chosenCity.cityKey}?apikey=${ApiKey}&details=true`
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.DailyForecasts.length > 0) {
            setFiveDayForecast(res);
            setForecastFetchToggle(true);
          }
        })
        .catch((e) => console.error("err with forecast fetch", e));
    }
    fetchMyAPI();
  }, []);
  // checking if chosenCity changed and fetching 5 days forecast
  useEffect(() => {
    async function fetchMyAPI() {
      let response = await fetch(
        `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${chosenCity.cityKey}?apikey=${ApiKey}&details=true`
      )
        .then((res) => res.json())
        .then((res) => setFiveDayForecast(res))
        .catch((e) => console.error("err with forecast fetch", e));
    }
    fetchMyAPI();
  }, [chosenCity.cityKey]);
  const inputLocationSelector = (e, value) => {
    if (value.AdministrativeArea !== null) {
      setChosenCity({
        cityName: value.AdministrativeArea.LocalizedName,
        cityKey: value.Key,
      });
    }
    if (favorite.filter((i) => i.cityKey === value.Key).length > 0) {
      setFavoriteToggle(true);
    } else {
      setFavoriteToggle(false);
    }
  };
  // after click on favorite button
  const favoriteToggler = (e, value) => {
    if (favorite.filter((i) => i.cityKey === chosenCity.cityKey).length > 0) {
      setFavorite(favorite.filter((i) => i.cityKey !== chosenCity.cityKey));
      setFavoriteToggle(false);
    } else {
      setFavoriteToggle(true);
      setFavorite([...favorite, chosenCity]);
    }
  };
  const inputAutoComplete = (e) => {
    if (e.target.value.length > 1) {
      let response = fetch(
        `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${ApiKey}&q=${e.target.value}`
      )
        .then((response) => response.json())
        .then((response) => setInputCityList(response))
        .catch((e) => console.error("Error with autocomplete fetch", e));
    }
  };

  // temprature function toggle
  const tempChanger = () => {
    setTempToggle(!tempToggle);
  };

  return (
    <>
      {forecastFetchToggle ? (
        <Box className={classes.container}>
          <Grid container spacing={0} className={classes.inputMenu}>
            <Grid item xs={12} md={2}>
              <Typography variant="h5" align="left">
                {chosenCity.cityName}
              </Typography>
              <Typography variant="h5" align="left">
                {`
  ${
    tempToggle
      ? `${fiveDayForecast.DailyForecasts[0].Temperature.Maximum.Value} °${fiveDayForecast.DailyForecasts[0].Temperature.Maximum.Unit}`
      : `${Math.round(
          (fiveDayForecast.DailyForecasts[0].Temperature.Maximum.Value - 32) *
            0.5555555555
        )} °C`
  }
 `}
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Autocomplete
                id="combo-box-demo"
                options={inputCityList}
                getOptionLabel={(option) =>
                  option.AdministrativeArea.LocalizedName
                }
                onChange={inputLocationSelector}
                className={classes.inputBar}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Find you city"
                    variant="outlined"
                    onChange={inputAutoComplete}
                    onKeyUp={inputAutoComplete}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button onClick={favoriteToggler}>
                <FavoriteIcon style={{ color: "red", marginRight: "1px" }} />
                <Typography variant="subtitle2">
                  {favoriteToggle ? "Remove" : "Add"}
                </Typography>
              </Button>
              <Button onClick={tempChanger}>
                <WbSunnyIcon style={{ color: "orange", marginRight: "2px" }} />
                <Typography variant="subtitle2">
                  {tempToggle ? "°F" : "°C"}
                </Typography>
              </Button>
            </Grid>
          </Grid>
          <Typography variant="h2" align="center">
            {capitalizeFirstLetter(fiveDayForecast.Headline.Category)}
          </Typography>
          <Grid container justify="center" spacing={2}>
            {fiveDayForecast.DailyForecasts.map((day, key) => (
              <Grid item key={key}>
                <Paper className={classes.paper} elevation={3}>
                  <Typography
                    className={classes.daysHeadline}
                    variant="h4"
                    align="center"
                  >
                    {moment(day.Date).format("ddd")}
                  </Typography>
                  <Avatar
                    style={{ alignSelf: "center" }}
                    alt={day.Day.IconPharse}
                    src={
                      day.Day.Icon > 10
                        ? `/icons/${day.Day.Icon}.png`
                        : `/icons/0${day.Day.Icon}.png`
                    }
                  />
                  <Typography
                    className={classes.degreeHeadline}
                    variant="subtitle2"
                  >
                    {tempToggle
                      ? `${day.Temperature.Maximum.Value} °${day.Temperature.Maximum.Unit}`
                      : `${Math.round(
                          (day.Temperature.Maximum.Value - 32) * 0.5555555555
                        )} °C`}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Container className={classes.loaderWrapper}>
          <Typography variant="h5" align="center">
            Please check your ApiKey inside /src/utils/helpers.js.
          </Typography>
          <CircularProgress className={classes.loader} />
        </Container>
      )}
    </>
  );
};

export default Weather;
