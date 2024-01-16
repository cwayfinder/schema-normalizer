import { action, makeObservable, observable } from 'mobx';
import { ComponentDefinition, InstanceSchemaId } from './types';
import { InstanceSchema } from './instance-schema';
import { ComponentSchema } from './component-schema';
import { PropertyDescription } from '../types/component-description';
import { ComponentDefaultRawSchema } from '../types/schema';
import { ValidatorDefinition } from '../types/validators';
import { CommandDefinition, FormulaFunctionDefinition } from '../types/commands';

export class Store {
  instanceSchemas: Record<InstanceSchemaId, InstanceSchema>;

  componentDefinitions: { [componentType: string]: ComponentDefinition };
  validatorDefinitions: { [validatorType: string]: ValidatorDefinition };
  formulaFunctionDefinitions: { [functionType: string]: FormulaFunctionDefinition };
  commandDefinitions: { [commandType: string]: CommandDefinition };

  constructor() {
    this.instanceSchemas = {};

    this.componentDefinitions = {};
    this.validatorDefinitions = {};
    this.formulaFunctionDefinitions = {};
    this.commandDefinitions = {};

    makeObservable(this, {
      instanceSchemas: observable,

      componentDefinitions: observable,
      validatorDefinitions: observable,
      formulaFunctionDefinitions: observable,
      commandDefinitions: observable,

      setInstanceSchema: action,
    });
  }

  setInstanceSchema(instanceId: InstanceSchemaId, instance: InstanceSchema): void {
    this.instanceSchemas[instanceId] = instance;
  }

  removeInstanceSchema(instanceId: InstanceSchemaId): void {
    delete this.instanceSchemas[instanceId];
  }

  getInstanceSchema(instanceSchemaId: string): InstanceSchema {
    const instance = this.instanceSchemas[instanceSchemaId];
    if (!instance) {
      throw new Error(`Instance with id "${instanceSchemaId}" is not found.`);
    }
    return instance;
  }

  getComponentSchema(instanceSchemaId: string, componentSchemaId: string): ComponentSchema {
    const componentSchema = this.getInstanceSchema(instanceSchemaId).getComponent(componentSchemaId);
    if (!componentSchema) {
      throw new Error(`Component with id "${componentSchemaId}" is not found.`);
    }
    return componentSchema;
  }

  getComponentIdByCustomId(instanceSchemaId: string, customId: string): string | undefined {
    return this.getInstanceSchema(instanceSchemaId).byCustomId[customId];
  }

  setComponentDefinition(componentType: string, componentDefinition: ComponentDefinition): void {
    this.componentDefinitions[componentType] = componentDefinition;
  }

  setComponentDefinitions(componentDefinitions: Record<string, ComponentDefinition>): void {
    for (const [componentType, componentDefinition] of Object.entries(componentDefinitions)) {
      this.componentDefinitions[componentType] = componentDefinition;
    }
  }

  getComponentDefinition(componentType: string): ComponentDefinition {
    const componentDefinition = this.componentDefinitions[componentType];
    if (!componentDefinition) {
      throw new Error(`Component with type "${componentType}" is not found.`);
    }
    return componentDefinition;
  }

  getComponentTraits(componentType: string): string[] {
    const description = this.getComponentDefinition(componentType).description;
    const traits = description.traits || [];
    const superTraits = traits.flatMap((trait) => this.getComponentTraits(trait));
    const result = [...superTraits, ...traits, componentType];

    return [...new Set(result)];
  }

  getComponentComputedProperties(componentType: string): PropertyDescription[] {
    const traits = this.getComponentTraits(componentType);
    const descriptions = traits.map((trait) => this.getComponentDefinition(trait).description);

    const allPropsFromAllTraits = descriptions.flatMap((description) => description.properties || []);

    const propMap: Record<string, PropertyDescription> = {};
    for (const prop of allPropsFromAllTraits) {
      propMap[prop.key] = prop;
    }

    return Object.values(propMap);
  }

  getNodeDescription(componentType: string, path: string): PropertyDescription {
    // TODO: support nested paths

    const descriptions = this.getComponentComputedProperties(componentType);
    const description = descriptions.find((d) => d.key === path);
    if (!description) {
      throw new Error(`Property "${path}" is not found in component "${componentType}".`);
    }
    return description;
  }

  getComponentComputedDefaultRawSchema(componentType: string): ComponentDefaultRawSchema {
    const traitDefinitions = this.getComponentTraits(componentType).map((traitName) =>
      this.getComponentDefinition(traitName),
    );
    const schemas = traitDefinitions.filter((entry) => entry.defaultSchema).map((entry) => entry.defaultSchema);
    return schemas.reduce(
      (acc, schema) => {
        const hooks = [...(acc.hooks || []), ...(schema.hooks || [])];
        const variables = { ...acc.variables, ...(schema.variables || {}) };
        return { ...acc, ...schema, hooks, variables };
      },
      { hooks: [], variables: {} } as ComponentDefaultRawSchema,
    );
  }

  getComponentTypes(): string[] {
    return Object.keys(this.componentDefinitions);
  }

  setValidatorDefinitions(definitions: Record<string, ValidatorDefinition>): void {
    for (const [validatorType, validatorDefinition] of Object.entries(definitions)) {
      this.validatorDefinitions[validatorType] = validatorDefinition;
    }
  }

  getValidatorDefinition(validatorType: string): ValidatorDefinition {
    const validatorDefinition = this.validatorDefinitions[validatorType];
    if (!validatorDefinition) {
      throw new Error(`Validator with type "${validatorType}" is not found.`);
    }

    return validatorDefinition;
  }

  getValidatorTypes(): string[] {
    return Object.keys(this.validatorDefinitions);
  }

  setCommandDefinitions(definitions: Record<string, CommandDefinition>): void {
    for (const [commandType, definition] of Object.entries(definitions)) {
      this.setCommandDefinition(commandType, definition);
    }
  }

  setCommandDefinition(commandType: string, definition: CommandDefinition): void {
    this.commandDefinitions[commandType] = definition;
  }

  getCommandDefinition(commandType: string): CommandDefinition {
    const commandDefinition = this.commandDefinitions[commandType];
    if (!commandDefinition) {
      throw new Error(`Command with type "${commandType}" is not found.`);
    }

    return commandDefinition;
  }

  getCommandNames(): string[] {
    return Object.keys(this.commandDefinitions);
  }

  setFormulaFunctionDefinitions(definitions: Record<string, FormulaFunctionDefinition>): void {
    for (const [functionType, definition] of Object.entries(definitions)) {
      this.setFormulaFunctionDefinition(functionType, definition);
    }
  }

  setFormulaFunctionDefinition(functionType: string, definition: FormulaFunctionDefinition): void {
    this.formulaFunctionDefinitions[functionType] = definition;
  }

  getFormulaFunctionDefinition(functionType: string): FormulaFunctionDefinition {
    const definition = this.formulaFunctionDefinitions[functionType];
    if (!definition) {
      throw new Error(`Formula function with type "${functionType}" is not found.`);
    }

    return definition;
  }
}
