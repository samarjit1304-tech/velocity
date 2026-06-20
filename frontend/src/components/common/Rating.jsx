import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value, text, size = 16, color = '#FFC107' }) => {
  const stars = [];
  const fullStars = Math.floor(value);
  const hasHalf = value % 1 !== 0;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<Star key={i} size={size} fill={color} stroke={color} className="inline mr-0.5" />);
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(<StarHalf key={i} size={size} fill={color} stroke={color} className="inline mr-0.5" />);
    } else {
      stars.push(<Star key={i} size={size} fill="none" stroke="#D1D1D6" className="inline mr-0.5" />);
    }
  }

  return (
    <div className="flex items-center">
      <div className="flex items-center">{stars}</div>
      {text && <span className="ml-2 text-xs text-luxury-grey tracking-wider font-light">{text}</span>}
    </div>
  );
};

export default Rating;
