import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useQuery } from "@tanstack/react-query";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import useAxios from "../../../hooks/useAxios";
import Loading from "../../shared/Loading/Loading";
import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";

// Custom marker icon (same as before)
const customIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// A small placeholder image (data URL or remote image) — replace if you want a custom placeholder
const PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D'600'%20height%3D'400'%20xmlns%3D'http%3A//www.w3.org/2000/svg'%3E%3Crect%20fill%3D'%23e5e7eb'%20width%3D'100%25'%20height%3D'100%25'/%3E%3Ctext%20x%3D'50%25'%20y%3D'50%25'%20dominant-baseline%3D'middle'%20text-anchor%3D'middle'%20fill%3D'%23999'%20font-size%3D'20'%3ENo%20Image%3C/text%3E%3C/svg%3E";

export default function BangladeshMap() {
  const axiosSecure = useAxios();
  const [geoCache, setGeoCache] = useState(() =>
    JSON.parse(localStorage.getItem("geoCache") || "{}")
  );
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["tourPackages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/packages");
      return res.data;
    },
    onError: (error) => {
      setError(`Failed to load packages: ${error.message}`);
    },
  });

  useEffect(() => {
    if (!data?.packages) return;

    const fetchCoords = async () => {
      setIsGeocodingLoading(true);
      const updated = { ...geoCache };
      const results = [];

      try {
        for (const pkg of data.packages) {
          const district = pkg.location?.trim();
          if (!district) continue;

          if (updated[district]) {
            results.push({ ...pkg, coords: updated[district] });
            continue;
          }

          // polite delay
          await new Promise((resolve) => setTimeout(resolve, 1200));

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                district + ", Bangladesh"
              )}&limit=1`,
              {
                headers: { "User-Agent": "ExploreBD/1.0", "Accept-Language": "en" },
              }
            );

            if (!res.ok) throw new Error(`Geocoding failed for ${district}`);
            const json = await res.json();
            if (json[0]) {
              const coords = [parseFloat(json[0].lat), parseFloat(json[0].lon)];
              updated[district] = coords;
              results.push({ ...pkg, coords });
            }
          } catch (err) {
            console.error(`Error geocoding ${district}:`, err);
            // continue without coords for this package
          }
        }

        setGeoCache(updated);
        localStorage.setItem("geoCache", JSON.stringify(updated));
        setLocations(results);
      } catch (err) {
        setError("Error loading map locations");
        console.error("Geocoding error:", err);
      } finally {
        setIsGeocodingLoading(false);
      }
    };

    fetchCoords();
  }, [data]);

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // helper to determine image URL from package object
  const pickImage = (pkg) => {
    // tries common fields; modify to suit your API
    if (!pkg) return null;
    if (pkg.image) return pkg.image;
    if (pkg.imageUrl) return pkg.imageUrl;
    if (Array.isArray(pkg.images) && pkg.images.length) return pkg.images[0];
    if (pkg.photos && Array.isArray(pkg.photos) && pkg.photos.length) return pkg.photos[0];
    return null;
  };

  return (
    <section className="py-20 ">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl font-sans md:text-5xl  font-extrabold text-gray-900 dark:text-white leading-tight mb-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Explore Bangladesh by Destination
        </motion.h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-15">
          Discover the top adventures and hidden gems across Bangladesh
        </p>

        {(isLoading || isGeocodingLoading) ? (
          <Loading />
        ) : (
          <MapContainer
            center={[23.685, 90.3563]}
            zoom={7}
            scrollWheelZoom={false}
            className="h-[520px] rounded-2xl shadow-xl overflow-hidden"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {locations.map(
              (location, index) =>
                location.coords && (
                  <Marker key={index} position={location.coords} icon={customIcon}>
                    <Popup
                      className="custom-popup" // custom popup class to control padding & background
                      closeButton={true}        // ensures Leaflet shows the built-in "X"
                      closeOnClick={false}      // don't close when user clicks map accidentally
                      autoPan={true}
                      offset={[0, -10]}         // small vertical offset so popup floats above marker
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.28 }}
                        className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl w-64 overflow-hidden border border-gray-100 dark:border-gray-700 relative"
                      >
                        {/* Image */}
                        <div className="h-36 w-full overflow-hidden">
                          <img
                            src={pickImage(location) || PLACEHOLDER}
                            alt={location.title || location.location || "destination image"}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = PLACEHOLDER;
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-3 text-left">
                          <div className="flex items-center gap-1 mb-1 text-sm text-primary font-semibold">
                            <FaMapMarkerAlt className="text-red-500" />
                            <span className="truncate">{location.location}</span>
                          </div>

                          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base truncate">
                            {location.title || "Untitled Tour"}
                          </h3>

                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 ">
                            {location.about ||
                              location.description?.slice(0, 120) ||
                              "No description available."}
                          </p>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                              ৳ { location.price ?? "—"}
                            </div>
                            <button
                              className="px-2 pt-1.5 pb-1 cursor-pointer rounded-md bg-primary text-white text-xs font-medium hover:bg-primary/90 transition"
                              onClick={() =>
                                window.open(`/packageDetailsPage/${location._id || ""}`, "_blank")
                              }
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </Popup>
                  </Marker>

                )
            )}
          </MapContainer>
        )}
      </div>
    </section>
  );
}
