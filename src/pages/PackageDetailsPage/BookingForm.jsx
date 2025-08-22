import { useState } from "react";
import { useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaUserCircle } from "react-icons/fa";

const BookingForm = ({ packageData, guides }) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedGuide, setSelectedGuide] = useState("");

    const handleBooking = async () => {
        // Check login
        if (!user) {
            return Swal.fire({
                icon: "warning",
                title: "Login Required",
                text: "You need to login to book this package",
                confirmButtonText: "Login",
            }).then(() => navigate("/login"));
        }

        // Validate inputs
        if (!selectedDate || !selectedGuide) {
            return Swal.fire("Missing Info", "Please select tour date and guide", "warning");
        }

        // Booking info
        const bookingData = {
            packageId: packageData._id,
            packageName: packageData.title,
            price: packageData.price,
            touristName: user.displayName,
            touristEmail: user.email,
            touristImage: user.photoURL,
            tourDate: selectedDate,
            guideName: selectedGuide,
            status: "pending",
            created_at: new Date().toISOString(),
        };

        try {
            const res = await axiosSecure.post("/bookings", bookingData);
            if (res.data.insertedId) {
                Swal.fire({
                    title: "Confirm your Booking",
                    text: "Your booking has been placed successfully!",
                    icon: "success",
                    confirmButtonText: "Go to My Bookings",
                }).then(() => navigate("/dashboard/myBookings"));
            }
        } catch (err) {
            Swal.fire("Error!", err.message || "Something went wrong", "error");
        }
    };

    return (
        <div
            className="bg-base-100 p-6 rounded-lg shadow-lg space-y-4"
            data-aos="fade-up"
        >
            <h3 className="text-xl font-semibold mb-4">Book This Package</h3>

            {user?.photoURL ? (
                <img
                    className="w-36 h-36 rounded-full object-cover dark:border dark:border-primary"
                    src={user.photoURL}
                    alt="User"
                />
            ) : (
                <FaUserCircle className="w-36 h-36 text-gray-600 dark:text-primary transition-colors" />)}
            {/* Package Info */}
            <div>
                <label className="block font-semibold">Package Name</label>
                <input
                    type="text"
                    value={packageData.title}
                    readOnly
                    className="input input-bordered w-full"
                />
            </div>

            <div>
                <label className="block font-semibold">Price</label>
                <input
                    type="text"
                    value={`BDT ${packageData.price}`}
                    readOnly
                    className="input input-bordered w-full"
                />
            </div>

            {/* Tourist Info */}
            <div>
                <label className="block font-semibold">Tourist Name</label>
                <input
                    type="text"
                    value={user?.displayName || ""}
                    readOnly
                    className="input input-bordered w-full"
                />
            </div>

            <div>
                <label className="block font-semibold">Tourist Email</label>
                <input
                    type="text"
                    value={user?.email || ""}
                    readOnly
                    className="input input-bordered w-full"
                />
            </div>

            {/* <div>
                <label className="block font-semibold">Tourist Image URL</label>
                <input
                    type="text"
                    value={user?.photoURL || ""}
                    readOnly
                    className="input input-bordered w-full"
                />
            </div> */}

            {/* Tour Date */}
            <div>
                <label className="block font-semibold">Select Tour Date</label>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    minDate={new Date(packageData.startDate)}
                    maxDate={new Date(packageData.endDate)}
                    className="input input-bordered w-full"
                    placeholderText="Choose a date"
                />
            </div>

            {/* Guide Dropdown */}
            <div>
                <label className="block font-semibold">Select Tour Guide</label>
                <select
                    value={selectedGuide}
                    onChange={(e) => setSelectedGuide(e.target.value)}
                    className="select select-bordered w-full"
                >
                    <option value="">Select Guide</option>
                    {guides.map((guide) => (
                        <option key={guide._id} value={guide.name}>
                            {guide.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Book Button */}
            <button className="btn btn-primary w-full" onClick={handleBooking}>
                Book Now
            </button>
        </div>
    );
};

export default BookingForm;
