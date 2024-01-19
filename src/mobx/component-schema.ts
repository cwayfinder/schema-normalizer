import {  toJS} from 'mobx';
import { ComponentSchemaId } from './types';
import { HookSchema, NodeSchema, VariableSchema } from '../types/schema';
import { schemaIdGenerator } from '../util/id-generator';
import { Observable} from "./Observable";

interface ComponentSchemaCreateConfig {
  id: ComponentSchemaId;
  componentType: string;
  props: Record<string, Observable<NodeSchema>>;
  variables: Record<string, Observable<VariableSchema>>;
  hooks: HookSchema[];
}

interface ComponentSchemaUpdateConfig {
  componentType: string;
  props: Record<string, Observable<NodeSchema>>;
  variables: Record<string, Observable<VariableSchema>>;
  hooks: HookSchema[];
}

export class ComponentSchema {
  readonly id: ComponentSchemaId;
  componentType: string;
  props: Record<string, Observable<NodeSchema>>;
  variables: Record<string, Observable<VariableSchema>>;
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
      this.props[propertyName] = new Observable(propertySchema);
      return;
    }
    this.props[propertyName].value = propertySchema;
  }

  getProperty(propertyName: string): NodeSchema {
    return this.props[propertyName].value;
  }

  setVariable(variableName: string, schema: VariableSchema) {
    if (!this.variables[variableName]) {
      this.variables[variableName] = new Observable(schema);
      return;
    }
    this.variables[variableName].value = schema;
  }

  getVariable(variableName: string): VariableSchema {
    return this.variables[variableName].value;
  }

  setHooks(hooks: HookSchema[]) {
    this.hooks = hooks;
  }

  clone(id = schemaIdGenerator.generateId()): ComponentSchema {
    const { props, variables, hooks, componentType } = toJS(this);

    return new ComponentSchema({
      id,
      componentType,
      props,
      variables,
      hooks,
    });
  }
}
