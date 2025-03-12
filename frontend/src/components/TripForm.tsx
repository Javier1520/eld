import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TripFormData } from "@/types";
import { tripService } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import MapSelector from "@/components/MapSelector";

interface TripFormProps {
  initialData?: TripFormData;
  tripId?: number;
  isEditing?: boolean;
}

const defaultFormData: TripFormData = {
  current_location: "",
  pickup_location: "",
  dropoff_location: "",
  current_cycle_used: "0.00",
};

const TripForm: React.FC<TripFormProps> = ({
  initialData,
  tripId,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<TripFormData>(
    initialData || defaultFormData
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // State to control which map selector is currently open
  const [activeMapField, setActiveMapField] = useState<
    keyof TripFormData | null
  >(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.current_location ||
      !formData.pickup_location ||
      !formData.dropoff_location
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && tripId) {
        await tripService.updateTrip(tripId, formData);
        toast({
          title: "Success",
          description: "Trip updated successfully",
        });
      } else {
        await tripService.createTrip(formData);
        toast({
          title: "Success",
          description: "Trip created successfully",
        });
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving trip:", error);
      toast({
        title: "Error",
        description: "Failed to save trip",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open map selector for a specific field
  const openMapSelector = (fieldName: keyof TripFormData) => {
    setActiveMapField(fieldName);
  };

  // Handle coordinate selection from the map
  const handleCoordinateSelected = (coordinates: string) => {
    if (activeMapField) {
      setFormData((prev) => ({ ...prev, [activeMapField]: coordinates }));
    }
    setActiveMapField(null); // Close the map
  };

  // Close map selector without selecting
  const closeMapSelector = () => {
    setActiveMapField(null);
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Trip" : "Create New Trip"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_location">Current Location *</Label>
              <div className="flex gap-2">
                <Input
                  id="current_location"
                  name="current_location"
                  value={formData.current_location}
                  onChange={handleInputChange}
                  placeholder="e.g. -106.55150413513185, 35.30763093186632"
                  required
                  disabled={isSubmitting}
                  onClick={() => openMapSelector("current_location")}
                  readOnly
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openMapSelector("current_location")}
                >
                  Map
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Enter coordinates in format: longitude, latitude
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickup_location">Pickup Location *</Label>
              <div className="flex gap-2">
                <Input
                  id="pickup_location"
                  name="pickup_location"
                  value={formData.pickup_location}
                  onChange={handleInputChange}
                  placeholder="e.g. -106.58660888671875, 35.11513447747909"
                  required
                  disabled={isSubmitting}
                  onClick={() => openMapSelector("pickup_location")}
                  readOnly
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openMapSelector("pickup_location")}
                >
                  Map
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropoff_location">Dropoff Location *</Label>
              <div className="flex gap-2">
                <Input
                  id="dropoff_location"
                  name="dropoff_location"
                  value={formData.dropoff_location}
                  onChange={handleInputChange}
                  placeholder="e.g. -94.59777832031251, 39.01811672409787"
                  required
                  disabled={isSubmitting}
                  onClick={() => openMapSelector("dropoff_location")}
                  readOnly
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openMapSelector("dropoff_location")}
                >
                  Map
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_cycle_used">Current Cycle Used</Label>
              <Input
                id="current_cycle_used"
                name="current_cycle_used"
                value={formData.current_cycle_used}
                onChange={handleInputChange}
                placeholder="e.g. 1.00"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                  ? "Update Trip"
                  : "Create Trip"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Map Selector Modal */}
      {activeMapField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <MapSelector
            initialCoordinates={formData[activeMapField]}
            onCoordinateSelected={handleCoordinateSelected}
            onClose={closeMapSelector}
          />
        </div>
      )}
    </>
  );
};

export default TripForm;
