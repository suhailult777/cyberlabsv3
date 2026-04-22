export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Lab {
  id: string;
  name: string;
  description: string;
  category: 'cybersecurity' | 'networking' | 'cloud' | 'devops';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  hourlyPrice: number;
  imageUrl: string;
  tags: string[];
  specs: {
    ram: string;
    cpu: string;
    storage: string;
  };
}

export interface Plan {
  id: string;
  userId: string;
  labId: string;
  labName: string;
  hours: number;
  hourlyPrice: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'provisioned' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export interface Payment {
  id: string;
  planId: string;
  amount: number;
  easebuzzTxnId?: string;
  status: 'pending' | 'success' | 'failed';
  paidAt?: string;
}

export interface LabEnvironment {
  id: string;
  planId: string;
  accessUrl: string;
  username: string;
  password: string;
  status: 'provisioning' | 'running' | 'stopped';
  startedAt: string;
  expiresAt: string;
}
