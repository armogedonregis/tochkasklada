import { CreateLocationDto } from './create-location.dto';

export class UpdateLocationDto implements Partial<CreateLocationDto> {
  name?: string;
  short_name?: string;
  address?: string;
  cityId?: string;
} 