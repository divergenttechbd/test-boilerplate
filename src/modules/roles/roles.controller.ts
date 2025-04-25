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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRoleBulkDto } from './dto/create-role-bulk.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  async create(@Body() dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }

  @Post('bulk')
  async createInBulk(@Body() body: CreateRoleBulkDto) {
    return this.rolesService.createRolesInBulk(body.roles);
  }

  @Get()
  async findAll() {
    return this.rolesService.getAllRoles();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.rolesService.getRoleById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.updateRole(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.rolesService.deleteRole(id);
  }
}
