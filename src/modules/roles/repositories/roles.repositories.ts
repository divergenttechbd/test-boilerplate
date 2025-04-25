import { Injectable } from '@nestjs/common';
import { RoleEntity } from '../entities/role.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RolesRepository {
  private roles: RoleEntity[] = [];

  async create(role: Partial<RoleEntity>): Promise<RoleEntity> {
    const newRole = {
      ...role,
      id: uuid(),
      isDefault: role.isDefault ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as RoleEntity;

    this.roles.push(newRole);
    return newRole;
  }

  async findAll(): Promise<RoleEntity[]> {
    return this.roles;
  }

  async findById(id: string): Promise<RoleEntity | undefined> {
    return this.roles.find(role => role.id === id);
  }

  async findByName(name: string): Promise<RoleEntity | undefined> {
    return this.roles.find(role => role.name === name);
  }

  async update(id: string, updates: Partial<RoleEntity>): Promise<RoleEntity | null> {
    const index = this.roles.findIndex(role => role.id === id);
    if (index === -1) return null;

    this.roles[index] = {
      ...this.roles[index],
      ...updates,
      updatedAt: new Date(),
    };

    return this.roles[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.roles.findIndex(role => role.id === id);
    if (index === -1) return false;

    this.roles.splice(index, 1);
    return true;
  }
}
