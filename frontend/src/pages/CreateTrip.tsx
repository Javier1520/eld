import React from "react";
import TripForm from "@/components/TripForm";

const CreateTrip: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Create New Trip
        </h1>
        <TripForm />
      </div>
    </div>
  );
};

export default CreateTrip;
