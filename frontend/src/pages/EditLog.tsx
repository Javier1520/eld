import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LogForm from "@/components/LogForm";
import { logService } from "@/services/api";
import { LogEntry, LogFormData } from "@/types";
import { toast } from "@/hooks/use-toast";

const EditLog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [log, setLog] = useState<LogEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLog = async () => {
      if (!id) {
        navigate("/dashboard");
        return;
      }

      setIsLoading(true);
      try {
        const logData = await logService.getLog(parseInt(id, 10));
        setLog(logData);
      } catch (error) {
        console.error("Error fetching log:", error);
        toast({
          title: "Error",
          description: "Failed to load log data",
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLog();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg">Loading log data...</p>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg">Log not found</p>
      </div>
    );
  }

  const {
    date,
    total_miles,
    truck_number,
    carrier_name,
    main_office_address,
    driver_signature,
    co_driver_name,
    remarks,
    total_hours,
    shipping_document,
    trip,
  } = log;

  const logFormData: LogFormData = {
    date,
    total_miles: total_miles || undefined,
    truck_number,
    carrier_name,
    main_office_address,
    driver_signature,
    co_driver_name: co_driver_name || undefined,
    remarks,
    total_hours,
    shipping_document: shipping_document || undefined,
    trip,
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Edit Log #{id}
        </h1>
        <LogForm
          initialData={logFormData}
          logId={parseInt(id!, 10)}
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default EditLog;
