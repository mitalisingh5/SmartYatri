import React, { useState, useMemo } from 'react';
import { Itinerary, DayPlan, Activity, DiningOption } from '../types';

const MapView: React.FC<{ itinerary: Itinerary }> = ({ itinerary }) => {
    const [selectedDay, setSelectedDay] = useState<number>(itinerary.days[0]?.day || 1);

    const dayPlan = useMemo(() => {
        return itinerary.days.find(d => d.day === selectedDay);
    }, [selectedDay, itinerary.days]);

    const locationsForDay = useMemo(() => {
        if (!dayPlan) return [];

        const allActivities = dayPlan.activities.filter(a => a?.address);
        const lunch = (dayPlan.dining.lunch?.address) ? dayPlan.dining.lunch : null;
        const dinner = (dayPlan.dining.dinner?.address) ? dayPlan.dining.dinner : null;

        const morningActivities = allActivities.filter(a => a.time.toLowerCase() === 'morning');
        const afternoonActivities = allActivities.filter(a => a.time.toLowerCase() === 'afternoon');
        const eveningActivities = allActivities.filter(a => a.time.toLowerCase() === 'evening');

        const orderedLocations = [
            ...morningActivities,
            ...(lunch ? [lunch] : []),
            ...afternoonActivities,
            ...(dinner ? [dinner] : []),
            ...eveningActivities,
        ];

        return orderedLocations as (Activity | DiningOption)[];
    }, [dayPlan]);


    const mapSrc = useMemo(() => {
        const validLocations = locationsForDay.filter(loc => loc.address);

        if (validLocations.length === 0) {
            return `https://www.google.com/maps/embed/v1/place?key=${process.env.API_KEY}&q=${encodeURIComponent(`${itinerary.location.city},${itinerary.location.country}`)}`;
        }

        if (validLocations.length === 1) {
            return `https://www.google.com/maps/embed/v1/place?key=${process.env.API_KEY}&q=${encodeURIComponent(validLocations[0].address!)}`;
        }

        const origin = validLocations[0].address!;
        const destination = validLocations[validLocations.length - 1].address!;
        const waypoints = validLocations.slice(1, -1).map(loc => loc.address!).join('|');

        let url = `https://www.google.com/maps/embed/v1/directions?key=${process.env.API_KEY}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
        
        if (waypoints) {
            url += `&waypoints=${encodeURIComponent(waypoints)}`;
        }
        
        return url;
    }, [locationsForDay, itinerary.location]);

    const createMapLink = (address: string) => {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    };

    return (
        <div className="py-12 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">Map View: {itinerary.tripTitle}</h2>
                    <p className="mt-2 text-slate-600">Explore your daily routes and locations on the map.</p>
                </div>

                <div className="mb-6 flex justify-center flex-wrap gap-2">
                    {itinerary.days.map(day => (
                        <button
                            key={day.day}
                            onClick={() => setSelectedDay(day.day)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                                selectedDay === day.day 
                                ? 'bg-orange-500 text-white shadow' 
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-300'
                            }`}
                        >
                            Day {day.day}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 rounded-lg shadow-lg overflow-hidden border border-slate-200">
                        <iframe
                            key={mapSrc} // Force re-render on src change
                            width="100%"
                            height="500"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={mapSrc}>
                        </iframe>
                    </div>

                    <div className="md:col-span-1 bg-slate-50 rounded-lg p-4 border border-slate-200 max-h-[500px] overflow-y-auto">
                        <h3 className="text-xl font-bold text-slate-700 mb-4">Locations for Day {selectedDay}</h3>
                        {locationsForDay.length > 0 ? (
                            <ol className="space-y-3 list-decimal list-inside">
                                {locationsForDay.map((loc, index) => (
                                    <li key={index} className="bg-white p-3 rounded-md shadow-sm border border-slate-200">
                                        <span className="font-semibold text-slate-800">{'name' in loc ? loc.name : loc.description}</span>
                                        <p className="text-sm text-slate-500 mb-2 pl-5">{loc.address}</p>
                                        <a 
                                            href={createMapLink(loc.address!)} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors ml-5"
                                        >
                                            View on Google Maps &rarr;
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        ) : (
                             <div className="text-center text-slate-500 p-8">
                                <p>No address information available for Day {selectedDay}.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapView;