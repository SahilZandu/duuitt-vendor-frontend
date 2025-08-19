
import Loader from "../components/loader/Loader";
import PageTitle from "../components/Ui/PageTitle";
import { useSettings } from "../lib/Context/SettingsContext";

const OpenSourceLibrary = () => {
    const { settings, loading } = useSettings();
    if (loading) return <Loader />;
    
    return (
        <>
            <PageTitle title="Open Source Library" />
            <div
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: settings?.open_source_library || "" }}
            />

            {/* <Footer /> */}
        </>
    )
};
export default OpenSourceLibrary;