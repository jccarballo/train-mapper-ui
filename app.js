const currentPosition = [43.184419, -2.47135]; // Ejemplo: Eibar
const allCoords = [];

const findClosestPointIndex = (route, currentPosition) => {
  let minDistance = Infinity;
  let closestIndex = 0;

  for (let i = 0; i < route.length; i++) {
    const dist = Math.sqrt(
      Math.pow(route[i][0] - currentPosition[0], 2) +
      Math.pow(route[i][1] - currentPosition[1], 2)
    );
    if (dist < minDistance) {
      minDistance = dist;
      closestIndex = i;
    }
  }
  return closestIndex;
};

const renderRoutesOnSingleMap = (mapId, routes) => {
  const map = L.map(mapId);
  let bounds = [];

  routes.forEach(({ coords, names }) => {
    if (coords.length === 0) return;

    // Añadir a los límites totales
    bounds = bounds.concat(coords);

    const closestIndex = findClosestPointIndex(coords, currentPosition);
    const completedRoute = coords.slice(0, closestIndex + 1);
    const pendingRoute = coords.slice(closestIndex);

    // Rutas completas y pendientes
    L.polyline(completedRoute, { color: "gray", weight: 5 }).addTo(map);
    L.polyline(pendingRoute, { color: "green", weight: 5 }).addTo(map);

    // Marcadores de estaciones
    coords.forEach((coord, i) => {
      L.circleMarker(coord, {
        radius: 5,
        fillColor: "blue",
        color: "darkblue",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
      })
        .addTo(map)
        .bindPopup(names[i]);
    });

    // Origen y destino
    L.marker(coords[0]).addTo(map).bindPopup("Origen: " + names[0]);
    L.marker(coords[coords.length - 1]).addTo(map).bindPopup("Destino: " + names[names.length - 1]);
  });

  // Posición actual del tren
  L.marker(currentPosition, {
    icon: L.divIcon({
      className: "",
      html: `<div class="pulse-marker"></div>`,
      iconSize: [10, 10],
      iconAnchor: [10, 10],
    }),
  })
    .addTo(map)
    .bindPopup("🚆 Posición actual del tren");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // Ajustar el mapa para mostrar todos los puntos
  map.fitBounds(bounds);
};

const drawDiagram = () => {
  const stations = [
    { name: "Connolly Station", color: "gray" },
    { name: "Clontarf Road", color: "gray" },
    { name: "Killester", color: "gray" },
    { name: "Harmonstown", color: "gray" },
    { name: "Raheny", color: "green" },
    { name: "Kilbarrack", color: "green" },
    { name: "Clongriffin", color: "green" }
  ];

  const svgWidth = 1024;
  const svgHeight = 200;
  const paddingHorizontal = 40;
  const paddingTop = 50;
  const circleRadius = 12;

  const usableWidth = svgWidth - 2 * paddingHorizontal;
  const spacing = usableWidth / (stations.length - 1);

  // Fijamos el eje Y a una distancia constante desde arriba
  const offsetY = paddingTop;

  const svg = d3.select("svg");

  // Dibujar líneas entre estaciones
  svg.selectAll("line")
    .data(stations.slice(0, -1))
    .enter()
    .append("line")
    .attr("x1", (d, i) => paddingHorizontal + i * spacing)
    .attr("y1", offsetY)
    .attr("x2", (d, i) => paddingHorizontal + (i + 1) * spacing)
    .attr("y2", offsetY)
    .attr("stroke", (d, i) => {
      const currentColor = stations[i].color;
      return currentColor === "gray" ? "#CCCCCC" : currentColor;
    })
    .attr("stroke-width", 5);

  // Dibujar círculos (estaciones)
  svg.selectAll("circle")
    .data(stations)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => paddingHorizontal + i * spacing)
    .attr("cy", offsetY)
    .attr("r", circleRadius)
    .attr("fill", d => {
      if (d.color === "gray") return "#999999";        // gris oscuro
      if (d.color === "green") return "#66bb66";        // verde más suave
      return d.color;
    })
    .attr("stroke", d => {
      if (d.color === "gray") return "black";           // borde negro para grises
      if (d.color === "green") return "green";          // borde igual que la línea verde
      return "none";
    })
    .attr("stroke-width", d => d.color === "gray" ? 2 : (d.color === "green" ? 2 : 0));


  // Dibujar nombres en vertical con Arial 10
  svg.selectAll("text")
    .data(stations)
    .enter()
    .append("text")
    .attr("x", (d, i) => paddingHorizontal + i * spacing)
    .attr("y", offsetY + 30)
    .attr("transform", (d, i) => `rotate(-90, ${paddingHorizontal + i * spacing}, ${offsetY + 30})`)
    .attr("text-anchor", "end")
    .attr("font-size", "12px")
    .attr("font-family", "Arial")
    .text(d => d.name);
};

window.addEventListener("load", () => {

  fetch("routes/index.json")
    .then(response => response.json())
    .then(routeFiles => {
      const fetches = routeFiles.map(file =>
        fetch(`routes/${file}`)
          .then(res => res.json())
          .then(data => ({
            coords: data.map(p => [p.x, p.y]),
            names: data.map(p => p.name)
          }))
      );

      Promise.all(fetches)
        .then(routes => {
          renderRoutesOnSingleMap("train-map", routes);
        })
        .catch(err => {
          console.error("Error loading routes:", err);
        });
    })
    .catch(error => {
      console.error("Error loading index of routes:", error);
    });

  drawDiagram();

});
