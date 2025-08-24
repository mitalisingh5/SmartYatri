
import React, { useState, useCallback, useEffect } from 'react';
import ItineraryForm from './components/ItineraryForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Auth from './components/Auth';
import Chatbot from './components/Chatbot';
import Header from './components/Header';
import Footer from './components/Footer';
import MyItineraries from './components/MyItineraries';
import MapView from './components/MapView';
import DiningView from './components/DiningView';
import HotelView from './components/HotelView';
import ItineraryDashboard from './components/ItineraryDashboard';
import { generateItinerary, validateLocation, generateHotelSuggestions } from './services/geminiService';
import type { Itinerary, Hotel, View } from './types';

const FeatureCard: React.FC<{ imgSrc: string; title: string; children: React.ReactNode }> = ({ imgSrc, title, children }) => (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        <img src={imgSrc} alt={title} className="w-full h-40 object-cover"/>
        <div className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-600 text-sm">{children}</p>
        </div>
    </div>
);


const App: React.FC = () => {
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  const [currentView, setCurrentView] = useState<View>('form');
  const [savedItineraries, setSavedItineraries] = useState<Itinerary[]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  
  const [hotelSuggestions, setHotelSuggestions] = useState<Hotel[] | null>(null);
  const [isHotelLoading, setIsHotelLoading] = useState<boolean>(false);


  // Load saved itineraries from local storage on component mount
  useEffect(() => {
    const storedItineraries = localStorage.getItem('savedItineraries');
    if (storedItineraries) {
      setSavedItineraries(JSON.parse(storedItineraries));
    }
  }, []);

  // Save itineraries to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('savedItineraries', JSON.stringify(savedItineraries));
  }, [savedItineraries]);

  const handleGenerateItinerary = useCallback(async (country: string, state: string, city: string, pincode: string, budget: string, currency: string, days: string, interests:string) => {
    setIsLoading(true);
    setError(null);
    setGeneratedItinerary(null);
    try {
      const isValidLocation = await validateLocation(country, state, city, pincode);
      if (!isValidLocation) {
        setError("The location details provided seem to be incorrect. Please check the Country, State, City, and Pincode and try again.");
        setIsLoading(false);
        return;
      }

      const itineraryData = await generateItinerary(country, state, city, pincode, budget, currency, days, interests);
      setGeneratedItinerary({ ...itineraryData, id: Date.now().toString() });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setGeneratedItinerary(null);
    setError(null);
    setUsername('');
    setCurrentView('form');
    setSelectedItinerary(null);
  }

  const handleAuthSuccess = (name: string) => {
    setIsAuthenticated(true);
    setUsername(name);
  };
  
  const handleSaveItinerary = (itineraryToSave: Itinerary) => {
    if (!savedItineraries.some(it => it.id === itineraryToSave.id)) {
        setSavedItineraries(prev => [...prev, itineraryToSave]);
    }
  };
  
  const handleSelectItinerary = (itinerary: Itinerary, view: View) => {
      if (selectedItinerary?.id !== itinerary.id) {
          setHotelSuggestions(null); // Clear previous hotel data if itinerary changes
      }
      setSelectedItinerary(itinerary);
      setCurrentView(view);
  }
  
  const handleViewSavedItinerary = (itinerary: Itinerary) => {
      setSelectedItinerary(itinerary);
      setCurrentView('itinerary_dashboard');
  };

  const handleFindHotels = async (minPrice: number, maxPrice: number) => {
    if (!selectedItinerary) return;

    setIsHotelLoading(true);
    setError(null);
    setHotelSuggestions(null); // Clear previous results before fetching new ones
    try {
        const currency = selectedItinerary.totalEstimatedCost.replace(/[^A-Z]/g, '') || 'USD';
        const hotels = await generateHotelSuggestions(selectedItinerary.location.city, selectedItinerary.location.country, currency, minPrice, maxPrice);
        setHotelSuggestions(hotels);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch hotel suggestions.');
    } finally {
        setIsHotelLoading(false);
    }
  };
  
  const renderMainContent = () => {
      switch (currentView) {
          case 'my_itineraries':
              return <MyItineraries 
                        itineraries={savedItineraries}
                        onSelect={handleSelectItinerary}
                        onPlanNewTrip={() => setCurrentView('form')}
                     />;
          case 'itinerary_dashboard':
               return selectedItinerary && <ItineraryDashboard
                        itinerary={selectedItinerary}
                        onSelect={handleSelectItinerary}
                        onPlanNewTrip={() => {
                            setGeneratedItinerary(null);
                            setCurrentView('form');
                        }}
                    />;
          case 'itinerary_display':
              return selectedItinerary && <div className="max-w-5xl mx-auto px-4 pb-16"><ItineraryDisplay 
                                            itinerary={selectedItinerary} 
                                            onSave={handleSaveItinerary} 
                                            isSaved={savedItineraries.some(it => it.id === selectedItinerary.id)}
                                            onViewSavedItinerary={handleViewSavedItinerary}
                                         /></div>;
          case 'map_view':
              return selectedItinerary && <MapView itinerary={selectedItinerary} />;
          case 'dining_view':
              return selectedItinerary && <DiningView itinerary={selectedItinerary} />;
          case 'hotel_view':
              return selectedItinerary && <HotelView 
                                            itinerary={selectedItinerary} 
                                            suggestions={hotelSuggestions}
                                            isLoading={isHotelLoading}
                                            error={error}
                                            onFindHotels={handleFindHotels}
                                          />;
          case 'form':
          default:
              return (
                <>
                    {/* Hero Section */}
                    <section 
                        className="relative text-center py-24 px-4 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=2000&auto=format&fit=crop')" }}
                    >
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
                        <div className="relative max-w-4xl mx-auto">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white -rotate-45 drop-shadow-lg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                </svg>
                                 <h2 className="text-xl font-bold tracking-widest text-orange-400 uppercase drop-shadow-lg">
                                    smartyatri-Namaste {username}
                                </h2>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
                                Transform Your Travel Dreams
                            </h1>
                            <p className="mt-6 text-lg text-slate-200 max-w-3xl mx-auto drop-shadow-md">
                                Experience AI-powered precision meets wanderlust inspiration. Create personalized itineraries that turn overwhelming trip planning into effortless discovery.
                            </p>
                        </div>
                    </section>
                     {/* Form Section */}
                    <section id="plan-trip" className="py-16 px-4">
                         <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-slate-800">Plan Your Perfect Journey</h2>
                            <p className="mt-2 text-slate-600">Tell us your destination and preferences, and our AI will craft a personalized itinerary tailored to your budget and interests.</p>
                         </div>
                         <div className="max-w-3xl mx-auto">
                            <ItineraryForm onSubmit={handleGenerateItinerary} isLoading={isLoading} />
                         </div>
                    </section>

                    {/* Results Section */}
                    {(isLoading || error || generatedItinerary) && (
                        <section className="px-4 pb-16">
                            <div className="max-w-5xl mx-auto">
                              {isLoading && <LoadingSpinner />}
                              {error && !isHotelLoading && ( // Don't show form error while hotel is loading
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">
                                  <strong className="font-bold">Oops! </strong>
                                  <span className="block sm:inline">{error}</span>
                                </div>
                              )}
                              {generatedItinerary && <ItineraryDisplay 
                                                        itinerary={generatedItinerary} 
                                                        onSave={handleSaveItinerary} 
                                                        isSaved={savedItineraries.some(it => it.id === generatedItinerary.id)}
                                                        onViewSavedItinerary={handleViewSavedItinerary}
                                                    />}
                            </div>
                        </section>
                    )}
                    
                    {/* Why Choose Us Section */}
                    <section className="bg-slate-50 py-16 px-4 border-t border-slate-200">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-800">Why Choose Smart Trip Planner</h2>
                            <p className="mt-2 text-slate-600 max-w-2xl mx-auto">Discover how our AI-powered platform transforms your travel planning experience from overwhelming to effortless.</p>
                        </div>
                        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard imgSrc="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format=fit=crop" title="AI-Powered Planning">
                                Our intelligent algorithms analyze your preferences, budget, and destination to create perfectly tailored itineraries that maximize your travel experience.
                            </FeatureCard>
                             <FeatureCard imgSrc="https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2000&auto=format=fit=crop" title="Interactive Maps">
                                Visualize your journey with detailed maps showing activity locations, dining spots, and optimal routes to help you navigate like a local.
                            </FeatureCard>
                             <FeatureCard imgSrc="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format=fit=crop" title="Curated Dining">
                                Discover authentic local flavors with personalized restaurant recommendations that match your budget and dietary preferences.
                            </FeatureCard>
                        </div>
                    </section>
                </>
              );
      }
  }

  if (!isAuthenticated) {
      return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onLogout={handleLogout} setCurrentView={setCurrentView} />
      <main>
        {renderMainContent()}
      </main>
      <Footer setCurrentView={setCurrentView} />
      <Chatbot />
    </div>
  );
};

export default App;
