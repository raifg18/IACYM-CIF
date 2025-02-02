document.addEventListener("DOMContentLoaded", function() {
    // Función para convertir coordenadas de tile (x, y, z) a QuadKey (para Bing Maps)
    function tileXYToQuadKey(x, y, z) {
      let quadKey = '';
      for (let i = z; i > 0; i--) {
        let digit = 0;
        let mask = 1 << (i - 1);
        if ((x & mask) !== 0) digit++;
        if ((y & mask) !== 0) digit += 2;
        quadKey += digit.toString();
      }
      return quadKey;
    }
  
    // Extensión de L.TileLayer para Bing Maps utilizando QuadKey
    var BingLayer = L.TileLayer.extend({
      getTileUrl: function(coords) {
        var zoom = this._getZoomForUrl();
        var quadKey = tileXYToQuadKey(coords.x, coords.y, zoom);
        return L.Util.template(this._url, {q: quadKey});
      }
    });
  
    L.tileLayer.bing = function(url, options) {
      return new BingLayer(url, options);
    };
  
    // Definición de las capas base
    var googleTerrain = L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: 'Google Terrain'
    });
    var googleHybrid = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: 'Google Hybrid'
    });
    var bingMaps = L.tileLayer.bing('https://ecn.dynamic.t0.tiles.virtualearth.net/comp/CompositionHandler/{q}?mkt=ru-ru&it=G,VE,BX,L,LA&shading=hill', {
      maxZoom: 19,
      attribution: 'Bing Maps'
    });
  
    // Inicializamos el mapa centrado en Pucallpa, con Google Terrain por defecto
    var map = L.map('map', {
      center: [-8.381536, -74.570015],
      zoom: 13,
      layers: [googleTerrain]
    });
  
    // Control de capas base para alternar entre las opciones
    var baseLayers = {
      "Google Terrain": googleTerrain,
      "Google Hybrid": googleHybrid,
      "Bing Maps RU": bingMaps
    };
    L.control.layers(baseLayers).addTo(map);
  
    // Ícono personalizado: círculo pequeño sin texto
    var customIcon = L.divIcon({
      html: '<div class="custom-marker"></div>',
      className: '', // No se añaden clases extra
      iconSize: [20, 20],
      iconAnchor: [10, 20]  // Ancla en el centro inferior del círculo
    });
  
    // Definimos el array de marcadores (se puede extender para incluir más ubicaciones)
    var markers = [
      {
        name: "Célula Templanza",
        coords: [-8.381536, -74.570015],
        content: `
          <div class="popup-content">
            <h4>Célula Templanza</h4>
            <p><strong>Líder:</strong> Martin Jonhson y Cecilia Taboada</p>
            <p><strong>Dirección:</strong> Jr Alamedas - <a href="https://maps.app.goo.gl/3YNUMad8ehKxHHAo7" target="_blank">Ver en Maps</a></p>
            <p><strong>Referencia:</strong> A espaldas de Gracias y Sazón</p>
          </div>
        `
      }
    ];
  
    // Almacenamos las instancias de los marcadores
    var markerObjects = [];
  
    markers.forEach(function(markerData, index) {
      var marker = L.marker(markerData.coords, {icon: customIcon}).addTo(map);
      marker.bindPopup(markerData.content);
      markerObjects.push(marker);
    });
  
    // Creamos la leyenda en el div con id "legend"
    var legendDiv = document.getElementById("legend");
    if (legendDiv) {
      var legendHTML = '<h3>Leyenda</h3><h4>Células</h4><ul>';
      markers.forEach(function(markerData, index) {
        legendHTML += `<li data-index="${index}">${markerData.name}</li>`;
      });
      legendHTML += '</ul>';
      legendDiv.innerHTML = legendHTML;
  
      // Asignamos el evento de clic para cada elemento de la leyenda
      var legendItems = legendDiv.getElementsByTagName("li");
      for (var i = 0; i < legendItems.length; i++) {
        legendItems[i].addEventListener("click", function() {
          var index = this.getAttribute("data-index");
          var marker = markerObjects[index];
          if (marker) {
            map.setView(marker.getLatLng(), 15);
            marker.openPopup();
          }
        });
      }
    }
  });
  
  
  
  
  
  