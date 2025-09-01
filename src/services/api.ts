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
  // Ensure API key meets minimum length requirement (5 chars) and userGroup is always defined
  if (payload.apiKey.length < 5) {
    // console.warn('API key is too short (minimum 5 characters required)');
    throw new Error('API key must be at least 5 characters long');
  }
  
  // Encode the API key using Base64 and ensure all required fields are present
  const encodedPayload = {
    ...payload,
    apiKey: encodeToBase64(payload.apiKey),
    userGroup: payload.userGroup || 'default', // Ensure userGroup is never undefined
    timestamp: new Date().toISOString()
  };

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';

  try {
    // For local development without a backend, you can mock the response or skip the fetch
    if (isDevelopment && !endpoint.startsWith('http')) {
      
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

    // Debug log to see what's being sent (with API key redacted for security)
    // console.log('DEBUG - Sending payload to:', endpoint);
    
    // Add userGroup as a query parameter instead of in the body
    const userGroup = encodedPayload.userGroup || 'default';
    
    // Construct URL with query parameter
    const urlWithParams = new URL(endpoint);
    urlWithParams.searchParams.append('user_group', userGroup);
    
    // Remove userGroup from the payload since it's now a query parameter
    const { userGroup: _, ...payloadWithoutUserGroup } = encodedPayload;
    
    // console.log('DEBUG - Using URL with params:', urlWithParams.toString());
    
    // Real API call for production or when endpoint is specified
    const response = await fetch(urlWithParams.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include auth token from localStorage if available
        ...(localStorage.getItem('id_token') && {
          'Authorization': `Bearer ${localStorage.getItem('id_token')}`
        })
      },
      body: JSON.stringify(payloadWithoutUserGroup),
    });

    if (!response.ok) {
      // Log the entire response for debugging

      // Try to parse the error response
      const errorData = await response.json().catch(() => {
        // console.log('DEBUG - Failed to parse error response as JSON');
        return null;
      });
      
      if (errorData) {
        // console.log('DEBUG - Server error details:', errorData);
        
        // Handle FastAPI validation error format
        if (errorData.detail && Array.isArray(errorData.detail)) {
          const errorMessages = errorData.detail.map((err: any) => {
            const location = err.loc ? err.loc.join('.') : 'unknown';
            return `${err.msg} (at ${location})`;
          }).join('; ');
          
          console.log('Validation error details:', errorMessages);
          throw new Error(errorMessages || `Validation error: ${response.status}`);
        }
      }
      
      throw new Error(errorData?.message || `Server error: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('DEBUG - Successful response:', responseData);
    return responseData;
  } catch (error) {
    console.error('API key submission error:', error);
    throw error;
  }
};
