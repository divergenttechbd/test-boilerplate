// Represents the shape of a user in the system

export class UserEntity {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  