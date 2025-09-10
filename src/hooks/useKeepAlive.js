// import { useEffect } from "react";
// import axios from "axios";

// export default function useKeepAlive() {
//     useEffect(() => {
//         const pingServer = async () => {
//             try {
//                 await axios.get("https://explore-bd-server-iota.vercel.app/health");
//                 // console.log("Keep-alive ping successful ✅");
//             } catch {
//                 // console.warn("Keep-alive failed ❌", err.message);
//             }
//         };

//         // ping every 5 minutes
//         pingServer(); // run once immediately
//         const interval = setInterval(pingServer, 5 * 60 * 1000);

//         return () => clearInterval(interval);
//     }, []);
// }
