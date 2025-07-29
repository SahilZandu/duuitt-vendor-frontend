
const documentList = [
    { label: "Vehicle Type", status: "Verified" },
    { label: "Driving License", status: "Verified" },
    { label: "Profile Photo", status: "Pending" },
    { label: "Aadhaar Card", status: "Pending" },
    { label: "PAN Card", status: "Pending" },
    { label: "Registration (RC)", status: "Pending" },
    { label: "Vehicle Insurance", status: "Pending" },
    { label: "Police Verification (PVC)", status: "Pending" },
    { label: "Bank Detail", status: "Pending" },
];

const VendorKycPage = () => {
    const userName = "Rahul Garg"; // You can replace this dynamically from user data

    return (
        <div
            className="min-h-screen flex flex-col justify-center items-center"
        >
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">
                Welcome, {userName}
            </h1>

            <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-2xl">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Required Document
                </h2>
                <ul className="divide-y">
                    {documentList.map((doc, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between py-2 px-2 hover:bg-gray-50"
                        >
                            <span className="text-gray-700">{doc.label}</span>
                            <span
                                className={`text-sm font-medium px-2 py-1 rounded-full ${doc.status === "Verified"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                {doc.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default VendorKycPage;
