// src/types/tasks.ts

export interface Task {
    id: string;
    name: string;
    client: string;
    creationDate: string;
    owner: string;
    description: string;
    files: string[];
    workflowPlan: string[];
  }
  
  export interface ApprovalTask extends Task {
    status: string;
  }
  
  export interface BackgroundTask extends Task {
    progress: number;
  }
  