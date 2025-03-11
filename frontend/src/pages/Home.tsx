import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Trucking Log</h1>
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                Electronic Logging Device System
              </h2>
              <p className="mt-4 text-xl text-gray-500">
                Manage your trucking logs efficiently and stay compliant with
                regulations. Our system helps you track hours of service, manage
                trips, and maintain accurate records.
              </p>
              <div className="mt-8">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="px-8">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button size="lg" className="px-8">
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="aspect-w-5 aspect-h-3 rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Trucking log dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900">Key Features</h3>
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-medium text-gray-900">
                  Trip Management
                </h4>
                <p className="mt-2 text-gray-500">
                  Create and manage trips with detailed information about pickup
                  and dropoff locations.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-medium text-gray-900">
                  Hours of Service Logging
                </h4>
                <p className="mt-2 text-gray-500">
                  Track your driving hours, rest periods, and duty status to
                  stay compliant with regulations.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-medium text-gray-900">
                  Detailed Reports
                </h4>
                <p className="mt-2 text-gray-500">
                  Generate comprehensive reports for your records and regulatory
                  compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Trucking Log System. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
