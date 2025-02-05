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

  // Array de marcadores con la información de cada célula
  var markers = [
    {
      name: "Célula Templanza",
      coords: [-8.381536, -74.570015],
      content: `
        <div class="popup-content">
          <h4>Célula Templanza</h4>
          <p><strong>Coordinadores:</strong> Martin Jonhson y Cecilia Taboada</p>
          <p><strong>Dirección:</strong> Jr Alamedas</p>
          <p><strong>Referencia:</strong> A espaldas de Gracias y Sazón</p>
          <p><strong>Ubicación:</strong> <a href="https://maps.app.goo.gl/3YNUMad8ehKxHHAo7" target="_blank">Ver en Maps</a></p>
        </div>
      `
    },
    {
      name: "Célula Mansedumbre",
      coords: [-8.356701, -74.574206],
      content: `
        <div class="popup-content">
          <h4>Célula Mansedumbre</h4>
          <p><strong>Coordinadores:</strong> Alirio y Natalie Cabezas</p>
          <p><strong>Dirección:</strong> Jr Miguel Grau #160</p>
          <p><strong>Referencia:</strong> Entrada principal Hospital de Yarina</p>
          <p><strong>Ubicación:</strong> <a href="https://maps.app.goo.gl/eehCaKtWjMhS8uK57" target="_blank">Ver en Maps</a></p>
        </div>
      `
    },
    {
      name: "Célula Bondad",
      coords: [-8.358961, -74.603817],
      content: `
        <div class="popup-content">
          <h4>Célula Bondad</h4>
          <p><strong>Coordinadores:</strong> Nixon</p>
          <p><strong>Dirección:</strong> San Pablo de Tushmo AA.HH villa arcijeu Mz.B Lt. 4</p>
          <p><strong>Referencia:</strong> A espaldas de ladrillería escorpión</p>
          <p><strong>Ubicación:</strong> <a href="https://maps.app.goo.gl/v62joApmvH5a67j26" target="_blank">Ver en Maps</a></p>
        </div>
      `
    },
    {
      name: "Célula Fe",
      coords: [-8.377743, -74.568243],
      content: `
        <div class="popup-content">
          <h4>Célula Fe</h4>
          <p><strong>Coordinadores:</strong> -</p>
          <p><strong>Dirección:</strong> Av Universitaria MZ E Lt 5</p>
          <p><strong>Referencia:</strong> Frente al parque El Lagarto</p>
          <p><strong>Ubicación:</strong> <a href="https://maps.app.goo.gl/gJ7PW2YdaGbmmpk7A" target="_blank">Ver en Maps</a></p>
        </div>
      `
    },
    {
      name: "Célula Paz",
      coords: [-8.361776, -74.572762],
      content: `
        <div class="popup-content">
          <h4>Célula Paz</h4>
          <p><strong>Coordinadores:</strong> Maradona y Lorena Mera</p>
          <p><strong>Dirección:</strong> Jirón Lobo Caño 347-Yarinacocha</p>
          <p><strong>Referencia:</strong> Media cuadra del Real Olimpia</p>
          <p><strong>Ubicación:</strong> <a href="https://maps.app.goo.gl/9EW3eF13D95YQW3o7" target="_blank">Ver en Maps</a></p>
        </div>
      `
    },
    {
      name: "Célula Amor",
      coords: [-8.371306, -74.560079],
      content: `
        <div class="popup-content">
          <h4>Célula Amor</h4>
          <p><strong>Coordinadores:</strong> Oldivio</p>
          <p><strong>Dirección:</strong> Calle Colón MZ 167 Lt 7</p>
          <p><strong>Referencia:</strong> al costado de la I.E Jorge Coquis Herrera</p>
          <p><strong>Ubicación:</strong> <a href="https://maps.app.goo.gl/DMNbeKQynLU7BGwW6" target="_blank">Ver en Maps</a></p>
        </div>
      `
    },
    {
      name: "Célula Fidelidad",
      coords: [-8.358787, -74.577339],
      content: `
        <div class="popup-content">
          <h4>Célula Fidelidad</h4>
          <p><strong>Coordinadores:</strong> Eric y Carla Mananita</p>
          <p><strong>Dirección:</strong> Jr. 2 de mayo Mz 109 Lt 10A</p>
          <p><strong>Referencia:</strong> -</p>
          <p><strong>Ubicación:</strong> <a href="https://maps.app.goo.gl/8wq6PTs5a39N8HC56" target="_blank">Ver en Maps</a></p>
        </div>
      `
    },
    {
      name: "Célula Benignidad",
      coords: [-8.371104, -74.574807],
      content: `
        <div class="popup-content">
          <h4>Célula Benignidad</h4>
          <p><strong>Coordinadores:</strong> Oldemar y Lucy Muñoz</p>
          <p><strong>Dirección:</strong> Jr. Las Gaviotas Mz 11A Lt 07</p>
          <p><strong>Referencia:</strong> -</p>
          <p><strong>Ubicación:</strong> <a href="https://maps.app.goo.gl/8W92SE2spfK96ZS77" target="_blank">Ver en Maps</a></p>
        </div>
      `
    },
    {
      name: "Célula Paciencia",
      coords: [-8.393169, -74.583208],
      content: `
        <div class="popup-content">
          <h4>Célula Paciencia</h4>
          <p><strong>Coordinadores:</strong> Joel y Diana Pinedo</p>
          <p><strong>Dirección:</strong> Carretera Federico basadre 6400</p>
          <p><strong>Referencia:</strong> Ex Dorado, al costado de la Kola Real</p>
          <p><strong>Ubicación:</strong> <a href="https://maps.app.goo.gl/8a9hqEioGjhtn7MTA" target="_blank">Ver en Maps</a></p>
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

  // Creamos la leyenda en el div con id "legend" sin el subtítulo "Células"
  var legendDiv = document.getElementById("legend");
  if (legendDiv) {
    var legendHTML = '<h3>Leyenda</h3><ul>';
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
  
  
  
  
  
  
