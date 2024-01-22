import { ComponentDescription } from '../types/component-description';
import { ComponentDefaultRawSchema, NodeSchema } from '../types/schema';
import { NodeDescription } from '../types/node-decription';

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
};

export type NodeDefinition = {
  schema: NodeSchema,
  description: NodeDescription
};
