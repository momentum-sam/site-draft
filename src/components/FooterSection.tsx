import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Linkedin, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import LogoLight from '../assets/logo/Logo-Light.svg';

export const FooterSection: React.FC = () => {
    return (
        <section className="relative z-20 pt-20 pb-8 px-5 md:px-10 lg:px-16" style={{ backgroundColor: 'var(--bg-dark)' }}>
            <div className="max-w-[1640px] mx-auto">
                {/* Contact Form Card */}
                <motion.div
                    id="contact-form"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#F5F5F5] text-black rounded-none md:rounded-[32px] p-8 md:p-16 mb-20 -mx-5 md:mx-0"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                        {/* Left Column */}
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-4xl md:text-6xl font-normal tracking-tight mb-6 leading-[1.1]">
                                    Let's partner to<br />
                                    move your<br />
                                    business forward.
                                </h2>
                                <p className="text-lg text-gray-600 mb-12">
                                    Leave your details and we'll get<br />
                                    back to you.
                                </p>
                            </div>

                            <div className="hidden lg:block">
                                <p className="text-lg mb-2">Looking to join our team?</p>
                                <a href="#" className="text-lg underline decoration-1 underline-offset-4 hover:text-gray-600 transition-colors">
                                    Visit our Careers page
                                </a>
                            </div>
                        </div>

                        {/* Right Column - Form */}
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-900">First name*</label>
                                    <input
                                        type="text"
                                        placeholder="First name"
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FDB447] focus:border-transparent transition-all placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-900">Last name*</label>
                                    <input
                                        type="text"
                                        placeholder="Last name"
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FDB447] focus:border-transparent transition-all placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-900">Job title</label>
                                    <input
                                        type="text"
                                        placeholder="Enter job title"
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FDB447] focus:border-transparent transition-all placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-900">Company name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter company name"
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FDB447] focus:border-transparent transition-all placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-900">Work email*</label>
                                    <input
                                        type="email"
                                        placeholder="Enter email"
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FDB447] focus:border-transparent transition-all placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-900">How can we help?*</label>
                                    <div className="relative">
                                        <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FDB447] focus:border-transparent transition-all appearance-none text-gray-500">
                                            <option value="" disabled selected>Please choose an option</option>
                                            <option value="project">Start a Project</option>
                                            <option value="hiring">Hiring</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-900">Let us know more about what you're looking for*</label>
                                <textarea
                                    rows={4}
                                    placeholder="Write your message"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FDB447] focus:border-transparent transition-all placeholder:text-gray-300 resize-none"
                                ></textarea>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-[#FDB447] text-black font-medium rounded-full hover:bg-[#e5a03d] transition-colors duration-300"
                                >
                                    Send message
                                </button>
                            </div>

                            <div className="lg:hidden pt-8 border-t border-gray-200 mt-8">
                                <p className="text-lg mb-2">Looking to join our team?</p>
                                <a href="#" className="text-lg underline decoration-1 underline-offset-4 hover:text-gray-600 transition-colors">
                                    Visit our Careers page
                                </a>
                            </div>
                        </form>
                    </div>
                </motion.div>

                {/* Footer Content */}
                <div className="text-white pt-12 pb-8 border-t border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                        {/* Logo Column */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-1">
                            <div className="mb-8 flex items-center gap-1">
                                <img
                                    src={LogoLight}
                                    alt="HTEC Momentum"
                                    className="h-6"
                                />
                            </div>

                            <div className="flex flex-col space-y-4">
                                <a href="#" className="flex items-center group text-lg hover:text-[#FDB447] transition-colors">
                                    Capabilities <ArrowRight className="ml-2 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                </a>
                                <a href="#" className="flex items-center group text-lg hover:text-[#FDB447] transition-colors">
                                    Work <ArrowRight className="ml-2 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                </a>
                                <a href="#" className="flex items-center group text-lg hover:text-[#FDB447] transition-colors">
                                    Careers <ArrowRight className="ml-2 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                </a>
                                <a href="#" className="flex items-center group text-lg hover:text-[#FDB447] transition-colors">
                                    Insights <ArrowRight className="ml-2 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                </a>
                            </div>

                            <p className="mt-12 text-gray-400">We would love to hear more from you!</p>
                            <a href="#" className="mt-2 inline-block text-white hover:text-[#FDB447] transition-colors">Partner with us</a>
                        </div>

                        {/* Locations */}
                        <div className="space-y-4">
                            <h4 className="text-white font-medium mb-4">Palo Alto</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                300 8th Avenue, Suite 200<br />
                                San Mateo, CA 94401, USA
                            </p>
                            <div className="pt-4 text-sm text-gray-400">
                                <p>Phone: +1 415 490 8175</p>
                                <p>Email: office-sf@htecgroup.com</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-white font-medium mb-4">London</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                74 Rivington Street<br />
                                London EC2A 3AY, UK
                            </p>
                            <div className="pt-4 text-sm text-gray-400">
                                <p>Phone: +44 203 818 5916</p>
                                <p>Email: office-uk@htecgroup.com</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-white font-medium mb-4">Belgrade</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Milutina Milankovica, 7Đ<br />
                                Belgrade 11070, Serbia
                            </p>
                            <div className="pt-4 text-sm text-gray-400">
                                <p>Phone: +381 11 228 1182</p>
                                <p>Email: office-bg@htecgroup.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-sm text-gray-500">
                        <div className="mb-4 md:mb-0">
                            © 2025 HTEC. All rights reserved.
                        </div>

                        <div className="flex space-x-6 mb-4 md:mb-0">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                            <a href="#" className="hover:text-white transition-colors">Quality First</a>
                        </div>

                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-[#FDB447] transition-colors"><Linkedin size={20} /></a>
                            <a href="#" className="hover:text-[#FDB447] transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-[#FDB447] transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-[#FDB447] transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-[#FDB447] transition-colors"><Youtube size={20} /></a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
