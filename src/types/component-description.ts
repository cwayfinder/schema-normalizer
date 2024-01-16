import { NodeDescriptions } from './node-decription';

export type PropertyDescription = NodeDescriptions & { key: string };

export interface ComponentDescription {
  readonly traits?: string[];
  readonly properties: PropertyDescription[];
}
