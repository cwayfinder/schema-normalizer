import { ChildNodeDescriptions } from './node-decription';

export interface ValidatorProperties {
  message: string;
  severity: string;
  disabled: string;
}

export interface ValidatorNodeValue<TParams = Record<string, unknown>> extends ValidatorProperties {
  validatorType: string;
  params: TParams;
}

export interface ValidatorDescription {
  readonly params: ChildNodeDescriptions[];
}

export type ValidationResult = { readonly message: string } | null;

export const validatorPropertiesDescriptions = [
  { type: 'string', key: 'message' },
  { type: 'string', key: 'severity' },
  { type: 'boolean', key: 'disabled' },
];

export interface ValidatorDefinition {
  description: ValidatorDescription;
  defaultRawSchema?: Record<string, unknown>;
  validate: Validate;
}

export type Validate = (value: unknown, validator: ValidatorNodeValue<any>) => ValidationResult;
