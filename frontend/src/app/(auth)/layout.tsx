import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          <div className="flex items-center">
            <span className="text-xl font-bold text-[#F62D40] dark:text-[#F8888F]">Точка.</span>
            <span className="text-xl font-bold ml-1 text-gray-900 dark:text-white">Склада</span>
          </div>
        </h2>
      </div>
      <div className="w-full sm:mx-auto sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 mt-8">
          {children}
        </div>
      </div>
    </div>
  );
} 