import { Icon } from './Icon';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`relative flex ${sizeClasses[size]} items-center justify-center`}>
      <div className="absolute flex items-center justify-center rounded-md bg-primary-dark">
        <Icon 
          name="Leaf" 
          className={`text-primary-bright ${size === 'sm' ? 'h-6 w-6' : size === 'md' ? 'h-8 w-8' : 'h-12 w-12'}`}
        />
      </div>
    </div>
  );
};

export default Logo;