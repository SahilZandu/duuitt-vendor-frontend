import React, { useEffect, useState } from "react";
import Button from "../../../../components/Ui/Button";
import Input from "../../../../components/Ui/Input";
import PageTitle from "../../../../components/Ui/PageTitle";
import { fetchRestaurantDetails, updateRestaurantProfile } from "../../../../api/ProfileUpdateApi";
import Loader from "../../../../components/loader/Loader";
import { toast } from "react-toastify";

type FormDataType = {
    banner: string | File;
    assets: (string | File)[];
    name: string;
    about: string;
    address: string;
    phone: string;
    email: string;
    date_of_founding: string;
    veg_non_veg: string;
    minimum_order_value: string;
    minimum_order_preparation_time: string;
};

const RestaurantProfile = () => {
    const [formData, setFormData] = useState<FormDataType>({
        banner: "",
        assets: [],
        name: "",
        about: "",
        address: "",
        phone: "",
        email: "",
        date_of_founding: "",
        veg_non_veg: "",
        minimum_order_value: "",
        minimum_order_preparation_time: "",
    });
    console.log({ formData });

    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // const restaurant_id = localStorage.getItem("restaurant_id");
        // if (!restaurant_id) {
        //     console.error("Restaurant ID not found.");
        //     return;
        // }
        // setIsSubmitting(true);
        // try {
        //     const res = await updateRestaurantProfile(restaurant_id, formData);
        //     console.log("Profile updated successfully:", res);
        //     toast.success("Profile Updated Successfully");
        // } catch (err) {
        //     console.error("Failed to update restaurant:", err);
        //     toast.error("Failed to update profile");
        // } finally {
        //     setIsSubmitting(false);
        // }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <form onSubmit={handleSubmit} className="px-4 py-6 md:px-8 bg-white">
            <PageTitle title="Restaurant Profile" subtitle="Update your restaurant details here" align="left" />

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Input
                        type="text"
                        name="name"
                        label="Restaurant Name"
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

export default RestaurantProfile;
