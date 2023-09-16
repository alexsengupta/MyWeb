import { InternalVariabilityForcingConfig } from '../../inputs/internal-variability-forcing/internal-variability-forcing.config';
import { ForcingConfig } from './forcing.config';

export interface Scenario {
  id: number;
  isPreset: boolean;
  name: string;
  label: string;
  summary: string;
  description?: string;
  imageUrl?: string;
  range?: {
    start: number,
    end: number,
    type: string
  };
  nodes?: number[];
  forcings?: {
    ch4?: ForcingConfig,
    co2?: ForcingConfig,
    so2?: ForcingConfig,
    volcanics?: ForcingConfig,
    tsi?: ForcingConfig,
    albedo?: ForcingConfig,
    internalVariability?: InternalVariabilityForcingConfig
  };
  constants?: {};
  nodesCount?: number;
}
