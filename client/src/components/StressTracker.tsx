import React from 'react';

interface StressTrackerProps {
  date: string;
  currentEmoji?: '😊' | '🥺' | '🤯';
  onEmojiChange: (emoji: '😊' | '🥺' | '🤯') => void;
  onClose: () => void; // 👈 Added for auto-close
}

const StressTracker = ({ date, currentEmoji, onEmojiChange, onClose }: StressTrackerProps) => {
  const options: Array<'😊' | '🥺' | '🤯'> = ['😊', '🥺', '🤯'];

  const handleEmojiSelect = (emoji: '😊' | '🥺' | '🤯') => {
    onEmojiChange(emoji);  // Save the emoji
    onClose();             // Auto-close the tracker
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 border border-[#1D7E5F] mb-6 w-full">
      <h2 className="text-lg font-bold text-[#1D7E5F] mb-2">
        How stressed are you about money today?
      </h2>
      <div className="flex justify-around">
        {options.map((emoji) => (
          <button
            key={emoji}
            className={`text-3xl px-4 py-2 rounded-full ${
              currentEmoji === emoji
                ? 'bg-[#29AB87] text-white'
                : 'bg-gray-100 hover:bg-[#f0fdfa]'
            }`}
            onClick={() => handleEmojiSelect(emoji)}
            aria-label={`Select ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StressTracker;
