# FarmEasy

A small web app for keeping track of a farm day to day: chores, fields, livestock, equipment, spraying and money. It started because paper notes and spreadsheets kept getting lost. Everything runs in the browser and nothing needs installing.

Live: https://poorvi230.github.io/FarmEasy/

![screenshot](image.png)

## What's in it

**Dashboard.** Today's date, chores left and this month's net, plus local weather (temperature, wind, humidity from Open-Meteo). The spray advisor reads the wind and rain and tells you if it's a bad time to spray. There's also a spray log: pick a field, write down the product, and it saves the date and the wind speed at that moment.

**Tasks.** A chore board. Add chores with a tag (Morning, Afternoon, Evening, Urgent), tick them off, filter by status, and clear everything that's done in one go.

**Assets.**
- Machinery: log engine hours per machine and mark services. A bar shows how close each one is to its 250-hour oil change.
- Seeds and feed: stock levels with use and restock buttons. Anything at 25% or below shows up in a reorder list with how much you need, and you can copy it.
- Livestock: daily milk and egg tallies, and feeding the pigs.
- Silo and well: grain moisture and core temperature, an aeration fan toggle, and a pump test.

**Fields.** Each parcel shows crop, acreage, soil moisture and growth stage. You can move a field to its next stage, log irrigation or fertiliser, and add notes to its activity log.

**Finance.** Income and expenses with a running balance. You can delete entries and export the ledger as CSV.

**Backup and Restore** (top right) saves everything to one JSON file and loads it back. Data lives in your browser's `localStorage`, so this is how you move it to another machine or keep a copy.

## Running it

Open `index.html` in a browser. If weather or location won't load from a local file, serve the folder instead:

```bash
python3 -m http.server 8000
```

then go to `http://localhost:8000`.

## Built with

Plain HTML, CSS and JavaScript. No framework and no build step. Weather comes from the Open-Meteo API.

## Known gaps

- Data is per browser. Two devices won't share anything unless you use Backup and Restore.
- The livestock numbers and default chores are sample data.
- There are no automated tests; I checked it by hand in Chromium.

## AI use

Used to fix merge conflicts the spray log and the reorder list. used for debugging 
## License

MIT
