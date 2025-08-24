import React from 'react';
import type { Itinerary, View } from '../types';

interface MyItinerariesProps {
    itineraries: Itinerary[];
    onSelect: (itinerary: Itinerary, view: View) => void;
    onPlanNewTrip: () => void;
}

const ItineraryCard: React.FC<{ itinerary: Itinerary; onSelect: (itinerary: Itinerary, view: View) => void; }> = ({ itinerary, onSelect }) => (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 flex flex-col justify-between">
        <div>
            <h3 className="text-xl font-bold text-slate-800">{itinerary.tripTitle}</h3>
            <p className="text-slate-500 text-sm">{itinerary.location.city}, {itinerary.location.country}</p>
        </div>
        <div className="mt-4 border-t border-slate-200 pt-4 flex flex-wrap gap-2">
            <button onClick={() => onSelect(itinerary, 'itinerary_display')} className="flex-1 text-sm bg-sky-500 text-white px-3 py-2 rounded-md hover:bg-sky-600 transition-colors font-semibold min-w-[120px]">View Itinerary</button>
            <button onClick={() => onSelect(itinerary, 'map_view')} className="flex-1 text-sm bg-teal-500 text-white px-3 py-2 rounded-md hover:bg-teal-600 transition-colors font-semibold min-w-[120px]">View Map</button>
            <button onClick={() => onSelect(itinerary, 'dining_view')} className="flex-1 text-sm bg-rose-500 text-white px-3 py-2 rounded-md hover:bg-rose-600 transition-colors font-semibold min-w-[120px]">Dining Options</button>
            <button onClick={() => onSelect(itinerary, 'hotel_view')} className="flex-1 text-sm bg-indigo-500 text-white px-3 py-2 rounded-md hover:bg-indigo-600 transition-colors font-semibold min-w-[120px]">Find Hotels</button>
        </div>
    </div>
);


const MyItineraries: React.FC<MyItinerariesProps> = ({ itineraries, onSelect, onPlanNewTrip }) => {
    return (
        <div className="py-16 px-4 bg-slate-50 min-h-[70vh]">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-800">My Saved Trips</h2>
                    <p className="mt-2 text-slate-600">Here are all your planned adventures. Select one to view details.</p>
                </div>
                {itineraries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {itineraries.map(it => (
                            <ItineraryCard key={it.id} itinerary={it} onSelect={onSelect} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center bg-white border border-dashed border-slate-300 rounded-lg p-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-slate-900">No saved trips yet</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Start planning your next adventure to see your itineraries here.
                        </p>
                        <div className="mt-6">
                          <button
                            type="button"
                            onClick={onPlanNewTrip}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                          >
                            Plan a New Trip
                          </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyItineraries;
