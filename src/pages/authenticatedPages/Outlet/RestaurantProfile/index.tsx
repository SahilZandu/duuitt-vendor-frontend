import React, { useEffect, useState } from "react";
import Button from "../../../../components/Ui/Button";
import Input from "../../../../components/Ui/Input";
import RadioButton from "../../../../components/Ui/RadioButton";
import { deleteRestaurantAsset, fetchRestaurantDetails, updateRestaurantProfile } from "../../../../api/ProfileUpdateApi";
import Loader from "../../../../components/loader/Loader";
import { toast } from "react-toastify";
import { validateFormData } from "../../../../utils/validateForm";
import { restaurantProfileSchema } from "../../../../validations/restaurantProfileSchema";
import DeleteModal from "../../../../components/modals/DeleteModal";
import MenuIcon from "../../../../lib/MenuIcon";
import AddressAutocomplete from "../../../../components/Ui/AddressAutocomplete";
import { useLoadScript } from "../../../../hooks/useLoadScript";
type FormDataType = {
    banner: string | File;
    files: (string | File)[];
    name: string;
    about: string;
    address: string;
    phone: string;
    email: string;
    date_of_founding: string;
    veg_non_veg: string;
    minimum_order_value: string;
    minimum_order_preparation_time: string;
    restaurant_charge: string;
    admin_commission: string;
    gst_percentage: string;
    location?: { type: "Point"; coordinates: [number, number] };
};

const RestaurantProfile = () => {
    const [formData, setFormData] = useState<FormDataType>({
        banner: "",
        files: [],
        name: "",
        about: "",
        address: "",
        phone: "",
        email: "",
        date_of_founding: "",
        veg_non_veg: "",
        minimum_order_value: "",
        minimum_order_preparation_time: "",
        restaurant_charge: "",
        admin_commission: '',
        gst_percentage: '',
    });
    console.log({ formData });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [visibleCount, setVisibleCount] = useState(4);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [assetToDeleteIndex, setAssetToDeleteIndex] = useState<number | null>(null);
    const [approvalRequest, setApprovalRequest] = useState('');
    const isPending = approvalRequest === "pending";

    useEffect(() => {
        const loadRestaurant = async () => {
            setLoading(true);
            try {
                const restaurant_id = localStorage.getItem("restaurant_id");
                if (!restaurant_id) {
                    console.warn("Restaurant ID not found in localStorage.");
                    setLoading(false);
                    return;
                }
                const fetchedData = await fetchRestaurantDetails(restaurant_id);
                console.log({ fetchedData });
                if (Array.isArray(fetchedData) && fetchedData.length > 0) {
                    const approval_request = fetchedData[0]?.approval_request;
                    console.log({ approval_request });
                    setApprovalRequest(approval_request);
                }


                if (Array.isArray(fetchedData) && fetchedData.length > 0) {
                    setFormData({
                        banner: fetchedData[0]?.banner,
                        files: fetchedData[0]?.assets,
                        name: fetchedData[0]?.vendor?.name,
                        about: fetchedData[0]?.about,
                        address: fetchedData[0]?.address,
                        phone: fetchedData[0]?.vendor?.phone,
                        email: fetchedData[0]?.vendor?.email,
                        date_of_founding: fetchedData[0]?.date_of_founding,
                        veg_non_veg: fetchedData[0]?.veg_non_veg,
                        minimum_order_value: fetchedData[0]?.minimum_order_value,
                        minimum_order_preparation_time: fetchedData[0]?.minimum_order_preparation_time,
                        restaurant_charge: fetchedData[0]?.restaurant_charge,
                        admin_commission: fetchedData[0]?.admin_commission,
                        gst_percentage: fetchedData[0]?.gst_percentage,
                        location: fetchedData[0]?.location
                            ? {
                                type: "Point",
                                coordinates: [
                                    fetchedData[0].location.coordinates[0],
                                    fetchedData[0].location.coordinates[1]
                                ]
                            }
                            : undefined
                    });
                } else {
                    console.warn("No restaurant data returned.");
                }
            } catch (error) {
                console.error("Failed to load restaurant details:", error);
            } finally {
                setLoading(false);
            }
        };

        loadRestaurant();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleRadioChange = (value: string) => {
        setFormData((prev) => ({ ...prev, veg_non_veg: value }));
    };

    const handleConfirmDelete = async () => {
        if (assetToDeleteIndex === null) return;

        const restaurant_id = localStorage.getItem("restaurant_id");
        if (!restaurant_id) {
            toast.error("Restaurant ID not found.");
            return;
        }

        try {
            await deleteRestaurantAsset({
                restaurantId: restaurant_id,
                index: assetToDeleteIndex,
            });

            toast.success("Image deleted successfully");

            setFormData((prev) => ({
                ...prev,
                files: prev.files.filter((_, idx) => idx !== assetToDeleteIndex),
            }));

            setIsDeleteModalOpen(false);
            setAssetToDeleteIndex(null);
        } catch (error) {
            console.error("Failed to delete image", error);
            toast.error("Failed to delete image");
        }
    };

    const getImageSrc = (urlOrFile: string | File) => {
        if (!urlOrFile) return "";

        if (typeof urlOrFile === "string") {
            if (urlOrFile.startsWith("http") || urlOrFile.startsWith("blob:")) {
                return urlOrFile;
            }
            return `${import.meta.env.VITE_BACKEND_BASE_URL}${urlOrFile}`;
        } else {
            return URL.createObjectURL(urlOrFile);
        }
    };

    const convertToFormData = (data: FormDataType, restaurant_id: string) => {
        const formDataToSend = new FormData();

        formDataToSend.append("restaurant_id", restaurant_id);

        if (typeof data.banner === "string") {
            const bannerPath = data.banner.replace(import.meta.env.VITE_BACKEND_BASE_URL, "");
            formDataToSend.append("banner", bannerPath);
        } else {
            formDataToSend.append("banner", data.banner);
        }

        data?.files?.forEach((asset) => {
            if (typeof asset === "string") {
                const assetPath = asset.replace(import.meta.env.VITE_BACKEND_BASE_URL, "");
                formDataToSend.append(`files`, assetPath);
            } else {
                formDataToSend.append(`files`, asset);
            }
        });
        if (data.location) {
            formDataToSend.append("location", JSON.stringify(data.location));
        }

        formDataToSend.append("name", data.name);
        formDataToSend.append("about", data.about);
        formDataToSend.append("address", data.address);
        formDataToSend.append("phone", data.phone);
        formDataToSend.append("email", data.email);
        formDataToSend.append("date_of_founding", data.date_of_founding);
        formDataToSend.append("veg_non_veg", data.veg_non_veg);
        formDataToSend.append("minimum_order_value", data.minimum_order_value);
        formDataToSend.append("minimum_order_preparation_time", data.minimum_order_preparation_time);
        formDataToSend.append("restaurant_charge", data.restaurant_charge);
        formDataToSend.append("admin_commission", data.admin_commission);
        formDataToSend.append("gst_percentage", data.gst_percentage);
        return formDataToSend;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const restaurant_id = localStorage.getItem("restaurant_id");
        if (!restaurant_id) {
            console.error("Restaurant ID not found.");
            return;
        }

        const { valid, errors } = await validateFormData(restaurantProfileSchema, formData);

        if (!valid) {
            setErrors(errors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);
        try {
            const formDataToSend = convertToFormData(formData, restaurant_id);
            await updateRestaurantProfile(formDataToSend);
            toast.success("Profile Updated Successfully");
        } catch (err) {
            toast.error("Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };
    const loaded = useLoadScript(
        `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`
    );
    if (loading) {
        return <Loader />;
    }

    return (
        <form onSubmit={handleSubmit} className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
            {/* Hero Banner */}
            <div className="relative">
                {formData.banner ? (
                    <div className="relative h-64 md:h-80 overflow-hidden">
                        <img
                            src={getImageSrc(formData?.banner)}
                            alt="Banner"
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                        <label
                            htmlFor="bannerUpload"
                            className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-gray-800 px-4 py-2.5 text-sm font-medium rounded-full cursor-pointer hover:bg-white hover:shadow-xl transition-all duration-300 shadow-lg"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Change Cover
                        </label>
                        <input
                            id="bannerUpload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setFormData((prev) => ({ ...prev, banner: file }));
                                }
                            }}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="h-48 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700" />
                )}
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-12 relative z-10 pb-10">
                {/* Pending Alert */}
                {isPending && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-lg flex items-center gap-3 backdrop-blur-sm">
                        <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium">Your profile update request is pending admin approval.</p>
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="px-6 md:px-8 py-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Restaurant Profile</h1>
                        <p className="text-purple-100 text-sm mt-1">Update your restaurant details here</p>
                    </div>

                    {/* Gallery Section */}
                    <div className="px-6 md:px-8 py-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                Gallery
                            </h2>
                            <label
                                htmlFor="addImages"
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm px-5 py-2.5 rounded-full cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Images
                            </label>
                            <input
                                id="addImages"
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    const files = e.target.files;
                                    if (files && files.length > 0) {
                                        const newFiles = Array.from(files);
                                        setFormData((prev) => ({ ...prev, files: [...newFiles, ...prev.files] }));
                                    }
                                }}
                            />
                        </div>

                        {formData.files.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {formData?.files.slice(0, visibleCount).map((asset, index) => (
                                        <div key={index} className="relative group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                            <img
                                                src={getImageSrc(asset)}
                                                crossOrigin="anonymous"
                                                alt={`Asset ${index + 1}`}
                                                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <button
                                                onClick={() => {
                                                    setAssetToDeleteIndex(index);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110 shadow-lg"
                                                type="button"
                                            >
                                                <MenuIcon name="close" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {visibleCount < formData.files.length && (
                                    <div className="flex justify-center mt-6">
                                        <Button
                                            label="View More"
                                            variant="outline-success"
                                            onClick={() => setVisibleCount((prev) => prev + 4)}
                                            className="text-sm !w-auto px-6 py-2.5 rounded-full"
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center bg-gray-50/50">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-400 font-medium">No images uploaded yet</p>
                                <p className="text-gray-300 text-sm mt-1">Click "Add Images" to upload</p>
                            </div>
                        )}
                    </div>

                    {/* Form Section */}
                    <div className="px-6 md:px-8 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Input
                                    type="text"
                                    name="name"
                                    label="Restaurant Name"
                                    disabled={isPending}
                                    value={formData?.name}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Enter full name"
                                    error={errors?.name}
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Input
                                    label="About"
                                    name="about"
                                    disabled={isPending}
                                    placeholder="Write about your restaurant"
                                    value={formData?.about}
                                    onChange={handleChange}
                                    multiline
                                    rows={5}
                                    error={errors?.about}
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block font-semibold mb-2 text-gray-700">Restaurant Address</label>
                                {loaded ? (
                                    <div className="border border-gray-200 p-3 rounded-xl bg-gray-50/50 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                                        <AddressAutocomplete
                                            value={formData.address}
                                            disabled={isPending}
                                            onChange={(address, coordinates) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    address,
                                                    ...(coordinates && {
                                                        location: {
                                                            type: "Point",
                                                            coordinates,
                                                        },
                                                    }),
                                                }))
                                            }
                                        />
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        disabled
                                        placeholder="Loading..."
                                        className="input"
                                    />
                                )}
                                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                            </div>

                            <Input
                                type="number"
                                name="phone"
                                label="Phone Number"
                                disabled={isPending}
                                value={formData?.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                error={errors?.phone}
                                required
                            />
                            <Input
                                name="email"
                                label="Email Address"
                                value={formData?.email}
                                disabled={isPending}
                                onChange={handleChange}
                                placeholder="Enter email"
                                error={errors?.email}
                                required
                            />
                            <Input
                                name="date_of_founding"
                                label="Date of Founding"
                                type="date"
                                value={formData?.date_of_founding}
                                onChange={handleChange}
                                disabled={isPending}
                                error={errors?.date_of_founding}
                                required
                            />

                            <div className="flex gap-3">
                                <RadioButton
                                    label="Item Type"
                                    name="item-type"
                                    options={[
                                        { label: "Pure Veg", value: "veg" },
                                        { label: "Non Veg", value: "Non Veg" },
                                    ]}
                                    selected={formData.veg_non_veg}
                                    onChange={handleRadioChange}
                                    disabled={isPending}
                                />
                            </div>

                            <Input
                                type="number"
                                label="Minimum Order Value"
                                name="minimum_order_value"
                                value={formData?.minimum_order_value}
                                onChange={handleChange}
                                className="input"
                                disabled={isPending}
                                placeholder="Enter minimum order value"
                                error={errors?.minimum_order_value}
                                required
                            />

                            <Input
                                type="number"
                                label="Minimum Order Preparation Time (in minutes)"
                                name="minimum_order_preparation_time"
                                value={formData?.minimum_order_preparation_time}
                                onChange={handleChange}
                                className="input"
                                placeholder="Enter preparation time"
                                error={errors?.minimum_order_preparation_time}
                                required
                                disabled={isPending}
                            />
                            <Input
                                type="number"
                                disabled={isPending}
                                label="Restaurant Charge(%)"
                                name="restaurant_charge"
                                value={formData?.restaurant_charge}
                                onChange={handleChange}
                                className="input"
                                placeholder="Enter restaurant charge"
                                error={errors?.restaurant_charge}
                                required
                            />
                            <Input
                                type="number"
                                disabled={true}
                                label="Admin Commission(%)"
                                name="admin_commission"
                                value={formData?.admin_commission}
                                onChange={handleChange}
                                className="input"
                                placeholder="Admin commission"
                                error={errors?.admin_commission}
                                required
                            />
                            <Input
                                type="number"
                                disabled={isPending}
                                label="GST Percentage"
                                name="gst_percentage"
                                value={formData?.gst_percentage}
                                onChange={handleChange}
                                className="input"
                                placeholder="Enter GST percentage"
                                error={errors?.gst_percentage}
                                required
                            />
                        </div>

                        {!isPending && (
                            <div className="mt-8 flex justify-end">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    label="Update Profile"
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                    className="text-sm !w-auto px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:scale-105 transition-all duration-300"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                title="Delete Restaurant Image"
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setAssetToDeleteIndex(null);
                }}
                onDelete={handleConfirmDelete}
            />
        </form>
    );
};

export default RestaurantProfile;
