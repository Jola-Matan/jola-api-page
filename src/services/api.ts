// src/services/api.ts

/**
 * Simple Base64 encoding for API keys
 * @param str The string to encode
 * @returns Base64 encoded string
 */
export const encodeToBase64 = (str: string): string => {
  return btoa(str);
};

interface ApiKeyPayload {
  service: string;
  apiKey: string;
  userId?: string; // Optional user identifier
  userGroup?: string; // User group for backend authorization
}

/**
 * Sends API key to the backend service
 * @param payload The API key payload containing service name and key
 * @param endpoint The API endpoint to send the data to
 * @returns Promise with the response data
 */
export const sendApiKey = async (
  payload: ApiKeyPayload, 
  endpoint: string = '/api/store-api-key'
): Promise<any> => {
  // Encode the API key using Base64
  const encodedPayload = {
    ...payload,
    apiKey: encodeToBase64(payload.apiKey),
    timestamp: new Date().toISOString()
  };

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';

  try {
    // For local development without a backend, you can mock the response or skip the fetch
    if (isDevelopment && !endpoint.startsWith('http')) {
      console.log('Development mode: Mocking API request', {
        service: payload.service,
        userGroup: payload.userGroup,
        // Don't log the actual API key, just a placeholder
        apiKeyLength: payload.apiKey.length
      });
      
      // Return a mock successful response after a short delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: `API key for ${payload.service} stored successfully (development mode)`
          });
        }, 500);
      });
    }

    // Real API call for production or when endpoint is specified
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include auth token from localStorage if available
        ...(localStorage.getItem('id_token') && {
          'Authorization': `Bearer ${localStorage.getItem('id_token')}`
        })
      },
      body: JSON.stringify(encodedPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API key submission error:', error);
    throw error;
  }
};
