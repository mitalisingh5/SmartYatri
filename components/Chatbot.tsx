import React, { useState, useRef, useEffect } from 'react';

type Message = {
    id: number;
    sender: 'bot' | 'user';
    type: 'text' | 'options' | 'rating';
    content: string;
    options?: { label: string; value: string }[];
};

type ChatStep = 'start' | 'awaiting_issue' | 'awaiting_rating' | 'awaiting_feedback' | 'done';

const StarIcon: React.FC<{ filled: boolean; onMouseEnter: () => void; onClick: () => void }> = ({ filled, onMouseEnter, onClick }) => (
    <svg 
        onMouseEnter={onMouseEnter}
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${filled ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-200'}`}
    >
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006Z" clipRule="evenodd" />
    </svg>
);


const StarRating: React.FC<{ onRate: (rating: number) => void }> = ({ onRate }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex justify-center p-2" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon 
                    key={star}
                    filled={hoverRating >= star || rating >= star}
                    onMouseEnter={() => setHoverRating(star)}
                    onClick={() => {
                        setRating(star);
                        onRate(star);
                    }}
                />
            ))}
        </div>
    );
};

const RobotIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="black"/>
        <path d="M17 11H7C6.45 11 6 11.45 6 12V14C6 14.55 6.45 15 7 15H17C17.55 15 18 14.55 18 14V12C18 11.45 17.55 11 17 11Z" fill="white"/>
        <circle cx="9.5" cy="13" r="1" fill="black"/>
        <circle cx="14.5" cy="13" r="1" fill="black"/>
        <path d="M12 4C12.5523 4 13 3.55228 13 3V2C13 1.44772 12.5523 1 12 1C11.4477 1 11 1.44772 11 2V3C11 3.55228 11.4477 4 12 4Z" fill="black"/>
    </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#94A3B8"/>
    </svg>
);


const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [step, setStep] = useState<ChatStep>('start');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const initialMessage: Message = {
        id: 1,
        sender: 'bot',
        type: 'options',
        content: "Hello! I'm your friendly travel assistant. How can I help you today?",
        options: [
            { label: "App Guide", value: "guide" },
            { label: "Report an Issue", value: "issue" },
            { label: "Give Feedback", value: "feedback" },
        ]
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([initialMessage]);
            setStep('start');
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const addMessage = (message: Omit<Message, 'id'>) => {
        setMessages(prev => [...prev, { ...message, id: Date.now() }]);
    };

    const handleOptionClick = (value: string, label: string) => {
        addMessage({ sender: 'user', type: 'text', content: label });

        // Disable options on the previous message
        setMessages(prev => prev.map(msg => msg.type === 'options' ? { ...msg, options: undefined } : msg));

        setTimeout(() => {
            switch (value) {
                case 'guide':
                    addMessage({ sender: 'bot', type: 'text', content: "To use the app, simply fill out the form with your destination, budget, and trip duration. Our AI will generate a personalized itinerary for you. You can see your results below the form once it's done!" });
                    setStep('done');
                    break;
                case 'issue':
                    addMessage({ sender: 'bot', type: 'text', content: "I'm sorry to hear that. Please describe the technical issue you're experiencing in detail." });
                    setStep('awaiting_issue');
                    break;
                case 'feedback':
                    addMessage({ sender: 'bot', type: 'rating', content: "We'd love to hear your feedback! First, how would you rate your experience?" });
                    setStep('awaiting_rating');
                    break;
            }
        }, 500);
    };

    const handleRating = (rating: number) => {
        addMessage({ sender: 'user', type: 'text', content: `${rating} star${rating > 1 ? 's' : ''}` });
        setMessages(prev => prev.map(msg => msg.type === 'rating' ? { ...msg, type: 'text', content: "How would you rate your experience?" } : msg)); // Convert rating prompt to text
        
        setTimeout(() => {
            addMessage({ sender: 'bot', type: 'text', content: "Thank you! Could you please share some comments about your experience?" });
            setStep('awaiting_feedback');
        }, 500);
    };

    const handleTextInput = (text: string) => {
        addMessage({ sender: 'user', type: 'text', content: text });
        
        setTimeout(() => {
            if (step === 'awaiting_issue') {
                addMessage({ sender: 'bot', type: 'text', content: "Thanks for your report. Our technical team has been notified and will look into it." });
            } else if (step === 'awaiting_feedback') {
                addMessage({ sender: 'bot', type: 'text', content: "Thank you for your valuable feedback! We appreciate you helping us improve." });
            }
            setStep('done');
        }, 500);
    };

    const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
        const isBot = message.sender === 'bot';
        return (
            <div className={`flex items-start gap-3 ${!isBot && 'flex-row-reverse'}`}>
                <div className="flex-shrink-0">
                  {isBot ? <RobotIcon className="w-8 h-8" /> : <UserIcon className="w-8 h-8" />}
                </div>
                <div className={`max-w-xs rounded-xl px-4 py-3 ${isBot ? 'bg-slate-100 text-slate-800' : 'bg-orange-500 text-white'}`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    {message.type === 'options' && message.options && (
                        <div className="mt-3 flex flex-col space-y-2">
                            {message.options.map(opt => (
                                <button key={opt.value} onClick={() => handleOptionClick(opt.value, opt.label)} className="bg-white text-orange-600 border border-orange-300 rounded-full px-3 py-1.5 text-sm font-medium hover:bg-orange-50 transition-colors text-left">
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                    {message.type === 'rating' && (
                        <StarRating onRate={handleRating} />
                    )}
                </div>
            </div>
        );
    };
    
    const UserInput: React.FC = () => {
        const [text, setText] = useState('');
        const canType = step === 'awaiting_issue' || step === 'awaiting_feedback';

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (text.trim() && canType) {
                handleTextInput(text);
                setText('');
            }
        }
        
        return (
             <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200">
                <div className="flex items-center">
                    <input 
                        type="text"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder={canType ? "Type your message..." : "Please select an option"}
                        disabled={!canType}
                        className="w-full bg-slate-100 border border-slate-300 rounded-full py-2 px-4 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:outline-none transition duration-200 disabled:bg-slate-200"
                    />
                    <button type="submit" disabled={!canType} className="ml-3 p-2 bg-orange-500 rounded-full text-white disabled:bg-slate-300 shrink-0">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                           <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                         </svg>
                    </button>
                </div>
            </form>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-orange-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform z-50"
                aria-label="Toggle chatbot"
            >
                {isOpen ? (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                     </svg>
                ) : (
                    <RobotIcon className="w-9 h-9" />
                )}
            </button>
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-11/12 max-w-sm h-3/4 max-h-[600px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-slate-300 overflow-hidden">
                    <header className="bg-slate-100 p-3 flex items-center space-x-3 border-b border-slate-200">
                        <RobotIcon className="w-10 h-10 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-slate-800">Your Friendly Assistant</h3>
                            <p className="text-xs text-green-500 font-semibold">Online</p>
                        </div>
                    </header>
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {messages.map((msg) => (
                           <ChatBubble key={msg.id} message={msg} />
                        ))}
                         <div ref={messagesEndRef} />
                    </div>
                    <UserInput />
                </div>
            )}
        </>
    );
};

export default Chatbot;