import { useState } from 'react';
import PropTypes from 'prop-types';

const starRatingContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px'
};
const starContainerStyle = { display: 'flex', gap: '4px' };

StarRating.propTypes = {
  maxRating: PropTypes.number,
  defaultRating: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  message: PropTypes.array,
  className: PropTypes.string,
  onSetRating: PropTypes.func
};

export default function StarRating({
  defaultRating = 0,
  maxRating = 5,
  color = '#fcc419',
  size = 48,
  message = [],
  className = '',
  onSetRating
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  const textStyle = {
    lineHeight: '1',
    margin: '0',
    color,
    fontSize: `${size / 2}px`
  };

  function handleRating(rating) {
    setRating(rating);
    onSetRating(rating);
  }
  // console.log(rating);

  return (
    <div style={starRatingContainerStyle} className={className}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            color={color}
            size={size}
            key={i}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onSetRating={() => handleRating(i + 1)}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
          />
        ))}
      </div>
      <p style={textStyle}>
        {message.length === maxRating
          ? message[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ''}
      </p>
    </div>
  );
}

function Star({ onSetRating, full, onHoverIn, onHoverOut, color, size }) {
  const starStyle = {
    width: `${size / 2}px`,
    height: `${size / 2}px`,
    display: 'block',
    cursor: 'pointer'
  };

  return (
    <span
      onClick={onSetRating}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
      role="button"
      style={starStyle}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill={full ? color : 'none'}
        stroke={color}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </span>
  );
}
