
import Loader from "../components/loader/Loader";
import PageTitle from "../components/Ui/PageTitle";
import { useSettings } from "../lib/Context/SettingsContext";

const PrivacyPolicy = () => {
    const { settings, loading } = useSettings();
    console.log("settings-----", settings);

    if (loading) return <Loader />;
    return (
        <>
            <PageTitle title="Privacy Policy" />
            <div
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: settings?.privacy_policy || "" }}
            />

            {/* <Footer /> */}
        </>
    )
};
export default PrivacyPolicy;