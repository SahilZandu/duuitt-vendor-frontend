import React, { useEffect, useState } from "react";
import Button from "../../../../components/Ui/Button";
import Input from "../../../../components/Ui/Input";
import PageTitle from "../../../../components/Ui/PageTitle";
import RadioButton from "../../../../components/Ui/RadioButton";
import { deleteRestaurantAsset, fetchRestaurantDetails, updateRestaurantProfile } from "../../../../api/ProfileUpdateApi";
import Loader from "../../../../components/loader/Loader";
import { toast } from "react-toastify";
import { validateFormData } from "../../../../utils/validateForm";
import { restaurantProfileSchema } from "../../../../validations/restaurantProfileSchema";
import DeleteModal from "../../../../components/modals/DeleteModal";
import MenuIcon from "../../../../lib/MenuIcon";
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
                return urlOrFile; // full URL or blob URL, return as-is
            }
            return `${import.meta.env.VITE_BACKEND_BASE_URL}${urlOrFile}`; // prepend base URL for relative paths
        } else {
            // It's a File, create a blob URL for preview
            return URL.createObjectURL(urlOrFile);
        }
    };

    const convertToFormData = (data: FormDataType, restaurant_id: string) => {
        const formDataToSend = new FormData();

        formDataToSend.append("restaurant_id", restaurant_id);

        // Banner
        if (typeof data.banner === "string") {
            // Remove base URL before sending
            const bannerPath = data.banner.replace(import.meta.env.VITE_BACKEND_BASE_URL, "");
            formDataToSend.append("banner", bannerPath);
        } else {
            formDataToSend.append("banner", data.banner);
        }

        // Assets
        data?.files?.forEach((asset) => {
            if (typeof asset === "string") {
                const assetPath = asset.replace(import.meta.env.VITE_BACKEND_BASE_URL, "");
                formDataToSend.append(`files`, assetPath);
            } else {
                formDataToSend.append(`files`, asset);
            }
        });

        // Append other scalar fields
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

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="px-4 py-6 md:px-8 bg-white">
                {isPending && (
                    <div className="mb-4 p-4 border-l-4 border-yellow-500 bg-[#8E3CF7] text-white rounded">
                        Your profile update request has been sent to the admin. Please wait for approval. Once approved, you’ll be able to update your restaurant details.
                    </div>
                )}
                <PageTitle title="Restaurant Profile" subtitle="Update your restaurant details here" align="left" />
                {formData.banner && (
                    <div className="mb-6 relative">
                        {/* Banner Image Preview */}
                        <img
                            src={getImageSrc(formData?.banner)}
                            alt="Banner"
                            crossOrigin="anonymous"
                            className="w-full h-56 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />

                        {/* Change Cover Photo Button */}
                        <label
                            htmlFor="bannerUpload"
                            className="absolute bottom-3 border border-white right-3 bg-black bg-opacity-60 text-white px-3 py-1 text-sm rounded cursor-pointer hover:bg-opacity-80 transition"
                        >
                            📷 Change Cover Photo
                        </label>
                        <input
                            id="bannerUpload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setFormData((prev) => ({
                                        ...prev,
                                        banner: file,
                                    }));
                                }
                            }}
                            className="hidden"
                        />
                    </div>
                )}

                <div className="mb-6">
                    <div className="flex justify-between">
                        <h2 className="font-semibold text-lg mb-3">Restaurant Images</h2>

                        {/* Add Images Button */}
                        <div className="mb-4">
                            <label
                                htmlFor="addImages"
                                className="inline-block bg-purple-600 text-white text-sm px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition"
                            >
                                📷 Add Images
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
                                        setFormData((prev) => ({
                                            ...prev,
                                            files: [...newFiles, ...prev.files],
                                        }));
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    {formData.files.length > 0 && (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {formData?.files.slice(0, visibleCount).map((asset, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={getImageSrc(asset)}
                                            crossOrigin="anonymous"
                                            alt={`Asset ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border shadow-sm"
                                        />
                                        <button
                                            onClick={() => {
                                                setAssetToDeleteIndex(index);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-80 hover:opacity-100 transition"
                                            type="button"
                                        >
                                            {/* ✕ */}
                                            <MenuIcon name="close" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Show More Button */}
                            {visibleCount < formData.files.length && (
                                <div className="flex justify-end mt-4">
                                    <Button
                                        label="View More"
                                        variant="outline-success"
                                        onClick={() => setVisibleCount((prev) => prev + 4)}
                                        className="text-sm !w-auto px-4 py-2"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Input
                            type="text"
                            name="address"
                            disabled={isPending}
                            label="Restaurant Address"
                            value={formData?.address}
                            onChange={handleChange}
                            className="input"
                            placeholder="Enter restaurant address"
                            error={errors?.address}
                            required
                        />
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
                        placeholder="Enter preparation time"
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
                        placeholder="Enter preparation time"
                        error={errors?.admin_commission}
                        required
                    />
                    <Input
                        type="number"
                        disabled={isPending}
                        label="Gst Percentage"
                        name="gst_percentage"
                        value={formData?.gst_percentage}
                        onChange={handleChange}
                        className="input"
                        placeholder="Enter preparation time"
                        error={errors?.gst_percentage}
                        required
                    />
                </div>
                {!isPending && (
                    <div className="mt-6 flex justify-end">
                        <Button
                            type="submit"
                            variant="primary"
                            label="Update"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            className="text-sm !w-auto px-4 py-2"
                        />
                    </div>
                )}

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
        </>
    );
};

export default RestaurantProfile;
