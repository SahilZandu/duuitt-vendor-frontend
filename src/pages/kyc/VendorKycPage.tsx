import { useEffect } from "react";
import KycPage from "../../components/Ui/kycPage";
import { useVendor } from "../../lib/Context/VendorContext";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";

const VendorKycPage = () => {
    const { vendor, loading, fetchVendor } = useVendor();
    console.log("vendor-------------", vendor);
    
    useEffect(() => {
        fetchVendor();
    }, []);

    const navigate = useNavigate();
    useEffect(() => {
        if (vendor?.is_kyc_completed) {
            navigate('/dashboard');
        }
    }, [vendor])
    if (loading) return <Loader />;
    return (
        <div className="min-h-screen bg-gray-100">
            <KycPage />
        </div>
    );
};

export default VendorKycPage;
