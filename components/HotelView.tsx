import React, { useState } from 'react';
import { Itinerary, Hotel } from '../types';
import LoadingSpinner from './LoadingSpinner';

const HotelCard: React.FC<{ hotel: Hotel }> = ({ hotel }) => (
    <div className="bg-white p-5 rounded-lg shadow-md border border-slate-200 flex flex-col">
        <div className="flex-grow">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-slate-800 mb-1">{hotel.name}</h3>
                <span className="text-sm font-bold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">{hotel.estimated_price}</span>
            </div>
            <p className="text-slate-600 text-sm mb-3">{hotel.description}</p>
        </div>
        {hotel.address && (
             <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.address)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors mt-auto pt-2"
            >
                View on Map &rarr;
            </a>
        )}
    </div>
);

interface HotelViewProps {
    itinerary: Itinerary;
    suggestions: Hotel[] | null;
    isLoading: boolean;
    error: string | null;
    onFindHotels: (minPrice: number, maxPrice: number) => void;
}

const HotelView: React.FC<HotelViewProps> = ({ itinerary, suggestions, isLoading, error, onFindHotels }) => {
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const currency = itinerary.totalEstimatedCost.replace(/[^A-Z]/g, '') || 'USD';

    const handlePresetClick = (min: number, max: number) => {
        setMinPrice(min.toString());
        setMaxPrice(max.toString());
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (minPrice && maxPrice && !isLoading) {
            onFindHotels(parseInt(minPrice, 10), parseInt(maxPrice, 10));
        }
    };

    return (
        <div className="py-12 px-4 bg-slate-50 min-h-[70vh]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-800">Hotel Suggestions for {itinerary.location.city}</h2>
                    <p className="mt-2 text-slate-600">Define your price range to find the perfect stay.</p>
                </div>

                <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border border-slate-200 mb-12">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                            <div>
                                <label htmlFor="min-price" className="block text-sm font-medium text-slate-600 mb-1">Min Price ({currency})</label>
                                <input
                                    type="number"
                                    id="min-price"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:outline-none transition duration-200"
                                    placeholder="e.g., 50"
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label htmlFor="max-price" className="block text-sm font-medium text-slate-600 mb-1">Max Price ({currency})</label>
                                <input
                                    type="number"
                                    id="max-price"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:outline-none transition duration-200"
                                    placeholder="e.g., 200"
                                    required
                                    min="0"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
                            <button type="button" onClick={() => handlePresetClick(50, 150)} className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full hover:bg-slate-300 transition-colors">Budget</button>
                            <button type="button" onClick={() => handlePresetClick(150, 300)} className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full hover:bg-slate-300 transition-colors">Mid-Range</button>
                            <button type="button" onClick={() => handlePresetClick(300, 1000)} className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full hover:bg-slate-300 transition-colors">Luxury</button>
                        </div>
                        <div className="mt-6">
                            <button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center">
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Searching...
                                    </>
                                ) : (
                                    'Find Hotels'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {isLoading && (
                    <div className="pt-10">
                        <LoadingSpinner />
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">
                        <strong className="font-bold">Oops! </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                {suggestions && !isLoading && (
                    <div>
                        {suggestions.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {suggestions.map((hotel) => <HotelCard key={hotel.name} hotel={hotel} />)}
                            </div>
                        ) : (
                            <div className="text-center text-slate-500 p-8 bg-white rounded-lg border border-dashed border-slate-300">
                                <p>No hotels found for the selected price range. Please try different values.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HotelView;
