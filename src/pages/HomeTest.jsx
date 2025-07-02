import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-black mb-4">Welcome to GoEvent</h1>
      <p className="text-gray-600 mb-8">
        This is a test to see if React is working.
      </p>
      <div className="bg-blue-500 text-white p-4 rounded-lg">
        <p>If you can see this, React is working!</p>
      </div>
    </div>
  );
}
