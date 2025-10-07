import Spinner from "../loader/Spinner";
import logo from "../../assets/images/logo.svg";
import MenuIcon from "../../lib/MenuIcon";
import {useEffect} from 'react';

interface OTPModalProps {
    phone: string;
    onClose: () => void;
    onVerify: () => void;
    otp: string;
    setOtp: (value: string) => void;
    error?: string;
    backendOtp?: number | null;
    isVerfied: boolean;
}

const OTPModal: React.FC<OTPModalProps> = ({ phone, onClose, onVerify, otp, setOtp, error, isVerfied }) => {
    useEffect(()=>{
          if(otp.length === 4){
            onVerify();
          }
      },[otp]);
      
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-8">
                {/* Close button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-light"
                    >
                        <MenuIcon name="close"/>
                    </button>
                </div>

                <div className="text-center">
                    {/* Icon */}
                    <div className="mb-6">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-white">
                            <img src={logo} alt="Logo" className="w-124 object-contain" />
                            {/* <div className="text-4xl flex-inline font-bold mb-2">
                                <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">DUU</span>
                                <span className="text-black">ITT</span>
                            </div> */}
                        </div>

                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-medium text-green-500 mb-6">
                        Enter OTP Code Sent to  Sent to {phone}
                    </h2>

                    {/* OTP Input Boxes */}
                    <div className="mb-6 flex justify-center space-x-2">
                        {otp.split('').map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => {
                                    const newOtp = otp.split('');
                                    newOtp[index] = e.target.value.replace(/\D/, '');
                                    setOtp(newOtp.join(''));

                                    // Move to next box
                                    if (e.target.value && index < 5) {
                                        document.getElementById(`otp-input-${index + 1}`)?.focus();
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Backspace' && !otp[index] && index > 0) {
                                        document.getElementById(`otp-input-${index - 1}`)?.focus();
                                    }
                                }}
                                id={`otp-input-${index}`}
                                className="w-10 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ))}
                        {/* Fill empty boxes if otp length < 6 */}
                        {Array.from({ length: 4 - otp.length }).map((_, index) => (
                            <input
                                key={otp.length + index}
                                id={`otp-input-${otp.length + index}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value=""
                                onChange={(e) => {
                                    const newOtp = otp + e.target.value.replace(/\D/, '');
                                    setOtp(newOtp.slice(0, 4));

                                    if (e.target.value && otp.length + index < 3) {
                                        document.getElementById(`otp-input-${otp.length + index + 1}`)?.focus();
                                    }
                                }}
                                className="w-10 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ))}
                    </div>


                    {error && (
                        <p className="text-sm text-red-500 mb-4">{error}</p>
                    )}

                    {/* Verify Button */}

                    <button
                        onClick={onVerify}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg mt-4 transition-colors disabled:opacity-50 flex items-center justify-center"
                        disabled={isVerfied}
                    >
                        {isVerfied ? <Spinner /> : "Verify OTP"}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default OTPModal;