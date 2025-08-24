import React from 'react';
import { Itinerary, DiningOption } from '../types';

const DiningCard: React.FC<{ title: string; option: DiningOption }> = ({ title, option }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h4 className="text-lg font-bold text-slate-500 mb-1">{title}</h4>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">{option.name}</h3>
        <p className="text-slate-600 mb-3">{option.description}</p>
        {option.address && (
             <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(option.address)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors"
            >
                View on Map &rarr;
            </a>
        )}
    </div>
);


const DiningView: React.FC<{ itinerary: Itinerary }> = ({ itinerary }) => {
    return (
        <div className="py-12 px-4 bg-slate-50 min-h-[70vh]">
            <div className="max-w-4xl mx-auto">
                 <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-800">Dining Options for {itinerary.tripTitle}</h2>
                    <p className="mt-2 text-slate-600">A curated list of culinary experiences for your trip.</p>
                </div>
                <div className="space-y-8">
                    {itinerary.days.map(day => (
                        <div key={day.day} className="p-6 bg-white rounded-xl shadow-lg border border-slate-200">
                            <h3 className="text-2xl font-bold text-orange-600 mb-4">Day {day.day}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DiningCard title="Lunch" option={day.dining.lunch} />
                                <DiningCard title="Dinner" option={day.dining.dinner} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DiningView;
