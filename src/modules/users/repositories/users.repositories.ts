import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersRepository {
  private users: UserEntity[] = [];

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const newUser = {
      ...user,
      id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserEntity;

    this.users.push(newUser);
    return newUser;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.users;
  }

  async findById(id: string): Promise<UserEntity | undefined> {
    return this.users.find(u => u.id === id);
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.users.find(u => u.email === email);
  }

  async update(id: string, updates: Partial<UserEntity>): Promise<UserEntity | null> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date(),
    };

    return this.users[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}
