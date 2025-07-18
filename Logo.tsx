import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  darkMode?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showIcon = true, className = '', darkMode = false }) => {
  const sizeClasses = {
    sm: {
      text: 'text-lg',
      icon: 'w-6 h-6 text-xs'
    },
    md: {
      text: 'text-2xl',
      icon: 'w-8 h-8 text-sm'
    },
    lg: {
      text: 'text-4xl',
      icon: 'w-12 h-12 text-lg'
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showIcon && (
        <div 
          className={`${sizeClasses[size].icon} rounded-lg flex items-center justify-center`}
          style={{ backgroundColor: '#6D7AFF' }}
        >
          <span className="text-white font-bold">{size === 'sm' ? 'H' : 'H'}</span>
        </div>
      )}
      <div className={`${sizeClasses[size].text} font-bold`}>
        <span style={{ color: '#6D7AFF' }}>Human</span>
        <span className={darkMode ? "text-white" : "text-gray-900"}>Tic</span>
      </div>
    </div>
  );
};

export default Logo;