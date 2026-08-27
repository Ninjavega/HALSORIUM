import React, { ReactNode } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { getThemeClasses } from '../../utils/themeStyles';

interface ReticleFrameProps {
  children: ReactNode;
  className?: string;
  id?: string;
  accentBorder?: boolean;
  cornerNotch?: boolean;
}

export const ReticleFrame: React.FC<ReticleFrameProps> = ({
  children,
  className = '',
  id,
  accentBorder = false,
  cornerNotch = true,
}) => {
  const { theme, accent } = useDashboard();
  const t = getThemeClasses(theme, accent);

  return (
    <div
      id={id}
      className={`relative border ${accentBorder ? t.borderHighlight : t.borderMain} ${
        accentBorder ? t.accentGlow : ''
      } ${className}`}
    >
      {cornerNotch && (
        <>
          {/* Top-Left Corner */}
          <span
            className={`absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 ${
              theme === 'dark' ? 'border-zinc-400' : 'border-zinc-700'
            } pointer-events-none z-10`}
          />
          {/* Top-Right Corner */}
          <span
            className={`absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 ${
              theme === 'dark' ? 'border-zinc-400' : 'border-zinc-700'
            } pointer-events-none z-10`}
          />
          {/* Bottom-Left Corner */}
          <span
            className={`absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 ${
              theme === 'dark' ? 'border-zinc-400' : 'border-zinc-700'
            } pointer-events-none z-10`}
          />
          {/* Bottom-Right Corner */}
          <span
            className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 ${
              theme === 'dark' ? 'border-zinc-400' : 'border-zinc-700'
            } pointer-events-none z-10`}
          />
        </>
      )}
      {children}
    </div>
  );
};
