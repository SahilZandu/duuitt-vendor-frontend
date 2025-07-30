import React, { useEffect, useState } from "react";
import Button from "../../../../components/Ui/Button";
import Input from "../../../../components/Ui/Input";
import PageTitle from "../../../../components/Ui/PageTitle";
import { fetchVendorDetails, updateVendorProfile } from "../../../../api/ProfileUpdateApi";
import Loader from "../../../../components/loader/Loader";
import { toast } from "react-toastify";
import { vendorProfileSchema } from "../../../../validations/vendorProfileSchema";
import { validateFormData } from "../../../../utils/validateForm";

type FormDataType = {
  name: string;
  phone: string;
  email: string;
};

const VendorProfile = () => {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    phone: "",
    email: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<FormDataType>>({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadVendor = async () => {
      setLoading(true);
      try {
        const vendor_id = localStorage.getItem("vendor_id");
        if (!vendor_id) return;

        const fetchedData = await fetchVendorDetails(vendor_id);
        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          const vendor = fetchedData[0];
          setFormData({
            name: vendor.name,
            phone: vendor.phone,
            email: vendor.email,
          });
        }
      } catch (error) {
        toast.error("Failed to load vendor data");
      } finally {
        setLoading(false);
      }
    };

    loadVendor();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" })); // Clear individual error
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { valid, errors } = await validateFormData(vendorProfileSchema, formData);
    if (!valid) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      await updateVendorProfile(formData);
      toast.success("Profile Updated Successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <form onSubmit={handleSubmit} className="px-4 py-6 md:px-8 bg-white">
      <PageTitle title="Manage Profile" align="left" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter full name"
          error={formErrors.name}
          required
        />
        <Input
          type="number"
          name="phone"
          label="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          error={formErrors.phone}
          required
        />
        <Input
        //   type="email"
          name="email"
          label="Email Address"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          error={formErrors.email}
          required
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
