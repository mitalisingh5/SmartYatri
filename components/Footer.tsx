import React from 'react';
import type { View } from '../types';

interface FooterProps {
    setCurrentView: (view: View) => void;
}


const Footer: React.FC<FooterProps> = ({ setCurrentView }) => (
    <footer className="bg-slate-100 border-t border-slate-200">
        <div className="container mx-auto px-4 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                     <div className="flex items-center space-x-2 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-orange-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                        <span className="text-lg font-bold text-slate-800">Smart Trip Planner</span>
                    </div>
                    <p className="text-slate-600 text-sm max-w-sm">Transform your travel dreams into perfectly crafted itineraries with AI-powered precision and wanderlust inspiration.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-800 mb-3">Planning</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li><button onClick={() => setCurrentView('form')} className="hover:text-orange-500">Plan New Trip</button></li>
                        <li><button onClick={() => setCurrentView('my_itineraries')} className="hover:text-orange-500">My Itinerary</button></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-slate-800 mb-3">Connect with us</h4>
                    <div className="flex items-center space-x-4">
                        <a href="#" aria-label="Twitter" className="text-slate-500 hover:text-orange-500 transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a href="#" aria-label="Facebook" className="text-slate-500 hover:text-orange-500 transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a href="#" aria-label="Instagram" className="text-slate-500 hover:text-orange-500 transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                               <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 012.122 1.256A4.902 4.902 0 0121.48 5.69a4.902 4.902 0 01.465 2.427c.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808a4.902 4.902 0 01-.465 2.427 4.902 4.902 0 01-1.256 2.122 4.902 4.902 0 01-2.122 1.256 4.902 4.902 0 01-2.427.465c-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06a4.902 4.902 0 01-2.427-.465 4.902 4.902 0 01-2.122-1.256 4.902 4.902 0 01-1.256-2.122A4.902 4.902 0 012.06 15.808c-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808a4.902 4.902 0 01.465-2.427A4.902 4.902 0 013.72 5.69 4.902 4.902 0 015.842 4.434a4.902 4.902 0 012.427-.465C9.285 2.013 9.64 2 12 2h.315zM12 4.867c-2.43 0-2.75.01-3.71.055a3.11 3.11 0 00-1.815.666 3.11 3.11 0 00-1.135 1.134 3.11 3.11 0 00-.666 1.815c-.045.96-.055 1.28-.055 3.71s.01 2.75.055 3.71a3.11 3.11 0 00.666 1.815 3.11 3.11 0 001.135 1.134 3.11 3.11 0 001.815.666c.96.045 1.28.055 3.71.055s2.75-.01 3.71-.055a3.11 3.11 0 001.815-.666 3.11 3.11 0 001.134-1.134 3.11 3.11 0 00.666-1.815c.045-.96.055-1.28.055-3.71s-.01-2.75-.055-3.71a3.11 3.11 0 00-.666-1.815 3.11 3.11 0 00-1.134-1.134 3.11 3.11 0 00-1.815-.666c-.96-.045-1.28-.055-3.71-.055h-.315zM12 8.412a3.588 3.588 0 100 7.176 3.588 3.588 0 000-7.176zm0 5.4a1.812 1.812 0 110-3.624 1.812 1.812 0 010 3.624zM16.804 6.11a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" />
                            </svg>
                        </a>
                         <a href="#" aria-label="LinkedIn" className="text-slate-500 hover:text-orange-500 transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                               <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-300 text-center text-sm text-slate-500 flex justify-between">
                <p>&copy; 2024 Smart Trip Planner. Location with wanderlust and precision.</p>
                <div>
                  <a href="#" className="hover:text-orange-500 mr-4">Privacy Policy</a>
                  <a href="#" className="hover:text-orange-500">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
