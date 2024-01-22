import { Store } from './mobx/store';
import { normalizeSchema } from './normalizer/instance.normalizer.';
import { components } from './atoms/components';
import { toJS } from 'mobx';
import { dropdowns } from './schemas/dropdowns';
import { nestedInputGroups } from './schemas/nested-input-groups';

function initSchema(): void {
  const store = new Store();
  store.setComponentDefinitions(components);

  const rawSchema = nestedInputGroups;
  console.log(rawSchema);

  const instanceSchema = normalizeSchema(rawSchema, { type: 'component' }, store);
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


