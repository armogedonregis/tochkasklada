import { IsUUID, IsArray, IsString } from 'class-validator';

export class AssignLocationPermissionsDto {
  @IsUUID()
  adminId: string;

  @IsUUID()
  locationId: string;

  @IsArray()
  @IsString({ each: true })
  permissions: string[]; // ['locations:read', 'cells:read', 'rentals:create', etc.]
}
