import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import amplifyConfig from '../amplifyConfig';
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Key, Check, X, Loader2, Search } from "lucide-react";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { sendApiKey } from '../services/api';

// Helper function to get the appropriate icon for each service
const getServiceIcon = (service: string) => {
  switch (service) {
    case 'semrush':
    case 'ahrefs':
      return <Search className="h-5 w-5 text-blue-600" />;
    default:
      return <Search className="h-5 w-5 text-gray-600" />;
  }
};

interface ApiKeyFormProps {
  onSubmit: (service: string, apiKey: string) => void;
  loading: boolean;
  error: string | null;
}

function ApiKeyForm({ onSubmit, loading, error }: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState("");
  const [service, setService] = useState("semrush");
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!apiKey.trim()) {
      setValidationError("API key is required");
      return;
    }
    
    setValidationError("");
    onSubmit(service, apiKey);
    
    // Show success message if no error
    if (!error) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: "#FAFAFA" }}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center" style={{ color: "#232A34" }}>
          Jola AI
        </h1>
        <p className="text-center mt-2 text-lg" style={{ color: "#8A94A6" }}>
          API Key Configuration
        </p>
      </div>
      <Card
        className="w-full max-w-md rounded-xl border shadow-lg"
        style={{ backgroundColor: "#F5F5F5", borderColor: "#8A94A6" }}
      >
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="service" className="block mb-2 text-md font-medium text-gray-700">
                Select Service
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {getServiceIcon(service)}
                </div>
                <select
                  id="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full pl-10 rounded-lg border p-2 text-md"
                  style={{
                    backgroundColor: "#FAFAFA",
                    borderColor: "#8A94A6",
                    color: "#232A34",
                  }}
                >
                  <option value="semrush">Semrush</option>
                  <option value="ahrefs">Ahrefs</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="apiKey" className="block mb-2 text-md font-medium text-gray-700">
                API Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full pl-10 rounded-lg border p-2 text-md"
                  style={{
                    backgroundColor: "#FAFAFA",
                    borderColor: "#8A94A6",
                    color: "#232A34",
                  }}
                />
              </div>
            </div>
            
            {validationError && (
              <div className="flex items-center text-red-600 gap-2">
                <X className="h-5 w-5" />
                <span>{validationError}</span>
              </div>
            )}
            
            {error && (
              <div className="flex items-center text-red-600 gap-2">
                <X className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
            
            {showSuccess && !error && (
              <div className="flex items-center text-green-600 gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                <Check className="h-5 w-5" />
                <span>
                  <strong>
                    {service
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </strong> API key submitted successfully!
                </span>
              </div>
            )}
            
            <Button 
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-2 text-md font-medium shadow-md hover:shadow-lg text-white"
              style={{ backgroundColor: "#232A34" }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Key className="w-5 h-5 mr-2" />
                  Submit API Key
                </>
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

const Home: React.FC = () => {
  // here is the user and user groups data
  const { user, groups, loading: authLoading } = useAuthenticatedUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = `${amplifyConfig.domain}/logout?client_id=${amplifyConfig.clientId}&logout_uri=${encodeURIComponent(amplifyConfig.logoutUri)}`;
  };

  const handleSubmitApiKey = async (service: string, apiKey: string) => {
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      // Get API base URL from environment variables with fallback
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const endpoint = `${apiBaseUrl}/api/store-api-key`;
      
      // Use groups from authentication if available
      const userGroup = groups && groups.length > 0 ? groups[0] : undefined;
      
      // Send API key to backend
      await sendApiKey({
        service,
        apiKey,
        userId: user?.sub, // Use the user sub as identifier
        userGroup: userGroup // Include the user group explicitly
      }, endpoint);
      
      // Format service name for display (capitalize and handle hyphenated names)
      const formattedServiceName = service
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      console.log(`${formattedServiceName} API Key sent to backend successfully`);
      
      setIsSubmitting(false);
    } catch (error: any) {
      console.error('Error saving API key:', error);
      setApiError(error.message || 'Failed to save API key. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}><h2>Loading...</h2></div>;
  }

  if (!user) return null; // Redirect already handled in hook

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="absolute top-4 left-4">
        <img src="/Jola_icon_no_background.png" alt="Jola AI Logo" className="h-12 w-12" />
      </div>
      <div className="absolute top-4 right-4">
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="rounded-lg px-6 py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow duration-300"
          style={{ color: "#232A34", borderColor: "#8A94A6" }}
        >
          Logout
        </Button>
      </div>
      <ApiKeyForm
        onSubmit={handleSubmitApiKey}
        loading={isSubmitting}
        error={apiError}
      />
    </div>
  );
};

export default Home;
