import React, { useState } from 'react';

interface ItineraryFormProps {
  onSubmit: (country: string, state: string, city: string, pincode: string, budget: string, currency: string, days: string, interests: string) => void;
  isLoading: boolean;
}

const currencies = [
  { code: 'USD', name: 'United States Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
];


const ItineraryForm: React.FC<ItineraryFormProps> = ({ onSubmit, isLoading }) => {
  const [country, setCountry] = useState('France');
  const [state, setState] = useState('');
  const [city, setCity] = useState('Paris');
  const [pincode, setPincode] = useState('');
  const [budget, setBudget] = useState('1000');
  const [currency, setCurrency] = useState('EUR');
  const [days, setDays] = useState('3');
  const [interests, setInterests] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(country, state, city, pincode, budget, currency, days, interests);
  };
  
  const inputStyles = "w-full bg-slate-50 border border-slate-300 rounded-md py-2 px-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:outline-none transition duration-200";
  const labelStyles = "block text-sm font-medium text-slate-600 mb-1";


  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="country" className={labelStyles}>
              Country
            </label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputStyles}
              placeholder="e.g., France"
              required
            />
          </div>
          <div>
            <label htmlFor="state" className={labelStyles}>
              State/Region
            </label>
            <input
              type="text"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={inputStyles}
              placeholder="e.g., Île-de-France"
            />
          </div>
          <div>
            <label htmlFor="city" className={labelStyles}>
              City
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputStyles}
              placeholder="e.g., Paris"
              required
            />
          </div>
           <div>
            <label htmlFor="pincode" className={labelStyles}>
              City Code
            </label>
            <input
              type="text"
              id="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className={inputStyles}
              placeholder="e.g., 75001"
            />
          </div>
           <div>
            <label htmlFor="budget" className={labelStyles}>
              Budget
            </label>
            <input
              type="number"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={inputStyles}
              placeholder="e.g., 1500"
              required
              min="0"
            />
          </div>
           <div>
            <label htmlFor="days" className={labelStyles}>
              Duration (Days)
            </label>
            <input
              type="number"
              id="days"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className={inputStyles}
              placeholder="e.g., 5"
              required
              min="1"
              max="14"
            />
          </div>
        </div>
        <div>
            <label htmlFor="currency" className={labelStyles}>
                Currency
            </label>
            <select 
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={inputStyles}
            >
                {currencies.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
            </select>
        </div>
        <div>
            <label htmlFor="interests" className={labelStyles}>
                Preferences & Interests (Optional)
            </label>
            <input
                type="text"
                id="interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className={inputStyles}
                placeholder="e.g., art, spirituality, club, aesthetics"
            />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating My Itinerary...
            </>
          ) : (
            'Generate My Itinerary'
          )}
        </button>
      </form>
    </div>
  );
};

export default ItineraryForm;