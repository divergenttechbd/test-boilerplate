import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
