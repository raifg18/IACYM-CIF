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

  // Íconos personalizados: rojo para las células y azul para IACYM
  var redIcon = L.divIcon({
    html: '<div class="custom-marker"></div>',
    className: '',
    iconSize: [15, 15],
    iconAnchor: [7.5, 15]
  });
  var blueIcon = L.divIcon({
    html: '<div class="custom-marker blue"></div>',
    className: '',
    iconSize: [15, 15],
    iconAnchor: [7.5, 15]
  });

  // Array de marcadores con la información de cada célula.
  // Los nombres siguen el formato "Nombre - Letra" para extraer el ID, excepto IACYM se asigna manualmente.
  var markers = [
    {
      name: "Célula Templanza - F",
      coords: [-8.382756236614052, -74.57020359646457],
      content: `
        <div class="popup-content">
          <h4>Célula Templanza</h4>
          <p><strong>Coordinadores:</strong> Martin & Cecilia Jonhson</p>
          <p><strong>Dirección:</strong> Jr Alamedas Mz. A Lt. 06</p>
          <p><strong>Referencia:</strong> A espaldas de Gracias y Sazón</p>
          <p><strong>Ubicación:</strong> <a href="https://maps.app.goo.gl/vrLo96DBVKQ9gW1T7" target="_blank">Ver en Maps</a></p>
        </div>
      `
    },
    {
      name: "Célula Mansedumbre - C",
      coords: [-8.356701, -74.574206],
      content: `
        <div class="popup-content">
          <h4>Célula Mansedumbre</h4>
          <p><strong>Coordinadores:</strong> Alirio & Natalie Cabezas</p>
          <p><strong>Dirección:</strong> Jr Miguel Grau #160</p>
          <p><strong>Referencia:</strong> Entrada principal del Hospital Amazónico</p>
          <p><strong>Ubicación:</strong> <a href="https://maps.app.goo.gl/eehCaKtWjMhS8uK57" target="_blank">Ver en Maps</a></p>
        </div>
      `
    },
    {
      name: "Célula Bondad - I",
      coords: [-8.358961, -74.603817],
      content: `
        <div class="popup-content">
          <h4>Célula Bondad</h4>
          <p><strong>Coordinadores:</strong> Nixón & Rosa Ruíz</p>
          <p><strong>Dirección:</strong> San Pablo de Tushmo - AAHH Villa Arcijeo Pasaje 1, Mz B Lt 04</p>
          <p><strong>Referencia:</strong> A Espaldas de ladrillera Escorpión - Tushmo</p>
          <p><strong>Ubicación:</strong> <a href="https://maps.app.goo.gl/v62joApmvH5a67j26" target="_blank">Ver en Maps</a></p>
        </div>
      `
    },
    {
      name: "Célula Fe - E",
      coords: [-8.377743, -74.568243],
      content: `
        <div class="popup-content">
          <h4>Célula Fe</h4>
          <p><strong>Coordinadores:</strong> Kevin & Gemima Córdova</p>
          <p><strong>Dirección:</strong> Av Universitaria Mz. E Lt. 5</p>
          <p><strong>Referencia:</strong> Frente al parque El Lagarto</p>
          <p><strong>Ubicación:</strong> <a href="https://maps.app.goo.gl/gJ7PW2YdaGbmmpk7A" target="_blank">Ver en Maps</a></p>
        </div>
      `
    },
    {
      name: "Célula Paz - D",
      coords: [-8.361776, -74.572762],
      content: `
        <div class="popup-content">
          <h4>Célula Paz</h4>
          <p><strong>Coordinadores:</strong> Maradona & Lorena Mera</p>
          <p><strong>Dirección:</strong> Jr Lobo Caño #347</p>
          <p><strong>Referencia:</strong> A media cuadra del Real Olimpia</p>
          <p><strong>Ubicación:</strong> <a href="https://maps.app.goo.gl/9EW3eF13D95YQW3o7" target="_blank">Ver en Maps</a></p>
        </div>
      `
    },
    {
      name: "Célula Amor - G",
      coords: [-8.371306, -74.560079],
      content: `
        <div class="popup-content">
          <h4>Célula Amor</h4>
          <p><strong>Coordinadores:</strong> Oldivio & Antonia Isuiza</p>
          <p><strong>Dirección:</strong> Calle Colón Mz. 167 Lt. 7</p>
          <p><strong>Referencia:</strong> Al costado de la IE. Jorge Coquis Herrera</p>
          <p><strong>Ubicación:</strong> <a href="https://maps.app.goo.gl/DMNbeKQynLU7BGwW6" target="_blank">Ver en Maps</a></p>
        </div>
      `
    },
    {
      name: "Célula Fidelidad - A",
      coords: [-8.359791, -74.579740],
      content: `
        <div class="popup-content">
          <h4>Célula Fidelidad</h4>
          <p><strong>Coordinadores:</strong> Eric & Carla Mananita</p>
          <p><strong>Dirección:</strong> Jr 2 de mayo Mz. 109 Lt. 10A</p>
          <p><strong>Referencia:</strong> A 5 cuadras de la municipalidad de Yarinacocha</p>
          <p><strong>Ubicación:</strong> <a href="https://maps.app.goo.gl/ZMHuQyCziobdx4NP9" target="_blank">Ver en Maps</a></p>
        </div>
      `
    },
    {
      name: "Célula Benignidad  - B",
      coords: [-8.371104, -74.574807],
      content: `
        <div class="popup-content">
          <h4>Célula Benignidad</h4>
          <p><strong>Coordinadores:</strong> Oldemar & Lucy Muñoz</p>
          <p><strong>Dirección:</strong> Jr Las Gaviotas Mz. 11a Lt. 07</p>
          <p><strong>Referencia:</strong> AAHH "La Juventud"</p>
          <p><strong>Ubicación:</strong> <a href="https://maps.app.goo.gl/8W92SE2spfK96ZS77" target="_blank">Ver en Maps</a></p>
        </div>
      `
    },
    {
      name: "Célula Paciencia - H",
      coords: [-8.393169, -74.583208],
      content: `
        <div class="popup-content">
          <h4>Célula Paciencia</h4>
          <p><strong>Coordinadores:</strong> Joel & Diana Pinedo</p>
          <p><strong>Dirección:</strong> Km 6.400 de la carretera Federico Basadre</p>
          <p><strong>Referencia:</strong> Al costado de la Kola Real. Ex Dorado</p>
          <p><strong>Ubicación:</strong> <a href="https://maps.app.goo.gl/8a9hqEioGjhtn7MTA" target="_blank">Ver en Maps</a></p>
        </div>
      `
    },
    {
      // Nuevo marcador para IACYM, sin tooltip.
      name: "IACYM - Yarinacocha",
      coords: [-8.359427938520353, -74.57348632740167],
      letter: "I",
      cleanName: "IACYM - Yarinacocha",
      content: `
        <div class="popup-content">
          <h4>IACYM - Yarinacocha</h4>
          <p>Te esperamos en nuestros cultos y reuniones:</p>
          <ul>
            <li>Cultos de oración: Miércoles a las 7 pm</li>
            <li>Células de integración Familiar (CIF): Jueves en las noches</li>
            <li>Reunión de adolescentes: Sábados a las 5 pm</li>
            <li>Reunión de jóvenes y jóvenes adultos: Sábados a las 7:30 pm</li>
            <li>Culto dominical: 1er servicio 8 am; 2do servicio 10 am</li>
          </ul>
          <p>¡No faltes! Eres importante para nosotros y queremos que vivas una experiencia transformadora.</p>
          <p style="font-style: italic;">"No dejemos de congregarnos, como algunos tienen por costumbre, sino animémonos unos a otros, y tanto más, cuanto veis que aquel día se acerca." - Hebreos 10:25</p>
        </div>
      `
    }
  ];

  // Extraemos la letra y el nombre limpio de cada marcador que no tenga ya estas propiedades
  markers.forEach(function(m) {
    if (!m.letter || !m.cleanName) {
      let parts = m.name.split(" - ");
      if (parts.length > 1) {
        m.letter = parts[1].trim();
        m.cleanName = parts[0].trim();
      } else {
        m.letter = "";
        m.cleanName = m.name;
      }
    }
  });

  // Ordenamos los marcadores por la letra (alfabéticamente)
  markers.sort(function(a, b) {
    return a.letter.localeCompare(b.letter);
  });

  // Creamos los marcadores en el mapa y les asignamos un tooltip permanente.
  // Usamos blueIcon para IACYM y redIcon para los demás.
  var markerObjects = [];
  markers.forEach(function(markerData, index) {
    var iconToUse = (markerData.cleanName === "IACYM - Yarinacocha") ? blueIcon : redIcon;
    var marker = L.marker(markerData.coords, {icon: iconToUse}).addTo(map);
    marker.bindPopup(markerData.content);
    // Vinculamos tooltip solo si NO es IACYM
    if (markerData.cleanName !== "IACYM - Yarinacocha") {
      marker.bindTooltip("", {
        permanent: true,
        direction: "top",
        className: "marker-label",
        offset: [0, -5]
      });
    }
    markerObjects.push(marker);
  });

  // Función para actualizar el contenido de los tooltips según el nivel de zoom
  function updateTooltips() {
    var currentZoom = map.getZoom();
    markerObjects.forEach(function(marker, i) {
      if (markers[i].cleanName !== "IACYM - Yarinacocha") {
        if (currentZoom < 15) {
          marker.setTooltipContent(markers[i].letter);
        } else {
          marker.setTooltipContent(markers[i].cleanName);
        }
      }
    });
  }
  updateTooltips();
  map.on('zoomend', updateTooltips);

  // Construimos la leyenda general (excluyendo IACYM) y mostramos "Letra - Nombre"
  var legendDiv = document.getElementById("legend");
  if (legendDiv) {
    var legendHTML = '<h3>Leyenda</h3><ul>';
    markers.filter(function(m) { return m.cleanName !== "IACYM - Yarinacocha"; })
           .forEach(function(markerData, index) {
      legendHTML += `<li data-index="${index}">${markerData.letter} - ${markerData.cleanName}</li>`;
    });
    legendHTML += '</ul>';
    legendDiv.innerHTML = legendHTML;

    var legendItems = legendDiv.getElementsByTagName("li");
    for (var i = 0; i < legendItems.length; i++) {
      legendItems[i].addEventListener("click", function() {
        var index = this.getAttribute("data-index");
        var filteredMarkers = markers.filter(function(m) { return m.cleanName !== "IACYM - Yarinacocha"; });
        var marker = markerObjects[markers.indexOf(filteredMarkers[index])];
        if (marker) {
          map.setView(marker.getLatLng(), 15);
          marker.openPopup();
        }
      });
    }
  }

  // Construimos la leyenda especial para IACYM (sin título) y sin el prefijo de letra
  var legend2Div = document.getElementById("legend2");
  if (legend2Div) {
    var iacym = markers.find(function(m) {
      return m.cleanName === "IACYM - Yarinacocha";
    });
    if (iacym) {
      legend2Div.innerHTML = `
        <div class="legend-item">
          <div class="legend-icon blue"></div>
          <div class="legend-text">${iacym.cleanName}</div>
        </div>
      `;
      // Agregamos evento de clic para la leyenda especial de IACYM
      legend2Div.querySelector(".legend-item").addEventListener("click", function() {
        var idx = markers.findIndex(function(m) {
          return m.cleanName === "IACYM - Yarinacocha";
        });
        if (idx !== -1) {
          map.setView(markerObjects[idx].getLatLng(), 15);
          markerObjects[idx].openPopup();
        }
      });
    }
  }

  // Configuramos el panel informativo expandible ("Más información")
  var infoDiv = document.getElementById("info");
  if (infoDiv) {
    // Inicia colapsado, solo muestra el header
    document.getElementById("info-header").addEventListener("click", function() {
      var content = document.getElementById("info-content");
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
});
