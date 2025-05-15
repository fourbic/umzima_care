import { useEffect, useState } from 'react';
import { getIcon } from '../../utils/icons';

interface IconProps {
  name: string;
  className?: string;
  fallback?: React.ReactNode;
}

export function Icon({ name, className = '', fallback = null }: IconProps) {
  const [IconComponent, setIconComponent] = useState<React.ComponentType<{ className?: string }> | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadIcon = async () => {
      try {
        const icon = await getIcon(name);
        if (mounted) {
          setIconComponent(() => icon);
          setError(false);
        }
      } catch (err) {
        console.error(`Failed to load icon: ${name}`, err);
        if (mounted) {
          setError(true);
        }
      }
    };

    loadIcon();

    return () => {
      mounted = false;
    };
  }, [name]);

  if (error || !IconComponent) {
    return <>{fallback}</>;
  }

  return <IconComponent className={className} />;
}
