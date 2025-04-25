import { Injectable, NotFoundException } from '@nestjs/common';
import { RolesRepository } from './repositories/roles.repositories';
import { RoleEntity } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepo: RolesRepository) {}

  async createRole(dto: CreateRoleDto): Promise<RoleEntity> {
    return this.rolesRepo.create({
      name: dto.name,
      description: dto.description,
      isDefault: dto.isDefault ?? false,
    });
  }
  async createRolesInBulk(dtos: CreateRoleDto[]): Promise<RoleEntity[]> {
    const createdRoles: RoleEntity[] = [];
  
    for (const dto of dtos) {
      const role = await this.rolesRepo.create({
        name: dto.name,
        description: dto.description,
        isDefault: dto.isDefault ?? false,
      });
      createdRoles.push(role);
    }
  
    return createdRoles;
  }
  

  async getAllRoles(): Promise<RoleEntity[]> {
    return this.rolesRepo.findAll();
  }

  async getRoleById(id: string): Promise<RoleEntity> {
    const role = await this.rolesRepo.findById(id);
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    return role;
  }

  async updateRole(id: string, dto: UpdateRoleDto): Promise<RoleEntity> {
    const updated = await this.rolesRepo.update(id, dto);
    if (!updated) throw new NotFoundException(`Role with ID ${id} not found`);
    return updated;
  }

  async deleteRole(id: string): Promise<void> {
    const deleted = await this.rolesRepo.delete(id);
    if (!deleted) throw new NotFoundException(`Role with ID ${id} not found`);
  }
}
