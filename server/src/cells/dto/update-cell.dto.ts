import { CreateCellDto } from './create-cell.dto';

export class UpdateCellDto implements Partial<CreateCellDto> {
  size_id?: string;
  name?: string;
  len_height?: string;
  containerId?: number;
  statusId?: string;
} 