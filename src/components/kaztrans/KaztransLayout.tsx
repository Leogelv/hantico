import React from 'react';
import { Outlet } from 'react-router-dom';

export function KaztransLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <Outlet />
    </div>
  );
}