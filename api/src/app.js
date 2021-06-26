const express = require("express");
const fetch = require("node-fetch");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

require("dotenv").config();

const middlewares = require("./middlewares");

const SCHEDULE = require("./assets/rising-schedule-2021.json");
const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

function todayLocalTime() {
  const d = new Date();
  const offset = new Date().getTimezoneOffset() * 60 * 1000;
  const n = new Date(d.getTime() - offset);
  return n;
}

async function joke() {
  const response = await fetch("https://icanhazdadjoke.com/", {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const data = await response.json();
  return data.joke;
}

async function showerthought() {
  const response = await fetch(
    "https://www.reddit.com/r/Showerthoughts/hot.json"
  );
  const data = await response.json();
  const randomPost = Math.floor(Math.random() * 25) + 1; // plus one to skip pinned posts
  return data.data.children[randomPost].data.title;
}

async function quotes() {
  const response = await fetch("https://www.reddit.com/r/quotes/hot.json");
  const data = await response.json();
  const randomPost = Math.floor(Math.random() * 25) + 1; // plus one to skip pinned posts
  return data.data.children[randomPost].data.title;
}

async function cleaners() {
  let startDate = new Date(2021, 03, 08);
  let today = todayLocalTime();
  // Thursday = 4
  let currentDay = today.getDay();
  if (currentDay === 4) {
    // it's thursday
    if (Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) % 14 == 0) {
      return "Cleaners come today!";
    } else {
      return "Cleaners come next week.";
    }
  } else if (currentDay < 4) {
    // thursday is 4 - current Days away
    let nextThursday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + (4 - currentDay)
    );
    if (
      Math.floor((nextThursday - startDate) / (1000 * 60 * 60 * 24)) % 14 ==
      0
    ) {
      return `Cleaners come in ${4 - currentDay} days.`;
    } else {
      return `Cleaners come in ${4 - currentDay + 7} days.`;
    }
  } else {
    // its friday or saturday
    if (currentDay === 5) {
      let nextThursday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 6
      );

      if (
        Math.floor((nextThursday - startDate) / (1000 * 60 * 60 * 24)) % 14 ==
        0
      ) {
        return `Cleaners come in 6 days.`;
      } else {
        return `Cleaners come in 13 days.`;
      }
    } else {
      let nextThursday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 5
      );

      if (
        Math.floor((nextThursday - startDate) / (1000 * 60 * 60 * 24)) % 14 ==
        0
      ) {
        return `Cleaners come in 5 days.`;
      } else {
        return `Cleaners come in 12 days.`;
      }
    }
  }
}

async function olympics() {
  let olympics = new Date(2021, 06, 25);
  return `Olympics start in ${dateDiffFromToday(olympics)} days. Go USWNT!!!`;
}
async function josh() {
  let josh = new Date(2022, 04, 27);
  return `${dateDiffFromToday(josh)} days till Josh's Birthday!`;
}
async function amy() {
  let josh = new Date(2022, 02, 07);
  return `${dateDiffFromToday(josh)} days till Amy's Birthday!`;
}
async function mayah() {
  let mayah = new Date(2021, 06, 08);
  return `${dateDiffFromToday(mayah)} days till Mayah's Birthday!`;
}
async function tyler() {
  let tyler = new Date(2022, 05, 07);
  return `${dateDiffFromToday(tyler)} days till Tyler's Birthday!`;
}

async function rising() {
  const today = todayLocalTime();
  const schedule = SCHEDULE.reduce((accum, game) => {
    let gameDate = new Date(game.date);
    gameDate.setUTCHours(23, 59, 0, 0);
    console.log(today);
    console.log(gameDate);
    if (gameDate >= today) {
      accum.push(game);
      return accum;
    } else {
      return accum;
    }
  }, []);

  let upcoming = schedule.slice(0, 3).map((game) => {
    if (game) {
      let location = game.location == "Home" ? "" : "At ";
      return {
        message: `${location}${game.opponent}, ${game.date.replace(
          " 2021",
          ""
        )} ${game.time}`,
      };
    }
  });

  return upcoming;
}

function dateDiffFromToday(futureDate) {
  let today = todayLocalTime();
  let days = Math.ceil((futureDate - today) / (1000 * 60 * 60 * 24));
  return days;
}

app.get("/", async (req, res) => {
  const apps = [
    joke,
    joke,
    showerthought,
    showerthought,
    cleaners,
    quotes,
    olympics,
    josh,
    amy,
    mayah,
    tyler,
    rising,
    rising,
    // rising,
  ];

  const randomChoice = Math.floor(Math.random() * apps.length);

  const results = await apps[randomChoice]();

  let message = "";
  if (typeof results === "object") {
    message = results[0].message;
  } else {
    message = results;
  }
  res.json({
    message: message,
  });
});

app.get("/rising", async (req, res) => {
  const upcoming = await rising();
  res.json(upcoming);
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
