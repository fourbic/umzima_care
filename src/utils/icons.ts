// Utility file to handle icon imports
import { LucideIcon } from 'lucide-react';

type IconType = LucideIcon | React.ComponentType<{ className?: string }>;

// Add any icons you need here
const iconMap: Record<string, () => Promise<{ default: IconType }>> = {
  // Add other icons as needed
};

export async function getIcon(name: string): Promise<React.ComponentType<{ className?: string }>> {
  try {
    if (iconMap[name]) {
      const module = await iconMap[name]();
      return module.default;
    }
    
    // Fallback to dynamic import
    const module = await import('lucide-react');
    const Icon = module[name as keyof typeof module] as LucideIcon;
    
    if (!Icon) {
      console.warn(`Icon '${name}' not found in lucide-react`);
      return () => null;
    }
    
    return Icon;
  } catch (error) {
    console.error(`Failed to load icon: ${name}`, error);
    return () => null;
  }
}
