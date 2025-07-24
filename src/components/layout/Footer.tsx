const Footer = () => {
    return (

        <footer className="bg-purple-700 text-white py-12 px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    <div className="col-span-1">
                        <div className="text-3xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">DUU</span>
                            <span className="text-white">ITT</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-white">For Restaurants</h4>
                        <div className="space-y-2 text-purple-200">
                            <p className="hover:text-white cursor-pointer">Partner With Us</p>
                            <a
                                href="https://drive.google.com/file/d/1VRzcB28w3yfe8-gRC70m8fqj4EGe9LAt/view?usp=sharing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:underline"
                            >
                                Download App
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-white">For Delivery Partners</h4>
                        <div className="space-y-2 text-purple-200">
                            <p className="hover:text-white cursor-pointer">Partner With Us</p>
                            <a
                                href="https://drive.google.com/file/d/1NDMuQOHo2X21gg3X04aN_jMtOAcSe80Z/view?usp=sharing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:underline"
                            >
                                Download App
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-white">Learn More</h4>
                        <div className="space-y-2 text-purple-200">
                            <p className="hover:text-white cursor-pointer">Terms & Conditions</p>
                            <p className="hover:text-white cursor-pointer">Privacy Policy</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-white">Social Links</h4>
                        <div className="flex gap-3">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-500 cursor-pointer">
                                <span className="text-white text-sm">f</span>
                            </div>
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-500 cursor-pointer">
                                <span className="text-white text-sm">i</span>
                            </div>
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-500 cursor-pointer">
                                <span className="text-white text-sm">t</span>
                            </div>
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-500 cursor-pointer">
                                <span className="text-white text-sm">x</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-purple-600 mt-8 pt-6 text-center">
                    <p className="text-purple-200">Copyright © 2025 Duuitt</p>
                </div>
            </div>
        </footer>
    );

};
export default Footer;