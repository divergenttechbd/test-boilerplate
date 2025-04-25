
Great! We'll begin with the `UsersModule` as the first core functional module.

We'll start with a **JSON-based, in-memory implementation** of `UsersModule`, which:

- Doesn’t require a real database.
- Can easily be replaced later with a real database by updating the persistence layer (e.g., using TypeORM).
- Is perfect for initial testing and scaffolding.

---

## 📦 Module: `UsersModule`

### ✅ Folder Structure

```
src/
└── modules/
    └── users/
        ├── controllers/
        │   └── users.controller.ts
        ├── services/
        │   └── users.service.ts
        ├── dtos/
        │   ├── create-user.dto.ts
        │   └── update-user.dto.ts
        ├── entities/
        │   └── user.entity.ts
        ├── interfaces/
        │   └── user.interface.ts
        ├── repositories/
        │   └── users.repository.ts
        └── users.module.ts
```

Each folder handles a specific responsibility:

- `controllers/`: Route handlers (e.g., `GET /users`)
- `services/`: Business logic
- `repositories/`: Data handling (in-memory here, later DB)
- `dtos/`: Validation and request shaping
- `entities/`: Entity definitions
- `interfaces/`: Type safety contracts

---

## 1️⃣ `users.module.ts`

```ts
import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
```

> 💡 The module brings together the controller, service, and repository. `UsersService` is exported for use in other modules like `AuthModule`.

---

## 2️⃣ `user.entity.ts`

```ts
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
```

> ℹ️ This entity will later map to the DB. For now, it defines the in-memory structure.

---

## 3️⃣ `user.interface.ts`

```ts
// Interface to enforce shape when interacting with UserEntity

export interface IUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 4️⃣ DTOs

### `create-user.dto.ts`

```ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
```

### `update-user.dto.ts`

```ts
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

---

## 5️⃣ `users.repository.ts`

```ts
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
```

> 🧠 The repository mimics basic DB operations with in-memory storage.

---

## 6️⃣ `users.service.ts`

```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UsersRepository } from '../repositories/users.repository';
import { UserEntity } from '../entities/user.entity';

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
```

> 🔐 Password hashing is simulated. Will be replaced with real hashing (e.g., bcrypt) during DB integration.

---

## 7️⃣ `users.controller.ts`

```ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get()
  async findAll() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
  }
}
```

> 📡 Routes:  

- `POST /users` — Create a user  
- `GET /users` — Get all users  
- `GET /users/:id` — Get user by ID  
- `PUT /users/:id` — Update user  
- `DELETE /users/:id` — Delete user

---

## ✅ Summary

The `UsersModule` is fully scaffolded using an in-memory store, which:

- Allows API testing without DB
- Can be easily replaced later with TypeORM
- Supports solid DTO validation, error handling, and layered structure

---

Shall I proceed with the **RolesModule** next? Or do you want to test the UsersModule endpoints first?
