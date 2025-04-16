# 🚆 Real-Time Train Route Visualization with Leaflet.js

This project visualizes a train route on an interactive map using [Leaflet.js](https://leafletjs.com/), highlighting the current position of the train and showing the completed and pending segments of the journey.

## 📍 Features

- Displays a full train route between stations with accurate geocoordinates.
- Shows the **real-time position** of the train (based on a fixed sample position in this version).
- Visualizes the **completed route** in green and the **remaining route** in gray dashed lines.
- Annotates each station along the route with interactive popups.
- Animated pulse icon marks the current position of the train.

## 📁 Project Structure

```
.
├── index.html
├── app.js
├── routes/
│   └── bilbao-donosti.json
└── styles.css
```

## 📦 Dependencies

- [Leaflet.js](https://leafletjs.com/) (Include via CDN)
- JSON file with route data (`routes/bilbao-donosti.json`)

## 🧠 How It Works

1. **Route Data**: A JSON file (`bilbao-donosti.json`) contains an array of points with latitude (`x`), longitude (`y`), and station name (`name`).

2. **Current Position**: Defined by the `currentPosition` constant in the script.

3. **Route Segmentation**:

   - The route is split into two parts:
     - **Completed segment**: From start to the closest point to the current position (in green).
     - **Pending segment**: From the current position to the destination (in gray dashed line).

4. **Station Markers**: Every station is marked with a circle and a popup showing the name.

5. **Train Marker**: A custom animated icon marks the current train position.

## 🗺️ Example JSON Format

```json
[
  { "x": 43.263012, "y": -2.934985, "name": "Bilbao" },
  { "x": 43.304752, "y": -2.997065, "name": "Zamudio" },
  ...
  { "x": 43.321345, "y": -1.983593, "name": "Donosti" }
]
```

## 🚀 Getting Started

1. Clone the repository or copy the files.
2. Make sure to include:
   - `Leaflet.js` and its CSS.
   - The `train.js` script in your HTML.
3. Create a `routes/bilbao-donosti.json` file with your route data.
4. Launch the app via a local server (e.g., with VS Code Live Server or `python3 -m http.server`).

## 🖼️ Screenshot

_Add a screenshot of your map here for better presentation._

## 📌 Customization

- **Update `currentPosition`** to simulate real-time changes.
- **Use a live API** to fetch the real-time position from GPS-enabled devices or services.

## 📄 License

MIT License
