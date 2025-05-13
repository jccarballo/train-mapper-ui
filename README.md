# 🚆 Real-Time Train Route Visualization with Leaflet.js

This project visualizes a train route on an interactive map using [Leaflet.js](https://leafletjs.com/), showing the current position of the train and visualizing completed and upcoming route segments in real time (simulated).

## 📍 Features

- Interactive Leaflet map showing train routes between stations.
- Simulated **real-time position** of the train (customizable).
- **Completed segment** rendered in gray; **pending segment** in green.
- Stations marked with interactive popups.
- **Animated pulse icon** indicates the current train position.
- Easy configuration of visual controls like zoom buttons.

## 📁 Project Structure

```
.
├── index.html
├── map-widget.js
├── routes/
│   ├── index.json
│   ├── bilbao-donosti.json
│   └── vitoria-zaragoza.json
├── styles.css
└── ...
```

## 📦 Dependencies

- [Leaflet.js](https://leafletjs.com/) – via CDN
- D3.js (for SVG route diagrams)
- JSON route data (`routes/*.json`)

---

## 🧠 How It Works

### 🧩 Route Data

Each route is defined in a JSON file with an array of coordinate points and station names:

```json
[
  { "x": 43.263012, "y": -2.934985, "name": "Bilbao" },
  { "x": 43.304752, "y": -2.997065, "name": "Zamudio" },
  ...
  { "x": 43.321345, "y": -1.983593, "name": "Donosti" }
]
```

### 📍 Current Position

The `CURRENT_POSITION` constant in `map-widget.js` represents the current location of the train. This can be modified or replaced with live GPS data.

### 🛤 Route Rendering Logic

- **Closest route point** to the current position is detected.
- The route is split:
  - **Completed**: From origin to current position — shown in **gray**.
  - **Pending**: From current position to destination — shown in **green**.
- Each station is:
  - Rendered as a **circle marker**.
  - Bound to a **popup** with the station name.

---

## 🔧 MapWidget: Reusable Widget for Route Rendering

The `map-widget.js` file defines a modular `MapWidget` object that encapsulates all the visualization logic. It's designed to be **reusable** and **configurable**.

### 🧩 Usage

In your HTML or JS:

```js
MapWidget.renderRoutesOnMapIn("route-map", {
  showZoomControl: false
});
```

### ⚙️ Available Options

| Option             | Type    | Default | Description                                              |
|--------------------|---------|---------|----------------------------------------------------------|
| `showZoomControl`  | boolean | `true`  | Whether to display the zoom in/out buttons on the map.   |

You can extend this pattern to support additional configuration (e.g., `theme`, `initialZoom`, `currentPosition`, etc.).

---

## 🚀 Getting Started

1. Clone the repository or download the files.
2. Ensure your HTML includes:
   - Leaflet CSS and JS (via CDN)
   - `map-widget.js` and your `app.js`
3. Create your route files inside `routes/` (see example format above).
4. Start a local server:
   ```bash
   # Example using Python
   python3 -m http.server
   ```

---

## 🖼️ Screenshot

_Add a screenshot of the application with a sample route displayed._

---

## 🧪 Advanced Customization

- **Live GPS Integration**: Replace the fixed `CURRENT_POSITION` with live GPS data from your API/device.
- **Multiple Routes**: Populate `index.json` with multiple files to load several routes dynamically.
- **Style Adjustments**: Customize line colors, marker icons, and animations via CSS or Leaflet options.

---

## 📄 License

MIT License
