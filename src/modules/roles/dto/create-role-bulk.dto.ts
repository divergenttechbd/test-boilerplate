import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

export class CreateRoleBulkDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one role must be provided' })
  @ValidateNested({ each: true })
  @Type(() => CreateRoleDto)
  roles: CreateRoleDto[];
}
