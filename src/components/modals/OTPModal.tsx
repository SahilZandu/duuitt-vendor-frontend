import React from "react";
import logo from "../../assets/images/logo.svg";
import Button from "../Button";


interface OTPModalProps {
    phone: string;
    onClose: () => void;
    onVerify: () => void;
    otp: string;
    setOtp: (value: string) => void;
    error?: string;
    backendOtp?: number | null;
}

const OTPModal: React.FC<OTPModalProps> = ({ phone, onClose, onVerify, otp, setOtp, error }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-8">
                {/* Close button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-light"
                    >
                        ×
                    </button>
                </div>

                <div className="text-center">
                    {/* Icon */}
                    <div className="mb-6">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-white">
                            <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
                        </div>

                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-medium text-gray-800 mb-6">
                        Enter OTP Code
                    </h2>

                    {/* OTP Input */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Enter 4-digit code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-center text-lg font-medium tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Sent to {phone}
                        </p>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 mb-4">{error}</p>
                    )}

                    {/* Verify Button */}

                    <Button label="Verify OTP" onClick={onVerify} />
                   

                    {/* Resend link */}
                    <div className="mt-4">
                        
                        <button className="text-blue-500 text-sm hover:underline">
                            Didn't receive code? Resend
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPModal;