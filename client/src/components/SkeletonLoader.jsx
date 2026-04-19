import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between 
        border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse min-h-[320px]">
      <div>
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div className="mb-6 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
      <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
         <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
         <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
      </div>
    </div>
  );
};
