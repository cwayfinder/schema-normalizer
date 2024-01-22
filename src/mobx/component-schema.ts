import { set } from 'mobx';
import { ComponentSchemaId } from './types';
import { HookSchema, NodeSchema } from '../types/schema';
import { InstanceSchema } from './instance-schema';

interface ComponentSchemaCreateConfig {
  id: ComponentSchemaId;
  componentType: string;
  props: Record<string, NodeSchema>;
  variables: Record<string, InstanceSchema>;
  hooks: HookSchema[];
}

interface ComponentSchemaUpdateConfig {
  componentType: string;
  props: Record<string, NodeSchema>;
  variables: Record<string, InstanceSchema>;
  hooks: HookSchema[];
}

export class ComponentSchema {
  readonly id: ComponentSchemaId;
  componentType: string;
  props: Record<string, NodeSchema>;
  variables: Record<string, InstanceSchema>;
  hooks: HookSchema[];

  constructor(config: ComponentSchemaCreateConfig) {
    this.id = config.id;
    this.componentType = config.componentType;
    this.props = config.props;
    this.variables = config.variables;
    this.hooks = config.hooks;
  }

  update(config: ComponentSchemaUpdateConfig) {
    this.componentType = config.componentType;
    this.props = config.props;
    this.variables = config.variables;
    this.hooks = config.hooks;
  }

  setProperty(propertyName: string, propertySchema: NodeSchema) {
    if (!this.props[propertyName]) {
      this.props[propertyName] = propertySchema;
      return;
    }
    set(this.props[propertyName], propertySchema);
  }

  getProperty(propertyName: string): NodeSchema {
    return this.props[propertyName];
  }

  setVariable(variableName: string, schema: InstanceSchema) {
    if (!this.variables[variableName]) {
      this.variables[variableName] = schema;
      return;
    }
    set(this.variables[variableName], schema);
  }

  getVariable(variableName: string): InstanceSchema {
    return this.variables[variableName];
  }

  setHooks(hooks: HookSchema[]) {
    this.hooks = hooks;
  }
}
