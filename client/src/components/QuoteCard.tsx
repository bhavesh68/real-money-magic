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
    <div className="bg-white/80 rounded-xl shadow-lg p-6 max-w-xl mx-auto text-center relative backdrop-blur-sm border border-yellow-200">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-100/40 via-transparent to-yellow-200/40 rounded-xl pointer-events-none z-0" />
      <div className="relative z-10">
        <p className="text-[#1D7E5F] font-medium italic text-lg leading-relaxed">
          “{quote}”
        </p>
        <p className="text-sm text-gray-700 mt-4 font-semibold">— {author}</p>
      </div>
    </div>
  );
};

export default QuoteCard;
