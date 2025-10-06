export interface AdminProfile {
  id: string;
  userId: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}
