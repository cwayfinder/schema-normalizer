import { NodeDescription } from './node-decription';

export interface TriggerSchema {
  name: string;
  params?: TriggerParams;
}

interface TriggerParams {
  propertyName: string;
}

export interface RunnerSchema {
  name: string;
  data: any;
  init?: any;
  finalize?: any;
}

export interface CommandSchema {
  runnerName: string;
  runnerData: any;
}

export interface HookSchema {
  trigger: TriggerSchema;
  runner: RunnerSchema;
  overridable?: boolean;
}

export interface ComponentRawSchema {
  customId?: string;
  componentType: string;
  hooks?: HookSchema[];
  variables?: Record<string, { description: NodeDescription; schema: unknown }>;
  [prop: string]: unknown;
}

export interface ComponentDefaultRawSchema {
  hooks?: HookSchema[];
  variables?: Record<string, { description: NodeDescription; schema: unknown }>;
  [prop: string]: unknown;
}

export interface ValidatorNodeRawSchema {
  validatorType: string;
  message?: string;
  severity?: string;
  disabled?: boolean;
  [prop: string]: unknown;
}

export interface ValidatorSchema {
  validatorType: string;
  message: NodeSchema<string>;
  severity: NodeSchema<string>;
  disabled: NodeSchema<boolean>;
  params: Record<string, NodeSchema>;
}

export interface NodeSchema<TQuery = unknown, TInitial = unknown> {
  readonly resolverName: string;
  readonly resolverData: TQuery;
  readonly initial?: TInitial;
  readonly coerced?: boolean;
  readonly inverted?: boolean;
}

export type BooleanNodeSchema = NodeSchema<boolean>;
export type NumberNodeSchema = NodeSchema<number>;
export type StringNodeSchema = NodeSchema<string>;
export type ArrayNodeSchema<T = unknown> = NodeSchema<NodeSchema<T, T>[]>;
export type ObjectNodeSchema = NodeSchema<Record<string, NodeSchema> | null>;
export type MapNodeSchema = NodeSchema<Record<string, NodeSchema>>;
export type ValidatorNodeSchema = NodeSchema<ValidatorSchema>;
export type ComponentNodeSchema = NodeSchema<string | null>;
export type CommandNodeSchema = NodeSchema<CommandSchema | null>;
