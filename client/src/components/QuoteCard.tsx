import { useEffect, useState } from 'react';

const QuoteCard = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    const fetchQuote = () => {
      fetch('http://localhost:8000/api/quote')
        .then(res => res.json())
        .then(data => {
          setQuote(data.quote);
          setAuthor(data.author);
        })
        .catch(err => {
          setQuote('You are the source of your own abundance. ✨');
          setAuthor('Real Money Magic');
        });
    };
  
    fetchQuote();
  
    const interval = setInterval(fetchQuote, 90000); 
    return () => clearInterval(interval); 
  }, []); 

  return (
    <div className="relative bg-white/80 rounded-xl shadow-lg p-6 max-w-3xl w-full mx-auto backdrop-blur-sm border border-yellow-200 overflow-hidden">
      {/* ✨ Sparkle Background Layer */}
      <div className="sparkle-layer">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="sparkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-left text-[#1D7E5F] mb-2">Today At A Glance <span className="animate-pulse text-lg">...</span></h2>
        <p className="text-[#1D7E5F] font-medium italic text-lg leading-relaxed">“{quote}”</p>
        <p className="text-sm text-gray-700 mt-4 font-semibold">— {author}</p>
      </div>
    </div>
  );
};

export default QuoteCard;