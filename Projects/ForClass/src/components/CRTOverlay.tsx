import React from 'react';

interface CRTOverlayProps {
  enabled?: boolean;
}

export const CRTOverlay: React.FC<CRTOverlayProps> = ({ enabled = true }) => {
  if (!enabled) return null;
  return <div className="crt-overlay" aria-hidden="true" />;
};

