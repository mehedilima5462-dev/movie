import React from 'react';
import { AdPlacement } from '../../types';
import { AdBanner } from './AdBanner';
import { NativeAd } from './NativeAd';

interface AdSlotProps {
  placement: AdPlacement;
  format?: 'banner' | 'native';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  placement,
  format = 'banner',
  className = ''
}) => {
  if (format === 'native') {
    return <NativeAd placement={placement} className={className} />;
  }

  return <AdBanner placement={placement} className={className} />;
};
