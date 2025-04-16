

// const findClosestPointIndex = (route, currentPosition) => {
//   let minDistance = Infinity;
//   let closestIndex = 0;

//   for (let i = 0; i < route.length; i++) {
//     const dist = Math.sqrt(
//       Math.pow(route[i][0] - currentPosition[0], 2) +
//       Math.pow(route[i][1] - currentPosition[1], 2)
//     );
//     if (dist < minDistance) {
//       minDistance = dist;
//       closestIndex = i;
//     }
//   }
//   return closestIndex;
// };

// const renderTrainRoute = (mapId, fullRouteCoords, stationNames, currentPosition) => {
//   const map = L.map(mapId);
//   map.fitBounds(fullRouteCoords);

//   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "&copy; OpenStreetMap contributors",
//   }).addTo(map);

//   const closestIndex = findClosestPointIndex(fullRouteCoords, currentPosition);
//   const completedRoute = fullRouteCoords.slice(0, closestIndex + 1);
//   const pendingRoute = fullRouteCoords.slice(closestIndex);

//   L.polyline(completedRoute, { color: "green", weight: 5 }).addTo(map);
//   L.polyline(pendingRoute, {
//     color: "gray",
//     weight: 5,
//     dashArray: "5, 10",
//   }).addTo(map);

//   fullRouteCoords.forEach((coord, index) => {
//     L.circleMarker(coord, {
//       radius: 5,
//       fillColor: "blue",
//       color: "darkblue",
//       weight: 1,
//       opacity: 1,
//       fillOpacity: 0.9,
//     })
//       .addTo(map)
//       .bindPopup(stationNames[index]);
//   });

//   L.marker(currentPosition, {
//     icon: L.divIcon({
//       className: "",
//       html: `<div class="pulse-marker"></div>`,
//       iconSize: [10, 10],
//       iconAnchor: [10, 10],
//     }),
//   })
//     .addTo(map)
//     .bindPopup("🚆 Posición actual del tren");

//   L.marker(fullRouteCoords[0]).addTo(map).bindPopup("Origen: " + stationNames[0]);
//   L.marker(fullRouteCoords[fullRouteCoords.length - 1])
//     .addTo(map)
//     .bindPopup("Destino: " + stationNames[stationNames.length - 1]);
// };

// window.addEventListener("load", () => {
//   fetch("routes/bilbao-donosti.json")
//     .then(response => response.json())
//     .then(data => {
//       const coords = data.map(p => [p.x, p.y]);
//       const names = data.map(p => p.name);
//       renderTrainRoute("train-map", coords, names, currentPosition);
//     })
//     .catch(error => {
//       console.error("Error al cargar el JSON de ruta:", error);
//     });
// });

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
    L.polyline(completedRoute, { color: "green", weight: 5 }).addTo(map);
    L.polyline(pendingRoute, {
      color: "gray",
      weight: 5,
      dashArray: "5, 10"
    }).addTo(map);

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
});
