import { action, makeObservable, observable } from 'mobx';
import { ComponentSchemaId } from './types';
import { ComponentSchema } from './component-schema';

export class InstanceSchema {
  components: Record<ComponentSchemaId, ComponentSchema>;
  rootId: ComponentSchemaId | null;
  byCustomId: Record<ComponentSchemaId, ComponentSchemaId>;

  constructor(
    components: Record<ComponentSchemaId, ComponentSchema> = {},
    rootId: ComponentSchemaId | null = null,
    byCustomId: Record<ComponentSchemaId, ComponentSchemaId> = {}
  ) {
    this.components = components;
    this.rootId = rootId;
    this.byCustomId = byCustomId;

    makeObservable(this, {
      components: observable,
      rootId: observable,
      byCustomId: observable,

      addComponent: action,
      removeComponent: action,
      moveComponent: action,
      setCustomId: action,
    });
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
