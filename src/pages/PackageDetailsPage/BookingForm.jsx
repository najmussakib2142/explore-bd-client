import { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaUserCircle } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

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
    // const [totalMembers, setTotalMembers] = useState(1);
    // const maxMembers = Number(packageData.groupSize.split("-")[1]);
    const [members, setMembers] = useState(1);
    const maxMembers = 10

    const [startDate, setStartDate] = useState(new Date());
    const totalDays = packageData.plan.length  // number of days in the plan.
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + totalDays - 1);
    // const tourStartDate = new Date(packageData.startDate);
    // const modifyStartDate = new Date(packageData.startDate);
    const formattedStartDate = new Date(startDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    });
    // const modifyEndDate = new Date(packageData.endDate);
    const formattedEndDate = new Date(endDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    });
    console.log("Start:", formattedStartDate);
    console.log("End:", formattedEndDate);

    const tracking_id = generateTrackingID()
    const guideDetails = guides.find((g) => g._id === selectedGuide);



    // const normalize = (str) =>
    //     (str || "")                  // fallback if undefined
    //         .toLowerCase()             // lowercase
    //         .replace(/\s+/g, "")       // remove all spaces
    //         .replace(/['’]/g, "");    // remove apostrophes

    // const filteredGuides = guides.filter(
    //     (guide) => normalize(guide.district) === normalize(packageData.location)
    // );



    const handleBooking = async () => {
        if (!user) {
            return Swal.fire({
                icon: "warning",
                title: "Login Required",
                text: "You need to login to book this package",
                confirmButtonText: "Login",
            }).then(() => navigate("/login", { state: { from: location.pathname } }));
        }

        if (!selectedGuide) {
            return Swal.fire(
                "Missing Guide",
                "Please select a guide before booking.",
                "warning"
            );
        }

        if (!members || members <= 0) {
            return Swal.fire(
                "Missing Members",
                "Please enter total members.",
                "warning"
            );
        }

        if (!startDate) {
            return Swal.fire(
                "Missing Date",
                "Please select a start date for your trip.",
                "warning"
            );
        }

        // const totalPrice = packageData.price * totalMembers;
        const totalPrice = packageData.price * members;

        Swal.fire({
            title: "Booking Summary",
            icon: "info",
            html: `
      <div class="text-left text-base space-y-2">
        <p><strong>Package:</strong> ${packageData.title}</p>
        <p><strong>Tour Guide:</strong> ${guideDetails.name}</p>
        <p><strong>Tour Date:</strong> ${formattedStartDate} - ${formattedEndDate}</p>
        <p><strong>Total Members:</strong> ${members}</p>
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

                const bookingData = {
                    userId: user.uid,
                    packageId: packageData._id,
                    packageName: packageData.title,
                    price: totalPrice,
                    touristName: user.displayName,
                    created_by: user.email,
                    touristImage: user.photoURL,
                    // tourDate: {
                    //     start: packageData.startDate,
                    //     end: packageData.endDate,
                    // },
                    tourDate: {
                        start: formattedStartDate,
                        end: formattedEndDate,
                    },

                    payment_status: 'unpaid',
                    guideName: guideDetails.name,
                    guideId: guideDetails._id,
                    guideEmail: guideDetails.email,
                    guideUserId: guideDetails.userId,
                    // guideDistrict: guide.district,
                    members,
                    booking_status: "pending",
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
            <h3 className="text-2xl font-semibold mb-4">Booking Form <br />
                <span className="text-primary font-semibold text-xl">{packageData.title}</span>
            </h3>

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
                    <label className="block font-semibold">Tourist Name</label>
                    <input
                        type="text"
                        value={user?.displayName || ""}
                        readOnly
                        className="input text-primary input-bordered w-full"
                    />
                </div>

                <div>
                    <label className="block font-semibold">Tourist Email</label>
                    <input
                        type="text"
                        value={user?.email || ""}
                        readOnly
                        className="input text-primary input-bordered w-full"
                    />
                </div>

                <div>
                    <label className="block font-semibold">Price per Person</label>
                    <input
                        type="text"
                        value={`BDT ${packageData.price}`}
                        readOnly
                        className="input text-primary input-bordered w-full"
                    />
                </div>

                <div>
                    <label className="block font-semibold">Available Tour Guides</label>

                    <select
                        value={selectedGuide}
                        onChange={(e) => setSelectedGuide(e.target.value)}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select Guide</option>
                        {guides.map((guide) => (
                            <option
                                key={guide._id}
                                value={guide._id}
                            >
                                {guide.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tour Date */}
                <div>
                    <label className="block font-semibold">Tour Date</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        customInput={<input className="border p-2 rounded" />}
                        placeholderText="Select a date"
                        dateFormat="dd/MM/yyyy"
                    />
                    {/* <p>Start:{formattedStartDate}</p> */}
                    <p className="pt-2 "><span className="text-primary font-semibold">End Date:</span> {formattedEndDate}</p>
                </div>

                {/* <div>
                    <label className="block font-semibold">Tour Date</label>
                    <input
                        type="text"
                        value={`From ${new Date(packageData.startDate).toLocaleDateString()} To ${new Date(
                            packageData.endDate
                        ).toLocaleDateString()}`}
                        readOnly
                        className="input input-bordered w-full"
                    />
                </div> */}



                {/* <div>
                    <label className="block font-semibold">Available Tour Guides In This Area</label>


                    <select
                        value={selectedGuide}
                        onChange={(e) => setSelectedGuide(e.target.value)}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select One</option>
                        {filteredGuides.map((guide) => (
                            <option key={guide._id} value={guide.name}>
                                {guide.name}
                            </option>
                        ))}
                    </select>
                    {filteredGuides.length === 0 && (
                        <p className="text-sm text-red-500 mt-1">No guides available in this location</p>
                    )}
                </div> */}

                {/* <div>
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
                </div> */}
                <div>
                    <div className="flex items-center gap-2 mt-2">
                        <label className="font-semibold">Total Members:</label>

                        <button
                            type="button"
                            onClick={() => setMembers(Math.max(1, members - 1))}
                            className="px-3 border border-primary py-1 bg-base-100 rounded"
                        >
                            -
                        </button>
                        <span className="px-3">{members}</span>
                        <button
                            type="button"
                            onClick={() => setMembers(Math.min(maxMembers, members + 1))}
                            className="px-3 py-1 bg-base-100 border border-primary rounded"
                        >
                            +
                        </button>
                    </div>
                    <span className="text-red-400 text-sm">Max Members: 10</span>
                </div>
            </div>

            <button className="btn btn-primary w-full mt-4" onClick={handleBooking}>
                Book Now
            </button>
        </div>
    );
};

export default BookingForm;
