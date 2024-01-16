import { Store } from './mobx/store';
import { normalizeInstance } from './normalizer/instance.normalizer.';
import { components } from './atoms/components';
import { nestedInputGroups } from './schemas/nested-input-groups';
import { toJS } from 'mobx';

function initSchema(): void {
  const store = new Store();
  store.setComponentDefinitions(components);

  const rawSchema = nestedInputGroups;
  console.log(rawSchema);

  const instanceSchema = normalizeInstance(rawSchema, store);
  const instanceSchemaId = 'anonymous-schema-1';
  store.setInstanceSchema(instanceSchemaId, instanceSchema);

  console.log(toJS(store.getInstanceSchema(instanceSchemaId)));
}

const button = document.getElementById('init') as HTMLButtonElement;
button.addEventListener('click', () => {
  initSchema();

  button.textContent = 'Initialized';
  button.disabled = true;
});


