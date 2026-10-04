import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#171717] rounded-xl overflow-hidden border border-neutral-800/80 animate-pulse flex flex-col h-full">
      <div className="aspect-[2/3] w-full bg-neutral-800/60" />
      <div className="p-3.5 space-y-2.5">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-neutral-800 rounded" />
          <div className="h-3 w-8 bg-neutral-800 rounded" />
        </div>
        <div className="h-4 w-3/4 bg-neutral-800 rounded" />
        <div className="h-3 w-1/2 bg-neutral-800/60 rounded" />
      </div>
    </div>
  );
};

export const GridSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="w-full min-h-[500px] lg:min-h-[600px] bg-neutral-900 animate-pulse flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="max-w-2xl space-y-4">
          <div className="h-5 w-32 bg-neutral-800 rounded" />
          <div className="h-12 w-3/4 bg-neutral-800 rounded" />
          <div className="h-4 w-1/2 bg-neutral-800 rounded" />
          <div className="h-20 w-full bg-neutral-800/60 rounded" />
          <div className="flex gap-4 pt-2">
            <div className="h-12 w-36 bg-neutral-800 rounded-xl" />
            <div className="h-12 w-36 bg-neutral-800/60 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
