import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="aspect-[4/5] w-full rounded-2xl shimmer-bg" />
      <div className="h-4 w-1/3 rounded shimmer-bg" />
      <div className="h-6 w-3/4 rounded shimmer-bg" />
      <div className="h-5 w-1/4 rounded shimmer-bg" />
    </div>
  );
};

export const SkeletonDetails = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12">
      <div className="flex flex-col space-y-4">
        <div className="aspect-square w-full rounded-2xl shimmer-bg" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-square rounded-lg shimmer-bg" />
          ))}
        </div>
      </div>
      <div className="flex flex-col space-y-6">
        <div className="h-4 w-20 rounded shimmer-bg" />
        <div className="h-10 w-3/4 rounded shimmer-bg" />
        <div className="h-6 w-32 rounded shimmer-bg" />
        <div className="h-4 w-full rounded shimmer-bg" />
        <div className="h-4 w-full rounded shimmer-bg" />
        <div className="h-4 w-2/3 rounded shimmer-bg" />
        <div className="h-12 w-1/2 rounded-full shimmer-bg" />
      </div>
    </div>
  );
};

export const SkeletonTable = () => {
  return (
    <div className="space-y-4 w-full">
      <div className="h-10 w-full rounded shimmer-bg" />
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-16 w-full rounded shimmer-bg" />
      ))}
    </div>
  );
};
