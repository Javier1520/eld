import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogFormData, Remark, Trip } from "@/types";
import { logService, tripService } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import LogGrid from "@/components/LogGrid";

interface LogFormProps {
  initialData?: LogFormData;
  logId?: number;
  isEditing?: boolean;
}

const defaultRemark: Remark = {
  id: "1",
  hour_start: "00:00:00",
  hour_finish: "08:00:00",
  status: "OFF_DUTY",
  location: "",
  title: "",
};

const defaultFormData: LogFormData = {
  date: new Date().toISOString().split("T")[0],
  truck_number: "",
  carrier_name: "",
  main_office_address: "",
  driver_signature: "",
  remarks: [defaultRemark],
  total_hours: "0.00",
  trip: 0,
};

const LogForm: React.FC<LogFormProps> = ({
  initialData,
  logId,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<LogFormData>(
    initialData || defaultFormData
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoadingTrips(true);
      try {
        const tripsData = await tripService.getAllTrips();
        setTrips(tripsData);

        // If we're creating a new log and there are trips, set the first trip as default
        if (!isEditing && tripsData.length > 0 && formData.trip === 0) {
          setFormData((prev) => ({ ...prev, trip: tripsData[0].id }));
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
        toast({
          title: "Error",
          description: "Failed to load trips",
          variant: "destructive",
        });
      } finally {
        setIsLoadingTrips(false);
      }
    };

    fetchTrips();
  }, [isEditing, formData.trip]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemarkChange = (
    index: number,
    field: keyof Remark,
    value: string
  ) => {
    const updatedRemarks = [...formData.remarks];
    updatedRemarks[index] = { ...updatedRemarks[index], [field]: value };
    setFormData((prev) => ({ ...prev, remarks: updatedRemarks }));
  };

  const addRemark = () => {
    const newId = (formData.remarks.length + 1).toString();
    const newRemark: Remark = {
      ...defaultRemark,
      id: newId,
    };
    setFormData((prev) => ({ ...prev, remarks: [...prev.remarks, newRemark] }));
  };

  const removeRemark = (index: number) => {
    if (formData.remarks.length <= 1) {
      toast({
        title: "Error",
        description: "You must have at least one remark",
        variant: "destructive",
      });
      return;
    }

    const updatedRemarks = formData.remarks.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, remarks: updatedRemarks }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.date ||
      !formData.truck_number ||
      !formData.carrier_name ||
      !formData.trip
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
      if (isEditing && logId) {
        await logService.updateLog(logId, formData);
        toast({
          title: "Success",
          description: "Log updated successfully",
        });
      } else {
        await logService.createLog(formData);
        toast({
          title: "Success",
          description: "Log created successfully",
        });
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving log:", error);
      toast({
        title: "Error",
        description: "Failed to save log",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Log" : "Create New Log"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip">Trip *</Label>
              <select
                id="trip"
                name="trip"
                value={formData.trip}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                disabled={isSubmitting || isLoadingTrips}
              >
                <option value="">Select a Trip</option>
                {trips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    Trip #{trip.id} - {trip.pickup_location} to{" "}
                    {trip.dropoff_location}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="truck_number">Truck Number *</Label>
              <Input
                id="truck_number"
                name="truck_number"
                value={formData.truck_number}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carrier_name">Carrier Name *</Label>
              <Input
                id="carrier_name"
                name="carrier_name"
                value={formData.carrier_name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="main_office_address">Main Office Address</Label>
              <Input
                id="main_office_address"
                name="main_office_address"
                value={formData.main_office_address}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driver_signature">Driver Signature *</Label>
              <Input
                id="driver_signature"
                name="driver_signature"
                value={formData.driver_signature}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="co_driver_name">Co-Driver Name</Label>
              <Input
                id="co_driver_name"
                name="co_driver_name"
                value={formData.co_driver_name || ""}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_hours">Total Hours *</Label>
              <Input
                id="total_hours"
                name="total_hours"
                type="text"
                value={formData.total_hours}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <LogGrid remarks={formData.remarks} />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Remarks</h3>
              <Button
                type="button"
                variant="outline"
                onClick={addRemark}
                disabled={isSubmitting}
              >
                Add Remark
              </Button>
            </div>

            {formData.remarks.map((remark, index) => (
              <div key={remark.id} className="border rounded-md p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Remark #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeRemark(index)}
                    disabled={isSubmitting || formData.remarks.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`hour_start_${index}`}>Start Time</Label>
                    <Input
                      id={`hour_start_${index}`}
                      type="time"
                      value={remark.hour_start.substring(0, 5)}
                      onChange={(e) =>
                        handleRemarkChange(
                          index,
                          "hour_start",
                          `${e.target.value}:00`
                        )
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`hour_finish_${index}`}>End Time</Label>
                    <Input
                      id={`hour_finish_${index}`}
                      type="time"
                      value={remark.hour_finish.substring(0, 5)}
                      onChange={(e) =>
                        handleRemarkChange(
                          index,
                          "hour_finish",
                          `${e.target.value}:00`
                        )
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`status_${index}`}>Status</Label>
                    <select
                      id={`status_${index}`}
                      value={remark.status}
                      onChange={(e) =>
                        handleRemarkChange(
                          index,
                          "status",
                          e.target.value as string
                        )
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      <option value="OFF_DUTY">Off Duty</option>
                      <option value="SLEEPER_BERTH">Sleeper Berth</option>
                      <option value="DRIVING">Driving</option>
                      <option value="ON_DUTY">On Duty</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`location_${index}`}>Location</Label>
                    <Input
                      id={`location_${index}`}
                      value={remark.location}
                      onChange={(e) =>
                        handleRemarkChange(index, "location", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`title_${index}`}>Title/Notes</Label>
                    <Input
                      id={`title_${index}`}
                      value={remark.title}
                      onChange={(e) =>
                        handleRemarkChange(index, "title", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
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
                ? "Update Log"
                : "Create Log"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LogForm;
