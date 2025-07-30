import React, { useEffect, useState } from "react";
import Button from "../../../../components/Ui/Button";
import Input from "../../../../components/Ui/Input";
import PageTitle from "../../../../components/Ui/PageTitle";
import { fetchVendorDetails, updateVendorProfile } from "../../../../api/ProfileUpdateApi";
import Loader from "../../../../components/loader/Loader";
import { toast } from "react-toastify";

type FormDataType = {
    name: string;
    phone: string;
    email: string;
}
const VendorProfile = () => {
    const [formData, setFormData] = useState<FormDataType>({
        name: "",
        phone: "",
        email: "",
    });
    console.log({ formData });

    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadRestaurant = async () => {
            setLoading(true);
            try {
                const vendor_id = localStorage.getItem("vendor_id");
                if (!vendor_id) {
                    console.warn("Restaurant ID not found in localStorage.");
                    setLoading(false);
                    return;
                }
                const fetchedData = await fetchVendorDetails(vendor_id);
                console.log({fetchedData});
                
                if (Array.isArray(fetchedData) && fetchedData.length > 0) {
                    setFormData({
                        name: fetchedData[0]?.name,
                        phone: fetchedData[0]?.phone,
                        email: fetchedData[0]?.email,
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
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await updateVendorProfile(formData);
            console.log("Profile updated successfully:", res);
            toast.success("Profile Updated Successfully");
        } catch (err) {
            console.error("Failed to update restaurant:", err);
            toast.error("Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <form onSubmit={handleSubmit} className="px-4 py-6 md:px-8 bg-white">
            <PageTitle title="Manage Profile" align="left" />

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Input
                        type="text"
                        name="name"
                        label="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input"
                        placeholder="Enter full name"
                    />
                </div>


                <Input
                    type="text"
                    name="phone"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                />
                <Input
                    type="email"
                    name="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                />
            </div>

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
        </form>
    );
};

export default VendorProfile;
