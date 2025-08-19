export interface Registration {
  _id: string;
  playerId: string;
  hasPaid: boolean;
  hasSubmittedDocs: boolean;
  amount: number;
  paymentDate?: string;
  player: {
    _id: string;
    fullName: string;
    birthYear: number;
    parentPhone?: string;
    notes?: string;
  };
  createdAt: string;
}

export interface Player {
  _id: string;
  fullName: string;
  birthYear: number;
  parentPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerWithRegistrationStatus extends Player {
  hasRegistration: boolean;
  registrationData?: Registration;
  registrationStatus: 'registered' | 'not-registered' | 'incomplete';
}

export interface RegistrationFormData {
  playerId: string;
  hasPaid: boolean;
  hasSubmittedDocs: boolean;
  paymentDate?: string;
}

export type ViewMode = 'registrations' | 'all-players';
