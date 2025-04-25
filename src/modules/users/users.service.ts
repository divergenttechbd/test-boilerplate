import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repositories';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const passwordHash = `hashed-${dto.password}`; // simulate hashing
    return this.usersRepo.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      isActive: true,
    });
  }

  async getUsers(): Promise<UserEntity[]> {
    return this.usersRepo.findAll();
  }

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    const updated = await this.usersRepo.update(id, dto);
    if (!updated) throw new NotFoundException(`User with id ${id} not found`);
    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await this.usersRepo.delete(id);
    if (!deleted) throw new NotFoundException(`User with id ${id} not found`);
  }
}
