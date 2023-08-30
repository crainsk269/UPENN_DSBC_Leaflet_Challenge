let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

d3.json(url).then(data => {
    console.log(data);
    createFeatures(data.features);
});

function markerSize(magnitude) {
    return magnitude * 20000;
  };
  
function setColor(depth){
if (depth < 10) return "#00FF00";
else if (depth < 30) return "#ADFF2F";
else if (depth < 50) return "#FFFF00";
else if (depth < 70) return "#FFA500";
else if (depth < 90) return "#FF4500";
else return "#FF0000";
};

function createFeatures(earthquakeData) {

function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
}

var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    pointToLayer: function(feature, latlng) {

    var markers = {
        radius: markerSize(feature.properties.mag),
        fillColor: setColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.7,
        color: "black",
        stroke: true,
        weight: 0.5
    }
    return L.circle(latlng,markers);
    }
});

createMap(earthquakes);
};

function createMap(earthquakes) {

let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var myMap = L.map("map", {
    center: [
    37.09, -95.71
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
});

var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90];

    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

    for (var i = 0; i < depth.length; i++) {
    div.innerHTML +=
    '<i style="background:' + setColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap)
};
