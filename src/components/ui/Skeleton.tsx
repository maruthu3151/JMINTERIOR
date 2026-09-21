import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm animate-pulse">
    <div className="aspect-[4/3] bg-stone-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-stone-200 rounded w-1/4" />
      <div className="h-6 bg-stone-200 rounded w-3/4" />
      <div className="space-y-1.5 pt-2">
        <div className="h-3 bg-stone-200 rounded w-full" />
        <div className="h-3 bg-stone-200 rounded w-5/6" />
      </div>
    </div>
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <tr className="animate-pulse border-b border-stone-200">
    <td className="py-4 px-6">
      <div className="h-4 bg-stone-200 rounded w-32" />
    </td>
    <td className="py-4 px-6">
      <div className="h-4 bg-stone-200 rounded w-20" />
    </td>
    <td className="py-4 px-6">
      <div className="h-4 bg-stone-200 rounded w-16" />
    </td>
    <td className="py-4 px-6 text-right">
      <div className="h-8 bg-stone-200 rounded w-24 ml-auto" />
    </td>
  </tr>
);
