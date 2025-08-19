import { useState, useEffect, } from "react";
import MenuIcon from "../../lib/MenuIcon";
import { toast } from "react-toastify";
interface FileUploadProps {
    name: string;
    label: string;
    onChange: (file: File) => void;
    file?: File | null;
    required?: boolean;
    disabled?: boolean;
}
const FileUpload = ({ name, label, onChange, file, required, disabled }: FileUploadProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = e.target.files?.[0];
        if (!newFile) return;

        // Reset value so selecting the same file again still triggers onChange
        e.target.value = "";

        // Validate size
        if (newFile.size > 10 * 1024 * 1024) {
            toast.error("File size exceeds 10MB");
            return;
        }

        // Validate type
        const allowedTypes = ["image/png", "image/jpeg"];
        if (!allowedTypes.includes(newFile.type)) {
            toast.error("Only PNG or JPEG files are allowed");
            return;
        }

        onChange(newFile); // tell parent about new file
    };

    // Build preview URL whenever file changes
    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }

        if (typeof file === "string") {
            setPreviewUrl(`${import.meta.env.VITE_BACKEND_BASE_URL}/${file}`);
        } else {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            return () => URL.revokeObjectURL(objectUrl); // cleanup old url
        }
    }, [file]);

    return (
        <div className="mt-4">
            <label className="block mb-1 text-sm font-medium">{label} {required && <span className="text-red-500">*</span>}</label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center space-y-3">
                {/* Uploaded File Preview */}
                {file && previewUrl && (
                    <div
                        onClick={() => setPreviewOpen(true)}
                        className="w-full h-[200px] space-x-2 cursor-pointer hover:underline"
                    >
                        {file?.type?.startsWith?.("image/") ||
                             file?.name?.endsWith(".png") ||
                             file?.name?.endsWith(".jpg") ? (
                            <img
                                src={previewUrl}
                                alt="preview"
                                crossOrigin="anonymous"
                                className="h-full w-full object-cover rounded"
                            />
                        ) : (
                            <span className="w-full h-[200px] text-sm text-blue-600 space-x-2">
                                {/* PDF Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-full h-full text-red-600"
                                >
                                    <path d="M6 2a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm8 1.5L18.5 8H14V3.5z" />
                                    <text
                                        x="7"
                                        y="17"
                                        fontSize="6"
                                        fontWeight="bold"
                                        fill="currentColor"
                                    >
                                        PDF
                                    </text>
                                </svg>
                                {/* <span>{file.name || "View File"}</span> */}
                            </span>
                        )}
                    </div>
                )}
          
                <input
                    id={name}
                    type="file"
                    accept="image/png,image/jpeg,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={disabled}
                />

                {!disabled && (
                    <label
                        htmlFor={name}
                        className="bg-purple-600 text-white px-6 py-2 rounded-full cursor-pointer font-semibold hover:bg-purple-700 transition"
                    >
                        Browse Files
                    </label>
                )}
            </div>

            {/* Preview Popup */}
            {previewOpen && previewUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full p-4">
                        <button
                            onClick={() => setPreviewOpen(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-black"
                        >
                            <MenuIcon name="cross" />
                        </button>

                        {file?.type?.startsWith?.("image/") ||
                             file?.name?.endsWith(".png") ||
                            file?.name?.endsWith(".jpg") ? (
                            <img
                                src={previewUrl}
                                alt="preview"
                                crossOrigin="anonymous"
                                className="max-h-[80vh] mx-auto"
                            />
                        ) : (
                            <iframe
                                src={previewUrl}
                                className="w-full h-[80vh]"
                                title="PDF Preview"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
