
import PageTitle from "../components/Ui/PageTitle";
import Loader from "../components/loader/Loader";
import { useSettings } from "../lib/Context/SettingsContext";

const TermsAndConditions = () => {
    const { settings, loading } = useSettings();
    console.log("settings-----", settings);

    if (loading) return <Loader />;
    return (
        <>
            <PageTitle title="Terms and Conditions" />
             <div
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: settings?.terms_and_conditions || "" }}
            />

            {/* <Footer /> */}
        </>
    )
};
export default TermsAndConditions;