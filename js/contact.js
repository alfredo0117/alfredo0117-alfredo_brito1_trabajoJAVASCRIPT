// Coordenadas de la empresa (Gran Vía, Madrid)
const businessCoords = [40.4201, -3.7058];
let map, userMarker, businessMarker, routeLine;

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar mapa
    map = L.map('map').setView(businessCoords, 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Marcador empresa
    businessMarker = L.marker(businessCoords).addTo(map)
        .bindPopup('TechPro Solutions<br>Calle Gran Vía 123, Madrid').openPopup();

    // Evento calcular ruta
    document.getElementById('calculate-route').addEventListener('click', function() {
        const address = document.getElementById('user-location').value.trim();
        if (address) {
            geocodeAddress(address);
        } else {
            alert('Introduce tu dirección.');
        }
    });
});

// Geocodificar dirección y mostrar ruta
function geocodeAddress(address) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', Madrid, Spain')}&limit=1`)
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                showUserMarkerAndRoute(coords, address);
            } else {
                alert('Dirección no encontrada.');
            }
        })
        .catch(() => alert('Error al buscar la dirección.'));
}

function showUserMarkerAndRoute(userCoords, address) {
    // Quitar marcador y ruta anteriores
    if (userMarker) map.removeLayer(userMarker);
    if (routeLine) map.removeLayer(routeLine);

    userMarker = L.marker(userCoords).addTo(map).bindPopup('Tu ubicación').openPopup();

    // Dibujar línea simple entre usuario y empresa
    routeLine = L.polyline([userCoords, businessCoords], {color: 'blue'}).addTo(map);

    // Ajustar vista
    map.fitBounds(L.latLngBounds([userCoords, businessCoords]).pad(0.2));

    // Mostrar info básica
    document.getElementById('route-info').innerHTML = `
        <strong>Origen:</strong> ${address}<br>
        <strong>Destino:</strong> TechPro Solutions, Gran Vía 123
    `;
}
