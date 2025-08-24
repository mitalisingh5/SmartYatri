import { GoogleGenAI, Type } from "@google/genai";
import { Itinerary, Hotel } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const validateLocation = async (country: string, state: string, city: string, pincode: string): Promise<boolean> => {
  const locationParts = [city, pincode, state, country].filter(Boolean);
  if (locationParts.length < 2) return true; // Not enough info to validate, assume true

  const prompt = `Given the following location details: Country: "${country}", State/Region: "${state}", City: "${city}", Area Pincode: "${pincode}". Do these details correspond to a valid, real-world geographical location where the city, state, and pincode all belong to the specified country? Please consider that State/Region and Pincode are optional and might be empty strings. If the combination is valid, respond with only the word "true". If it is invalid or nonsensical, respond with only the word "false".`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            temperature: 0,
        },
    });

    const validationResult = response.text.trim().toLowerCase();
    return validationResult === 'true';
  } catch (error) {
    console.error("Error validating location:", error);
    // In case of a validation API error, we'll assume the location is valid to not block the user.
    // The itinerary generation might fail later with a more specific error.
    return true;
  }
};


const itinerarySchema = {
  type: Type.OBJECT,
  properties: {
    tripTitle: {
      type: Type.STRING,
      description: "A creative and catchy title for the trip. e.g. '3-Day Parisian Adventure'"
    },
    totalEstimatedCost: {
      type: Type.STRING,
      description: "A string summarizing the total estimated cost for the trip, factoring in the user's budget and specified currency. e.g. 'Approximately 950 EUR'"
    },
    location: {
      type: Type.OBJECT,
      description: "The primary location of the trip.",
      properties: {
        city: { type: Type.STRING, description: "The main city of the trip." },
        country: { type: Type.STRING, description: "The country of the trip." },
      },
      required: ["city", "country"]
    },
    days: {
      type: Type.ARRAY,
      description: "An array of daily plans.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: "The day number (e.g., 1, 2, 3)." },
          theme: { type: Type.STRING, description: "A short, engaging theme for the day. e.g., 'Art & History Exploration'" },
          summary: { type: Type.STRING, description: "A brief one-sentence summary of the day's activities." },
          activities: {
            type: Type.ARRAY,
            description: "A list of activities for the day.",
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING, description: "Time of day (e.g., Morning, Afternoon, Evening)." },
                description: { type: Type.STRING, description: "A concise description of the activity." },
                estimated_cost: { type: Type.STRING, description: "Estimated cost for this activity in the specified currency. e.g., '€20' or 'Free'" },
                details: { type: Type.STRING, description: "Optional: A brief detail, like an address or booking tip." },
                address: { type: Type.STRING, description: "The full, real-world address of the activity location for mapping purposes."}
              },
               required: ["time", "description", "estimated_cost", "address"]
            }
          },
          dining: {
            type: Type.OBJECT,
            description: "Dining recommendations for the day.",
            properties: {
              lunch: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the restaurant or cafe for lunch." },
                  description: { type: Type.STRING, description: "A brief description of the lunch spot." },
                  address: { type: Type.STRING, description: "The full, real-world address of the restaurant for mapping purposes."}
                },
                 required: ["name", "description", "address"]
              },
              dinner: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the restaurant for dinner." },
                  description: { type: Type.STRING, description: "A brief description of the dinner spot." },
                  address: { type: Type.STRING, description: "The full, real-world address of the restaurant for mapping purposes."}
                },
                required: ["name", "description", "address"]
              }
            },
            required: ["lunch", "dinner"]
          }
        },
        required: ["day", "theme", "summary", "activities", "dining"]
      }
    }
  },
  required: ["tripTitle", "totalEstimatedCost", "days", "location"]
};


export const generateItinerary = async (country: string, state: string, city: string, pincode: string, budget: string, currency: string, days: string, interests: string): Promise<Omit<Itinerary, 'id'>> => {
  const location = [city, pincode, state, country].filter(Boolean).join(', ');
  
  let prompt = `Create a detailed travel itinerary for a trip to ${location} for ${days} days with a budget of ${budget} ${currency}.
The itinerary should be well-structured, creative, and practical. For every activity and dining location, you MUST provide a valid, real-world address suitable for use in Google Maps.`;

  if (interests) {
    prompt += `\nPlease tailor the itinerary to the user's preferences and interests: ${interests}.`;
  }
  
  prompt += `\nFor each day, provide a theme, a summary, a list of activities (morning, afternoon, evening) with estimated costs in ${currency}, and specific recommendations for lunch and dinner that fit the budget.
Ensure the total estimated cost aligns with the provided budget and is also in ${currency}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.8,
        topP: 0.9,
      },
    });

    const jsonText = response.text.trim();
    const itineraryData = JSON.parse(jsonText);
    
    return itineraryData as Omit<Itinerary, 'id'>;

  } catch (error) {
    console.error("Error generating itinerary:", error);
    let errorMessage = "An unknown error occurred while generating the itinerary.";
    if (error instanceof Error) {
        errorMessage = `Failed to generate itinerary. Gemini API error: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
};


const hotelSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The name of the hotel." },
        description: { type: Type.STRING, description: "A brief, one or two sentence description of the hotel and what makes it a good choice for its category." },
        estimated_price: { type: Type.STRING, description: "The estimated price per night in the specified currency. e.g. '€150 - €200'" },
        address: { type: Type.STRING, description: "The full, real-world address of the hotel for mapping purposes." }
    },
    required: ["name", "description", "estimated_price", "address"]
};

const hotelListSchema = {
    type: Type.ARRAY,
    description: "A list of hotel recommendations.",
    items: hotelSchema
};


export const generateHotelSuggestions = async (
    city: string,
    country: string,
    currency: string,
    minPrice: number,
    maxPrice: number
): Promise<Hotel[]> => {
    const prompt = `Suggest 5-7 hotels for a trip to ${city}, ${country} with a nightly price between ${minPrice} and ${maxPrice} ${currency}.
For each hotel, provide its name, a brief description, an estimated price per night in ${currency}, and its full real-world address for mapping.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: hotelListSchema,
                temperature: 0.7,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Hotel[];

    } catch (error) {
        console.error("Error generating hotel suggestions:", error);
        let errorMessage = "An unknown error occurred while generating hotel suggestions.";
        if (error instanceof Error) {
            errorMessage = `Failed to generate hotel suggestions. Gemini API error: ${error.message}`;
        }
        throw new Error(errorMessage);
    }
};