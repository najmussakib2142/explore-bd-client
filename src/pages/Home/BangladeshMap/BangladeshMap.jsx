import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

export default function BangladeshMap() {
  const regions = [
    { name: "Dhaka Division", coords: [23.8103, 90.4125] },
    { name: "Chittagong Division", coords: [22.3569, 91.7832] },
    { name: "Sylhet Division", coords: [24.8949, 91.8687] },
    { name: "Rajshahi Division", coords: [24.3745, 88.6042] },
    { name: "Khulna Division", coords: [22.8456, 89.5403] },
    { name: "Barishal Division", coords: [22.7010, 90.3535] },
    { name: "Rangpur Division", coords: [25.7461, 89.2752] },
    { name: "Mymensingh Division", coords: [24.7471, 90.4203] },
  ];

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-semibold mb-6">Explore Bangladesh by Region</h2>
        <p className="text-gray-600 mb-6">
          Click on a marker to learn more about each division.
        </p>

        <MapContainer
          center={[23.685, 90.3563]} // Center of Bangladesh
          zoom={7}
          scrollWheelZoom={false}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
          />

          {regions.map((region) => (
            <Marker key={region.name} position={region.coords}>
              <Popup>
                <strong>{region.name}</strong>
                <p>Discover attractions, culture, and cuisine here!</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
