import { ComponentDescription } from '../../types/component-description';

export const description: ComponentDescription = {
  traits: ['input'],
  properties: [
    { key: 'placeholder', type: 'string' },
    { key: 'group', type: 'boolean', label: 'Grouped', altLabel: 'Flat' },
    { key: 'filter', type: 'boolean', label: 'Filter', altLabel: 'No filter' },
    { key: 'filterBy', type: 'string' },

    {
      key: 'options',
      type: 'array',
      items: { type: 'map', item: { type: 'any' } },
    },
    { key: 'selectedOption', type: 'map', item: { type: 'any' } },

    { key: 'optionGroupLabel', type: 'string' },
    { key: 'optionGroupChildren', type: 'string' },
    { key: 'optionLabel', type: 'string' },
    { key: 'optionValue', type: 'string' },

    // { key: 'groupRenderer', type: 'component' },
    { key: 'itemSchema', type: 'componentSchema' },

    { key: 'items', type: 'array', items: { type: 'component' } },
    { key: 'selectedItem', type: 'component' },
  ],
};

export const defaultSchema = {
  placeholder: 'Select...',
  filterBy: 'label',
  selectedOption: `=findBy(if(group, flatten(pluck(options, 'items')), options) , 'value', value)`,

  group: false,

  optionGroupLabel: 'label',
  optionGroupChildren: 'items',
  optionLabel: 'label',
  optionValue: 'value',

  itemSchema: {
    componentType: 'html',
    html: `=$option.label`,
  },

  selectedItem: `=with(itemSchema, null, { option: selectedOption })`,

  hooks: [
    {
      trigger: {
        name: 'afterPropertyChange',
        params: {
          propertyName: 'options',
        },
      },
      runner: {
        name: 'js',
        data: `
          const source = yield getProperty('', 'options');
          const target = yield getProperty('', 'items');
          const itemSchema = yield getProperty('', 'itemSchema');
          const group = yield getProperty('', 'group');

          if(group) {
           const flatItems = source.map(groupOption => groupOption.items).flat();
           syncComponents(flatItems, target, itemSchema, { 'option': 'item' })
          } else {
           syncComponents(source, target, itemSchema, { 'option': 'item' })
          }
        `,
      },
    },
  ],
};
