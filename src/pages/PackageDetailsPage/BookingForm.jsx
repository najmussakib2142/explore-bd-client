import { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaUserCircle } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";

const generateTrackingID = () => {
    const date = new Date();
    const datePart = date.toISOString().split("T")[0].replace(/-/g, "");
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `PCL-${datePart}-${rand}`;
};


const BookingForm = ({ packageData, guides }) => {
    const { user } = useAuth();
    // const axiosSecure = useAxiosSecure();
    const axiosInstance = useAxios()
    const navigate = useNavigate();

    const [selectedGuide, setSelectedGuide] = useState("");
    const [totalMembers, setTotalMembers] = useState(1);

    const maxMembers = Number(packageData.groupSize.split("-")[1]);

    const handleBooking = async () => {
        if (!user) {
            return Swal.fire({
                icon: "warning",
                title: "Login Required",
                text: "You need to login to book this package",
                confirmButtonText: "Login",
            }).then(() => navigate("/login", { state: { from: location.pathname } }));
        }

        if (!selectedGuide || !totalMembers) {
            return Swal.fire(
                "Missing Info",
                "Please fill all required fields",
                "warning"
            );
        }

        const totalPrice = packageData.price * totalMembers;

        Swal.fire({
            title: "Booking Summary",
            icon: "info",
            html: `
      <div class="text-left text-base space-y-2">
        <p><strong>Package:</strong> ${packageData.title}</p>
        <p><strong>Tour Guide:</strong> ${selectedGuide}</p>
        <p><strong>Tour Date:</strong> ${new Date(packageData.startDate).toLocaleDateString()} - ${new Date(packageData.endDate).toLocaleDateString()}</p>
        <p><strong>Total Members:</strong> ${totalMembers}</p>
        <hr class="my-2"/>
        <p><strong>Price per Person:</strong> BDT ${packageData.price}</p>
        <p class="text-gray-500 text-sm">Total Price = Price per Person × Total Members</p>
        <hr class="my-2"/>
        <p class="text-xl font-bold text-green-600">Total Price: BDT ${totalPrice}</p>
      </div>
    `,
            showDenyButton: true,
            confirmButtonText: "💳 Confirm Booking",
            denyButtonText: "✏️ Edit Details",
            confirmButtonColor: "#16a34a",
            denyButtonColor: "#757575",
            customClass: {
                popup: "rounded-xl shadow-md px-6 py-6",
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const tracking_id = generateTrackingID()
                const bookingData = {
                    userId: user.uid,
                    packageId: packageData._id,
                    packageName: packageData.title,
                    price: totalPrice,
                    touristName: user.displayName,
                    created_by: user.email,
                    touristImage: user.photoURL,
                    tourDate: {
                        start: packageData.startDate,
                        end: packageData.endDate,
                    },
                    payment_status: 'unpaid',
                    guideName: selectedGuide,
                    totalMembers,
                    status: "pending",
                    tracking_id: tracking_id,
                    created_at: new Date().toISOString(),
                };

                try {
                    const res = await axiosInstance.post("/bookings", bookingData);
                    if (res.data.insertedId) {
                        Swal.fire({
                            title: "Booking Confirmed",
                            text: "Your booking has been placed successfully!",
                            icon: "success",
                            confirmButtonText: "Go to My Bookings",
                        }).then(() => navigate("/dashboard/myBookings"));
                    }
                } catch (err) {
                    console.log(err);
                    Swal.fire("Error!", err.message || "Something went wrong", "error");
                }
            }
        });
    };

    return (
        <div className="bg-base-100 p-6 rounded-lg shadow-lg" data-aos="fade-up">
            <h3 className="text-xl font-semibold mb-4">Book This Package</h3>

            {user?.photoURL ? (
                <img
                    className="w-36 h-36 rounded-full object-cover dark:border dark:border-primary mb-4"
                    src={user.photoURL}
                    alt="User"
                />
            ) : (
                <FaUserCircle className="w-36 h-36 text-gray-600 dark:text-primary mb-4 transition-colors" />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="block font-semibold">Price per Person</label>
                    <input
                        type="text"
                        value={`BDT ${packageData.price}`}
                        readOnly
                        className="input input-bordered w-full"
                    />
                </div>

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

                <div>
                    <label className="block font-semibold">Tour Date</label>
                    <input
                        type="text"
                        value={`From ${new Date(packageData.startDate).toLocaleDateString()} To ${new Date(
                            packageData.endDate
                        ).toLocaleDateString()}`}
                        readOnly
                        className="input input-bordered w-full"
                    />
                </div>

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

                <div>
                    <label className="block font-semibold">Total Members</label>
                    <select
                        value={totalMembers}
                        onChange={(e) => setTotalMembers(parseInt(e.target.value))}
                        className="select select-bordered w-full"
                    >
                        {Array.from({ length: maxMembers }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                    <p className="text-sm text-gray-400 mt-1">
                        Allowed group size: 1-{maxMembers}
                    </p>
                </div>
            </div>

            <button className="btn btn-primary w-full mt-4" onClick={handleBooking}>
                Book Now
            </button>
        </div>
    );
};

export default BookingForm;
