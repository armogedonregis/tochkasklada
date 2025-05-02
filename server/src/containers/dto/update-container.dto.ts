import { CreateContainerDto } from './create-container.dto';
 
export class UpdateContainerDto implements Partial<CreateContainerDto> {
  locId?: string;
} 