# MagTag Server

An express server to deliver custom JSON to end point where my MagTag can pick it up and display it.

## Usage

Copy api/src/sample.dates.json to api/src/dates.json. This json array can hold the name of a method to run. The methods must be defined in app.js and listed in the `availableFunctions` object in app.js.

## MagTag
Check out the Adafruit MagTag here: https://www.adafruit.com/magtag

## Credit
Thanks to CJ (Coding Garden) for the Express starter kit - https://github.com/w3cj/express-api-starter.git

Check out CJ at https://twitch.tv/codinggarden