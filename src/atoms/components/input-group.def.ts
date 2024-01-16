import { ComponentDescription } from '../../types/component-description';

export const description: ComponentDescription = {
  traits: ['compositeInput'],
  properties: [
    { key: 'value', type: 'map', item: { type: 'any' } },
    { key: 'children', type: 'array', items: { type: 'component' }, overridable: false },
  ],
};

export const defaultSchema = {
  value: `=propObject('children :input', 'inputKey', 'value')`,

  hooks: [
    {
      trigger: {
        name: 'afterComponentRender',
      },

      runner: {
        name: 'js',
        data: `
          const keys = yield propArray('children :input', 'inputKey');

          // @TODO: Remove me
          if(Object.keys(_value).length === 0) return

          for (const key of keys) {
            setValue('[inputKey=' + key + ']', _value[key]);
          }
        `,
      },
      overridable: false,
    },
    {
      trigger: {
        name: 'afterValueChange',
      },
      runner: {
        name: 'js',
        data: `
          const keys = yield propArray('children :input', 'inputKey');
          const value = yield getProperty('', 'value');

          for (const key of keys) {
            if (!(key in value)) {
              value[key] = null;
            }
          };
          setValue('', value);

          for (const key of keys) {
            setValue('[inputKey=' + key + ']', value[key]);
          }
        `,
      },
      overridable: false,
    },
  ],
};
