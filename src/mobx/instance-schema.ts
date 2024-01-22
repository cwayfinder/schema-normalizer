import { ComponentSchemaId, NodeDefinition } from './types';
import { ComponentSchema } from './component-schema';

export class InstanceSchema {
  constructor(
    private root: NodeDefinition | null = null,
    private readonly components: Record<ComponentSchemaId, ComponentSchema> = {},
    private readonly byCustomId: Record<ComponentSchemaId, ComponentSchemaId> = {},
  ) {
  }

  getComponent(id: ComponentSchemaId): ComponentSchema | null {
    return this.components[id] || null;
  }

  addComponent(id: ComponentSchemaId, component: ComponentSchema): void {
    this.components[id] = component;
  }

  removeComponent(id: ComponentSchemaId) {
    delete this.components[id];
  }

  moveComponent(path: string[], newPath: string[]) {
    throw new Error('Not implemented');
  }

  setCustomId(id: ComponentSchemaId, customId: ComponentSchemaId) {
    this.byCustomId[customId] = id;
  }

  getComponentByCustomId(customId: ComponentSchemaId): ComponentSchema | null {
    const id = this.byCustomId[customId];
    return id ? this.components[id] : null;
  }

  getComponentByPath(path: string): ComponentSchema | null {
    throw new Error('Not implemented');
  }
}
