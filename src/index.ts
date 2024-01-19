import {Store} from './mobx/store';
import {normalizeInstance} from './normalizer/instance.normalizer.';
import {components} from './atoms/components';
import {nestedInputGroups} from './schemas/nested-input-groups';
import {reaction, toJS} from 'mobx';
import {Observable} from "./mobx/Observable";

function initSchema(): void {
  const store = new Store();
  store.setComponentDefinitions(components);

  const rawSchema = nestedInputGroups;
  console.log(rawSchema);

  const instanceSchema = normalizeInstance(rawSchema, store);
  const instanceSchemaId = 'anonymous-schema-1';
  store.setInstanceSchema(instanceSchemaId, instanceSchema);

  console.log(toJS(store.getInstanceSchema(instanceSchemaId)));

  const inputSchemaId = Object.keys(instanceSchema.components).pop()!;
  const inputSchema = instanceSchema.getComponent(inputSchemaId)!

  // reactive wrapper for each prop/variable
  reaction(() => inputSchema.getProperty('value'), (next) => {
    console.log('value changed', next)
  }, {fireImmediately: true})

  setInterval(() => {
    inputSchema.setProperty('value', {
      resolverName: 'static',
      resolverData: Math.random(),
    })
  }, 1000);



}

const button = document.getElementById('init') as HTMLButtonElement;
button.addEventListener('click', () => {
  initSchema();

  button.textContent = 'Initialized';
  button.disabled = true;
});


