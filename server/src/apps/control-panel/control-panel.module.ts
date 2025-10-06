import { Module } from '@nestjs/common';
import { PanelsModule } from './panels/panels.module';
import { RelaysModule } from './relays/relays.module';
import { RelayAccessModule } from './relay-access/relay-access.module';


@Module({
  imports: [
    PanelsModule,
    RelaysModule,
    RelayAccessModule
  ],
})
export class ControlPanelModule {}