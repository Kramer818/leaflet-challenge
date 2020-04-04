let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

function markerSize(mag) {
    return mag * 25000
}

function markerColor(mag) {
    if (mag <= 1) {
        return "#ADFF2F";
    }
    else if (mag <= 2) {
        return "#9ACD32";
    }
    else if (mag <= 3) {
        return "#FFFF00";
    }
    else if (mag <= 4) {
        return "#FFD700";
    }
    else if (mag <= 5) {
        return "#FFA500";
    }
    else {
        return "#FF0000";
    };
}

d3.json(url, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " + feature.properties.mag + "</p>")
        }, pointToLayer: function(feature, latlng) {
            return new L.circle(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.properties.mag),
                fillOpacity: 1,
                stroke: false,
            })
        }
    });
    createMap(earthquakes);
}

function createMap(earthquakes) {
    let satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>", 
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    let darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    let baseMaps = {
        "Satellite Map": satelliteMap,
        "Dark Map": darkMap
    };

    let overlayMaps = {
        Earthquakes: earthquakes
    };

    let myMap = L.map("map", {
        center: [31.578, -99.580],
        zoom: 3,
        layers: [satelliteMap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    let legend = L.control({
        position: 'bottomright'
    });

    legend.onAdd = function() {
        let div = L.DomUtil.create('div', 'info legend'),
            magnitudes = [0, 1, 2, 3, 4, 5];
        
        for (let i = 0; i < magnitudes.length; i++) {
            div.innerHTML += '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' + 
            + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>': ' + ')
        }

        return div;
    };

    legend.addTo(myMap)
}