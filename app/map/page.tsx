"use client"
import dynamic from 'next/dynamic';

// Dynamically import the AreaSelector component to avoid SSR issues
const AreaSelector = dynamic(() => import('@/app/components/AreaSelector'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map application...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return <AreaSelector />;
}