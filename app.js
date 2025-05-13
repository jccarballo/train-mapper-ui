const CURRENT_POSITION = [43.184419, -2.47135]; // Eibar
const TILE_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_LAYER_ATTRIBUTION = "&copy; OpenStreetMap contributors";

const calculateDistance = (a, b) =>
  Math.hypot(a[0] - b[0], a[1] - b[1]);

const findClosestPointIndex = (route, currentPos) =>
  route.reduce((closestIdx, coord, i) =>
    calculateDistance(coord, currentPos) < calculateDistance(route[closestIdx], currentPos)
      ? i : closestIdx, 0);

const createCircleMarker = (coord, label) =>
  L.circleMarker(coord, {
    radius: 5,
    fillColor: "blue",
    color: "darkblue",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.9
  }).bindPopup(label);

const addCurrentPositionMarker = (map) =>
  L.marker(CURRENT_POSITION, {
    icon: L.divIcon({
      className: "",
      html: `<div class="pulse-marker"></div>`,
      iconSize: [10, 10],
      iconAnchor: [10, 10],
    })
  }).addTo(map).bindPopup("🚆 Posición actual del tren");

const renderRoutesOnMap = (mapId, routes) => {
  const map = L.map(mapId);
  const allCoords = [];

  routes.forEach(({ coords, names }) => {
    if (!coords.length) return;

    allCoords.push(...coords);

    const closestIndex = findClosestPointIndex(coords, CURRENT_POSITION);
    const completed = coords.slice(0, closestIndex + 1);
    const pending = coords.slice(closestIndex);

    L.polyline(completed, { color: "gray", weight: 5 }).addTo(map);
    L.polyline(pending, { color: "green", weight: 5 }).addTo(map);

    coords.forEach((coord, i) => createCircleMarker(coord, names[i]).addTo(map));

    L.marker(coords[0]).addTo(map).bindPopup(`Origen: ${names[0]}`);
    L.marker(coords.at(-1)).addTo(map).bindPopup(`Destino: ${names.at(-1)}`);
  });

  addCurrentPositionMarker(map);

  L.tileLayer(TILE_LAYER_URL, { attribution: TILE_LAYER_ATTRIBUTION }).addTo(map);
  map.fitBounds(allCoords);
};

const drawRouteDiagram = async () => {
  const response = await fetch("/routes/bilbao-donosti.json");
  const stations = await response.json();

  const CURRENT_STATION = "Eibar";
  const currentIndex = stations.findIndex(s => s.name === CURRENT_STATION);

  const svg = d3.select("#route-diagram");
  svg.selectAll("*").remove();

  const WIDTH = 1024, PADDING_X = 40, OFFSET_Y = 50, RADIUS = 12;
  const SPACING = (WIDTH - 2 * PADDING_X) / (stations.length - 1);

  // Líneas
  svg.selectAll("line")
    .data(stations.slice(0, -1))
    .enter().append("line")
    .attr("x1", (_, i) => PADDING_X + i * SPACING)
    .attr("y1", OFFSET_Y)
    .attr("x2", (_, i) => PADDING_X + (i + 1) * SPACING)
    .attr("y2", OFFSET_Y)
    .attr("stroke", (_, i) => i < currentIndex ? "#CCCCCC" : "#66bb66")
    .attr("stroke-width", 5);

  // Círculos
  svg.selectAll("circle")
    .data(stations)
    .enter().append("circle")
    .attr("cx", (_, i) => PADDING_X + i * SPACING)
    .attr("cy", OFFSET_Y)
    .attr("r", RADIUS)
    .attr("fill", (_, i) => i <= currentIndex ? "#999999" : "#66bb66")
    .attr("stroke", (_, i) => i <= currentIndex ? "black" : "green")
    .attr("stroke-width", 2);

  // Nombres
  svg.selectAll("text")
    .data(stations)
    .enter().append("text")
    .attr("x", (_, i) => PADDING_X + i * SPACING)
    .attr("y", OFFSET_Y + 30)
    .attr("transform", (_, i) => `rotate(-90, ${PADDING_X + i * SPACING}, ${OFFSET_Y + 30})`)
    .attr("text-anchor", "end")
    .attr("font-size", "12px")
    .attr("font-family", "Arial")
    .text(d => d.name);
};

const loadRoutes = async () => {
  try {
    const routeList = await fetch("routes/index.json").then(res => res.json());
    const routes = await Promise.all(routeList.map(async file => {
      const data = await fetch(`routes/${file}`).then(res => res.json());
      return {
        coords: data.map(p => [p.x, p.y]),
        names: data.map(p => p.name)
      };
    }));
    renderRoutesOnMap("route-map", routes);
  } catch (err) {
    console.error("Error loading routes:", err);
  }
};

const updateRouteInfo = ({ service, departureTime, destination, arrivalTime, nextStation }) => {
  const container = document.getElementById("route-info");
  container.innerHTML = `
    <span><strong>Service:</strong> ${service}</span>
    <span><strong>Departure time:</strong> ${departureTime}</span>
    <span><strong>Destination:</strong> ${destination}</span>
    <span><strong>Arrival Time:</strong> ${arrivalTime}</span>
    <span><strong>NextStation:</strong> ${nextStation}</span>
  `;
};

window.addEventListener("load", () => {
  loadRoutes();

  const routeData = {
    service: "E102",
    departureTime: "10:35",
    destination: "Donosti / San Sebastián",
    arrivalTime: "12:18",
    nextStation: "Elgoibar"
  };

  updateRouteInfo(routeData);

  drawRouteDiagram();
});

