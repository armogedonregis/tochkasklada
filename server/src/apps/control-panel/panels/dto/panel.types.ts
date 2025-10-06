import { Panel } from '@prisma/client';

export interface PanelWithRelays extends Panel {
  relays: {
    id: string;
    name: string;
    relayNumber: number;
    type: 'SECURITY' | 'LIGHT' | 'GATE';
  }[];
} 