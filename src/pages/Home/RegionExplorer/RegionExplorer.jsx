// // BangladeshMap.jsx
// import React, { useEffect, useState } from "react";
// import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// export default function BangladeshMap() {
//   const [geoUrl, setGeoUrl] = useState("/maps/bd-divisions.json"); // local by default

//   useEffect(() => {
//     // Fallback: if local file not found in some environments, use raw GitHub fallback
//     // NOTE: raw URL comes from a maintained repo (ifahimreza/bangladesh-geojson)
//     const fallback = "https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/bd-divisions.json";
//     // Optionally, you could test availability and set fallback dynamically.
//     setGeoUrl((prev) => prev || fallback);
//   }, []);

//   return (
//     <section className="py-12">
//       <div className="max-w-4xl mx-auto px-4 text-center">
//         <h2 className="text-2xl font-semibold mb-4">Explore Bangladesh (Divisions)</h2>
//         <p className="text-sm text-gray-600 mb-6 max-w-xl mx-auto">
//           Static map of Bangladesh divisions. (Using a local GeoJSON for reliability.)
//         </p>

//         <div className="shadow-lg rounded-lg overflow-hidden">
//           <ComposableMap
//             projection="geoMercator"
//             projectionConfig={{
//               // tuned for Bangladesh
//               scale: 4200,
//               center: [90.5, 24.0],
//             }}
//             style={{ width: "100%", height: "auto" }}
//           >
//             <Geographies geography={geoUrl}>
//               {({ geographies }) =>
//                 geographies.map((geo) => (
//                   <Geography
//                     key={geo.rsmKey}
//                     geography={geo}
//                     fill="#E6F0FF" // light primary tone
//                     stroke="#0C63B6" // primary stroke
//                     strokeWidth={0.4}
//                     style={{
//                       default: { outline: "none" },
//                       hover: { outline: "none", fill: "#FFDDAA" }, // hover uses secondary-ish tone
//                       pressed: { outline: "none" },
//                     }}
//                   />
//                 ))
//               }
//             </Geographies>
//           </ComposableMap>
//         </div>
//       </div>
//     </section>
//   );
// }
