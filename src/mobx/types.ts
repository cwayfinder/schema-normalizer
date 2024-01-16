import { ComponentDescription } from '../types/component-description';
import { ComponentDefaultRawSchema } from '../types/schema';

export type InstanceSchemaId = string;
export type InstanceId = string;

export type ComponentSchemaId = string;
export type ComponentId = number;
export type RelativePath = string;

export type NodePosition = {
  ownerComponentId: ComponentId;
  relativePath: RelativePath;
};

export type ComponentDefinition = {
  description: ComponentDescription;
  defaultSchema: ComponentDefaultRawSchema;
}
