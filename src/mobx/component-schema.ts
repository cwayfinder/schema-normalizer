import {action, createAtom, makeObservable, observable, set, toJS} from 'mobx';
import { ComponentSchemaId } from './types';
import { HookSchema, NodeSchema, VariableSchema } from '../types/schema';
import { schemaIdGenerator } from '../util/id-generator';
import {IAtom} from "mobx/src/core/atom";

interface ComponentSchemaCreateConfig {
  id: ComponentSchemaId;
  componentType: string;
  props: Record<string, NodeSchema>;
  variables: Record<string, VariableSchema>;
  hooks: HookSchema[];
}

interface ComponentSchemaUpdateConfig {
  componentType: string;
  props: Record<string, NodeSchema>;
  variables: Record<string, VariableSchema>;
  hooks: HookSchema[];
}

export class ComponentSchema {
  private atom: IAtom;
  readonly id: ComponentSchemaId;
  componentType: string;
  props: Record<string, NodeSchema>;
  variables: Record<string, VariableSchema>;
  hooks: HookSchema[];

  constructor(config: ComponentSchemaCreateConfig) {
    this.id = config.id;
    this.componentType = config.componentType;
    this.props = config.props;
    this.variables = config.variables;
    this.hooks = config.hooks;

    // Creates an atom to interact with the MobX core algorithm.
    this.atom = createAtom(`ComponentSchema ${config.id}`)


    // makeObservable(this, {
    //   id: false,
    //
    //   componentType: observable,
    //   // props: observable,
    //
    //   variables: observable,
    //   // hooks: observable,
    //
    //   setProperty: action,
    //   setVariable: action,
    //   setHooks: action,
    // });
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
    this.props[propertyName] = propertySchema;
    this.atom.reportChanged();
  }

  getProperty(propertyName: string): NodeSchema {
    this.atom.reportObserved();
    return this.props[propertyName];
  }

  setVariable(variableName: string, schema: VariableSchema) {
    if (!this.variables[variableName]) {
      this.variables[variableName] = schema;
      return;
    }
    set(this.variables[variableName], schema);
  }

  getVariable(variableName: string): VariableSchema {
    return this.variables[variableName];
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
