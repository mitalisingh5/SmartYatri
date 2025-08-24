import React from 'react';
import type { Itinerary, View } from '../types';

interface ItineraryDashboardProps {
    itinerary: Itinerary;
    onSelect: (itinerary: Itinerary, view: View) => void;
    onPlanNewTrip: () => void;
}

const DashboardButton: React.FC<{ onClick: () => void; className: string; children: React.ReactNode }> = ({ onClick, className, children }) => (
    <button
        onClick={onClick}
        className={`w-full text-lg text-white px-4 py-3 rounded-md transition-colors font-semibold flex items-center justify-center gap-2 shadow-md hover:scale-105 transform duration-200 ${className}`}
    >
        {children}
    </button>
);

const ItineraryDashboard: React.FC<ItineraryDashboardProps> = ({ itinerary, onSelect, onPlanNewTrip }) => {
    return (
        <div className="py-16 px-4 bg-slate-50 min-h-[70vh] flex items-center justify-center">
            <div className="max-w-3xl w-full mx-auto text-center">
                 <h2 className="text-3xl font-bold text-slate-800">Your trip to {itinerary.location.city} is saved!</h2>
                 <p className="mt-2 text-slate-600">What would you like to explore next for your trip?</p>
                 <div className="mt-8 bg-white rounded-lg shadow-lg border border-slate-200 p-8">
                     <h3 className="text-2xl font-bold text-slate-800">{itinerary.tripTitle}</h3>
                     <p className="text-slate-500 mb-6">{itinerary.location.city}, {itinerary.location.country}</p>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DashboardButton onClick={() => onSelect(itinerary, 'itinerary_display')} className="bg-sky-500 hover:bg-sky-600">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            View Itinerary
                        </DashboardButton>
                        <DashboardButton onClick={() => onSelect(itinerary, 'map_view')} className="bg-teal-500 hover:bg-teal-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 13v-6.5m6 10V7" /></svg>
                            View Map
                        </DashboardButton>
                        <DashboardButton onClick={() => onSelect(itinerary, 'dining_view')} className="bg-rose-500 hover:bg-rose-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0c-.454-.303-.977-.454-1.5-.454V8.454c.523 0 1.046-.151 1.5-.454a2.707 2.707 0 013 0 2.707 2.707 0 003 0 2.707 2.707 0 013 0 2.707 2.707 0 003 0c.454.303.977.454 1.5.454v7.092zM15 21h-6v-2h6v2z" /></svg>
                            Dining Options
                        </DashboardButton>
                        <DashboardButton onClick={() => onSelect(itinerary, 'hotel_view')} className="bg-indigo-500 hover:bg-indigo-600">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            Find Hotels
                        </DashboardButton>
                     </div>
                 </div>
                 <div className="mt-8">
                    <button onClick={onPlanNewTrip} className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:underline">
                        Or, Plan Another Trip
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                         </svg>
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default ItineraryDashboard;
