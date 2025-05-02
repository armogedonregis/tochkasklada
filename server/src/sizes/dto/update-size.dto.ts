import { CreateSizeDto } from './create-size.dto';

export class UpdateSizeDto implements Partial<CreateSizeDto> {
  name?: string;
  size?: string;
  area?: string;
} 