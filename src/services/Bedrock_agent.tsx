// src/services/bedrock_agent.tsx
export interface ChatRequest {
  prompt: string;
  client_id: string;
}

export interface ChatResponse {
  agent_response: string; 
  session_id: string;
  message: string;
}

export const bedrockAgentService = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const functionUrl = import.meta.env.VITE_AGENT_LAMBDA_URL;
    
    if (!functionUrl) {
      throw new Error('Function URL not configured');
    }

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: request.prompt, client_id: request.client_id }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }
};