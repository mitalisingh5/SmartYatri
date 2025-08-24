import React from 'react';
import type { Itinerary, DayPlan, Activity, Dining } from '../types';

const MapPinIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-rose-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const SunIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-orange-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
  </svg>
);

const DiningIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-teal-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l.383-1.437M18 5.25v15.75m-1.28-15.75-3.412 12.356M16.72 5.25-3.412 17.606" />
  </svg>
);

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => {
    return (
        <div className="bg-white/60 rounded-lg border border-slate-200 transform hover:scale-[1.02] transition-transform duration-300 p-4">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-slate-800">{activity.time}</h4>
                <span className="text-sm font-semibold bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">{activity.estimated_cost}</span>
            </div>
            <p className="text-slate-700 font-medium">{activity.description}</p>
            {activity.address && (
                <div className="flex items-center mt-2 text-slate-500 text-sm">
                    <MapPinIcon />
                    <span>{activity.address}</span>
                </div>
            )}
        </div>
    );
};

const DiningCard: React.FC<{ dining: Dining }> = ({ dining }) => (
    <div className="bg-white/60 p-4 rounded-lg border border-slate-200 h-full">
        <h4 className="text-xl font-bold mb-3 flex items-center text-teal-600"><DiningIcon />Dining</h4>
        <div className="space-y-3">
            <div>
                <h5 className="font-semibold text-slate-800">Lunch: {dining.lunch.name}</h5>
                <p className="text-slate-600 text-sm">{dining.lunch.description}</p>
            </div>
             <div className="border-t border-slate-200 my-2"></div>
            <div>
                <h5 className="font-semibold text-slate-800">Dinner: {dining.dinner.name}</h5>
                <p className="text-slate-600 text-sm">{dining.dinner.description}</p>
            </div>
        </div>
    </div>
);

const DayPlanCard: React.FC<{ dayPlan: DayPlan }> = ({ dayPlan }) => (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200 shadow-lg animate-fade-in">
        <div className="border-b border-slate-200 pb-4 mb-4">
            <h2 className="text-3xl font-bold text-slate-800">Day {dayPlan.day}: <span className="text-orange-600">{dayPlan.theme}</span></h2>
            <p className="text-slate-500 mt-1">{dayPlan.summary}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xl font-bold flex items-center text-orange-600"><SunIcon />Activities</h3>
                {dayPlan.activities.map((activity, index) => (
                    <ActivityCard key={index} activity={activity} />
                ))}
            </div>
            <div className="lg:col-span-1">
                <DiningCard dining={dayPlan.dining} />
            </div>
        </div>
    </div>
);

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onSave: (itinerary: Itinerary) => void;
  isSaved: boolean;
  onViewSavedItinerary: (itinerary: Itinerary) => void;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, onSave, isSaved, onViewSavedItinerary }) => {
  return (
    <div className="mt-10 animate-fade-in-up">
      <header className="text-center mb-8 relative">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800">
          {itinerary.tripTitle}
        </h1>
        <p className="mt-2 text-xl text-slate-600 font-semibold">{itinerary.totalEstimatedCost}</p>
        <div className="mt-6 flex justify-center">
            {isSaved ? (
                <button
                    onClick={() => onViewSavedItinerary(itinerary)}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center space-x-2"
                >
                    <span>View Saved Itinerary</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>
            ) : (
                <button 
                    onClick={() => onSave(itinerary)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center space-x-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    <span>Save to My Trips</span>
                </button>
            )}
        </div>
      </header>
      <div className="space-y-8">
        {itinerary.days.map((day) => (
          <DayPlanCard key={day.day} dayPlan={day} />
        ))}
      </div>
    </div>
  );
};

export default ItineraryDisplay;
