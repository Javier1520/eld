import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TripForm from "@/components/TripForm";
import { tripService } from "@/services/api";
import { Trip } from "@/types";
import { toast } from "@/hooks/use-toast";

const EditTrip: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) {
        navigate("/dashboard");
        return;
      }

      setIsLoading(true);
      try {
        const tripData = await tripService.getTrip(parseInt(id, 10));
        setTrip(tripData);
      } catch (error) {
        console.error("Error fetching trip:", error);
        toast({
          title: "Error",
          description: "Failed to load trip data",
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrip();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg">Loading trip data...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg">Trip not found</p>
      </div>
    );
  }

  const {
    current_location,
    pickup_location,
    dropoff_location,
    current_cycle_used,
  } = trip;
  const tripFormData = {
    current_location,
    pickup_location,
    dropoff_location,
    current_cycle_used,
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Edit Trip #{id}
        </h1>
        <TripForm
          initialData={tripFormData}
          tripId={parseInt(id!, 10)}
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default EditTrip;
