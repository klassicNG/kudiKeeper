import React from 'react';
import { View, ViewProps } from 'react-native';

export interface GlassmorphismCardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({ children, className, ...props }) => {
  return (
    <View
      className={`bg-surface/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl ${className || ''}`}
      {...props}
    >
      {children}
    </View>
  );
};
