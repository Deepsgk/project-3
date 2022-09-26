
var layers = {
  PHYSICS: new L.LayerGroup(),
  CHEMISTRY: new L.LayerGroup(),
  LITERATURE: new L.LayerGroup(),
  PEACE: new L.LayerGroup(),
  ECONOMICS: new L.LayerGroup(),
  MEDICINE: new L.LayerGroup()

  }
  
function createMap(sites) {
  
 console.log("Create Map");
  
    // Define Variables for Tile Layers
  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });
  
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
  
  
  
    // Define baseMaps Object to Hold Base Layers
  var baseMaps = {
      "Light Map" : lightmap,
      "Satellite" : satelliteMap
    };
  
  
      // Create an overlayMaps object to hold the layer
    var overlayMaps = {
        "ALL"        : sites,
        "Physics"    : layers.PHYSICS,
        "Chemistry"  : layers.CHEMISTRY,
        "Economics"  : layers.ECONOMICS,
        "Literature" : layers.LITERATURE,
        "Peace"      : layers.PEACE,
        "Medicine"   : layers.MEDICINE
  
      };

  
  
        // Create the map object with options
      var map = L.map("map", {
        center: [
          38.8951,-77.0364,
        ],
        zoom: 3,
        layers: [
          lightmap, 
          sites      
                ]
      });
      
      
  
  
      // Create a layer control, pass in the baseMaps and overlayMaps
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(map);
  
  

  }
/*
 *
 */

// Initialize an object containing icons for each layer group
var icons = {
  PHYSICS: L.ExtraMarkers.icon({
    iconColor: "Red",
    markerColor: "yellow",
    shape: "circle"
  }),
  CHEMISTRY: L.ExtraMarkers.icon({
    iconColor: "yellow",
    markerColor: "red",
    shape: "circle"
  }),
  PEACE: L.ExtraMarkers.icon({
    iconColor: "black",
    markerColor: "blue-dark",
    shape: "circle"
  }),
  LITERATURE: L.ExtraMarkers.icon({
    iconColor: "green",
    markerColor: "orange",
    shape: "circle"
  }),
  ECONOMICS: L.ExtraMarkers.icon({
    iconColor: "orange",
    markerColor: "green",
    shape: "circle"
  }),
  MEDICINE: L.ExtraMarkers.icon({
    iconColor: "blue",
    markerColor: "green",
    shape: "circle"
  })
};




/* 
 * 
 */

d3.json("http://127.0.0.1:5000/api/v0/country").then(
data => {

  var sites = data;
  var siteMarkers = [];

  

  console.log(sites.length);
  console.log(data)


  for (var index = 0; index < sites.length; index++) {

    

      vLat        = sites[index].latitude;
      vLon        = sites[index].longitude;
      vcity       = sites[index].organizationcity;
      vcountry    = sites[index].organizationcountry;
      vmotivation = sites[index].motivation;
      vfirstname  = sites[index].firstname
      vsurname   = sites[index].surname
      vCategory   = sites[index].category
      vgender     = sites[index].gender
      vyear       = sites[index].year

      var siteMarker = L.circleMarker([vLat,vLon])
      .bindPopup("<h3>Firstname: " + vfirstname + "</h3><h3>Surname: " + vsurname + "</h3><h3>Award year: " + vyear + "</h3><h3>Gender: " + vgender +"</h3><h3>Motivation: " + vmotivation +"</h3><h3>Category: "+vCategory+"<h3>");
     
      siteMarkers.push(siteMarker);
         
          
         if (vCategory === 'Peace'){
  
          var peaceMarker = L.circleMarker([vLat,vLon],{
            icon: icons['PEACE']
          });
  
          peaceMarker.addTo(layers['PEACE']);
  
          peaceMarker.bindPopup("<h3>Firstname: " + vfirstname + "</h3><h3>Surname: " + vsurname + "</h3><h3>Award year: " + vyear + "</h3><h3>Gender: " + vgender +"</h3><h3>Motivation: " + vmotivation +"</h3><h3>Category: "+vCategory+"<h3>");
  
        } 
      else if (vCategory === 'Physics'){
  
          var physicsMarker = L.circleMarker([vLat,vLon], {
            icon: icons['PHYSICS']
          });
  
          physicsMarker.addTo(layers['PHYSICS']);
  
          physicsMarker.bindPopup("<h3>Firstname: " + vfirstname + "</h3><h3>Surname: " + vsurname + "</h3><h3>Award year: " + vyear + "</h3><h3>Gender: " + vgender +"</h3><h3>Motivation: " + vmotivation +"</h3><h3>Category: "+vCategory+"<h3>");
  
        } 
  
        else if (vCategory === 'Chemistry'){
  
          var chemMarker = L.circleMarker([vLat,vLon], {
            icon: icons['CHEMISTRY']
          });
  
          chemMarker.addTo(layers['CHEMISTRY']);
  
          chemMarker.bindPopup("<h3>Firstname: " + vfirstname + "</h3><h3>Surname: " + vsurname + "</h3><h3>Award year: " + vyear + "</h3><h3>Gender: " + vgender +"</h3><h3>Motivation: " + vmotivation +"</h3><h3>Category: "+vCategory+"<h3>");
  
        } 
  
        
        else if (vCategory === 'Literature'){
  
  
          var litMarker = L.circleMarker([vLat,vLon], {
            icon: icons['LITERATURE']
          });
  
          litMarker.addTo(layers['LITERATURE']);
  
          litMarker.bindPopup("<h3>Firstname: " + vfirstname + "</h3><h3>Surname: " + vsurname + "</h3><h3>Award year: " + vyear + "</h3><h3>Gender: " + vgender +"</h3><h3>Motivation: " + vmotivation +"</h3><h3>Category: "+vCategory+"<h3>");
  
        } 
  
              
        else if (vCategory === 'Medicine'){
  
          var medMarker = L.circleMarker([vLat,vLon], {
            icon: icons['MEDICINE']
          });
  
          medMarker.addTo(layers['MEDICINE']);
  
          medMarker.bindPopup("<h3>Firstname: " + vfirstname + "</h3><h3>Surname: " + vsurname + "</h3><h3>Award year: " + vyear + "</h3><h3>Gender: " + vgender +"</h3><h3>Motivation: " + vmotivation +"</h3><h3>Category: "+vCategory+"<h3>");
  
        } 
  
        else if (vCategory === 'Economics'){
  
          var ecoMarker = L.circleMarker([vLat,vLon], {
              icon: icons['ECONOMICS']
            });
    
          ecoMarker.addTo(layers['ECONOMICS']);
    
          ecoMarker.bindPopup("<h3>Firstname: " + vfirstname + "</h3><h3>Surname: " + vsurname + "</h3><h3>Award year: " + vyear + "</h3><h3>Gender: " + vgender +"</h3><h3>Motivation: " + vmotivation +"</h3><h3>Category: "+vCategory+"<h3>");
    
          } 
    
    
        }
   

      createMap(L.layerGroup(siteMarkers));
    
  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
}).catch(error => {
  console.log("error fetching url :", error);
});
