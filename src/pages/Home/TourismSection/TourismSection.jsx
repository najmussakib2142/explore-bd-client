import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useNavigate } from "react-router";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaSpinner } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import useAxios from "../../../hooks/useAxios";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";

const TourismSection = () => {
  const [packages, setPackages] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [loadingGuides, setLoadingGuides] = useState(false);
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  // const axiosSecure = useAxiosSecure()

  const fetchRandomPackages = async () => {
    try {
      setLoadingPackages(true);
      const res = await axiosInstance.get("/packages/random");
      if (Array.isArray(res.data)) setPackages(res.data);
      else setPackages([]);
    } catch (err) {
      console.error(err);
      setPackages([]);
    } finally {
      setLoadingPackages(false);
    }
  };

  

  const fetchRandomGuides = async () => {
    try {
      setLoadingGuides(true);
      const res = await axiosInstance.get("/guides/random");
      if (Array.isArray(res.data)) setGuides(res.data);
      else setGuides([]);
    } catch (err) {
      console.error(err);
      setGuides([]);
    } finally {
      setLoadingGuides(false);
    }
  };

  useEffect(() => {
    fetchRandomPackages();
    fetchRandomGuides();
    AOS.init({ duration: 1000, once: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-6xl mx-auto my-12 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Tourism & Travel Guide</h2>

      <Tabs>
        <TabList className="flex justify-center gap-4 mb-6  dark:border-b-2 dark:border-white border-b-2 border-primary">
          <Tab
            selectedClassName="bg-primary text-white dark:bg-white dark:text-black rounded-t-md"
            className="cursor-pointer py-2 px-4 text-lg font-semibold hover:text-blue-600 transition">
            Our Packages
          </Tab>
          <Tab
            selectedClassName="bg-primary text-white dark:bg-white dark:text-black rounded-t-md"
            className="cursor-pointer py-2 px-4 text-lg font-semibold hover:text-green-600 transition">
            Meet Our Tour Guides
          </Tab>
        </TabList>

        {/* Packages Tab */}
        <TabPanel>
          {loadingPackages ? (
            <div className="flex justify-center items-center py-12 text-blue-600">
              <FaSpinner className="animate-spin mr-2" />
              Loading packages...
            </div>
          ) : packages.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No packages available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-base-100 shadow-lg rounded-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-300"
                  data-aos="fade-up"
                >
                  <img
                    src={pkg.images?.[0] || "https://via.placeholder.com/300"}
                    alt={pkg.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-1">{pkg.tourType}</p>
                    <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                    <p className="text-lg font-bold mb-3">BDT {pkg.price}</p>
                    <button
                      onClick={() => navigate(`/packageDetailsPage/${pkg._id}`)}
                      className="btn btn-primary w-full"
                    >
                      View Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabPanel>

        {/* Tour Guides Tab */}
        <TabPanel>
          {loadingGuides ? (
            <div className="flex justify-center items-center py-12 text-green-600">
              <FaSpinner className="animate-spin mr-2" />
              Loading guides...
            </div>
          ) : guides.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No guides available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <div
                  key={guide._id}
                  className="bg-base-100 shadow-lg rounded-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-300"
                  data-aos="fade-up"
                >
                  <img
                    src={guide.photoURL || "https://via.placeholder.com/300"}
                    alt={guide.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-1">{guide.name}</h3>
                    <p className="text-sm text-gray-400 mb-1">Region: {guide.district}</p>
                    <p className="text-sm text-gray-400 mb-3">
                      Experience: {guide.experience || "N/A"} yrs
                    </p>
                    <button
                      onClick={() => navigate(`/guides/${guide._id}`)}
                      className="btn btn-secondary w-full"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TourismSection;
