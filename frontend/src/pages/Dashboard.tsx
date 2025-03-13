import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { tripService, logService } from "@/services/api";
import { Trip, LogEntry } from "@/types";
import { toast } from "@/hooks/use-toast";

const Dashboard: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTripsModal, setShowTripsModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [tripsData, logsData] = await Promise.all([
          tripService.getAllTrips(),
          logService.getAllLogs(),
        ]);
        setTrips(tripsData);
        setLogs(logsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const handleCreateTrip = () => {
    navigate("/trips/new");
  };

  const handleCreateLog = () => {
    navigate("/logs/new");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Trucking Log Dashboard
          </h1>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trips.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {trips.length > 0 ? trips.length : 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recent Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {logs.length > 0 ? logs.length : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">All Trips</h2>
              <Button variant="outline" onClick={() => setShowTripsModal(true)}>
                Show All Trips
              </Button>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Trips
              </h2>
              <Button onClick={handleCreateTrip}>Add New Trip</Button>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {isLoading ? (
                <div className="p-4 text-center">Loading trips...</div>
              ) : trips.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No trips found
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {trips.slice(0, 5).map((trip) => (
                    <li key={trip.id}>
                      <Link
                        to={`/trips/${trip.id}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              Trip #{trip.id}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                From: {trip.pickup_location}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                To: {trip.dropoff_location}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>
                                Created:{" "}
                                {new Date(trip.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">All Logs</h2>
              <Button variant="outline" onClick={() => setShowLogsModal(true)}>
                Show All Logs
              </Button>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Logs
              </h2>
              <Button onClick={handleCreateLog}>Add New Log</Button>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {isLoading ? (
                <div className="p-4 text-center">Loading logs...</div>
              ) : logs.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No logs found
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {logs.slice(0, 5).map((log) => (
                    <li key={log.id}>
                      <Link
                        to={`/logs/${log.id}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              Log #{log.id}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {log.date}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                Truck: {log.truck_number}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                Hours: {log.total_hours}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>Carrier: {log.carrier_name}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Trips Modal */}
      {showTripsModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">All Trips</h2>
            <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
              {trips.map((trip) => (
                <li key={trip.id} className="p-2">
                  Trip #{trip.id} - {trip.pickup_location} to{" "}
                  {trip.dropoff_location}
                </li>
              ))}
            </ul>
            <Button onClick={() => setShowTripsModal(false)} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Logs Modal */}
      {showLogsModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">All Logs</h2>
            <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
              {logs.map((log) => (
                <li key={log.id} className="p-2">
                  Log #{log.id} - Truck {log.truck_number} - Hours:{" "}
                  {log.total_hours}
                </li>
              ))}
            </ul>
            <Button onClick={() => setShowLogsModal(false)} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
