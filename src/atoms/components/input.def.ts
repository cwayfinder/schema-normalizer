import { ComponentDescription } from '../../types/component-description';

export const description: ComponentDescription = {
  traits: ['component'],
  properties: [
    { key: 'inputKey', type: 'string' },
    { key: 'value', type: 'any' },

    {
      key: 'validators',
      type: 'array',
      items: { type: 'validator' },
    },

    {
      key: 'setValue',
      type: 'command',
      overridable: false,
      args: [{ key: 'value', type: 'any' }],
    },
    { key: 'touch', type: 'command', overridable: false },

    { key: 'dirty', type: 'boolean', label: 'Dirty', altLabel: 'Clean', overridable: false },
    { key: 'touched', type: 'boolean', label: 'Touched', altLabel: 'Untouched', overridable: false },
    {
      key: 'validity',
      type: 'object',
      children: [
        { key: 'valid', type: 'boolean', label: 'Valid', altLabel: 'Invalid' },
        {
          key: 'errors',
          type: 'array',
          items: {
            type: 'object',
            children: [
              { key: 'validatorType', type: 'string' },
              { key: 'message', type: 'string' },
            ],
          },
        },
      ],
      overridable: false,
    },
  ],
};

export const defaultSchema = {
  value: null,

  setValue: {
    runnerName: 'js',
    runnerData: `setValue('', args[0])`,
  },
  touch: {
    runnerName: 'js',
    runnerData: `setProperty('', 'touched', true)`,
  },

  dirty: false,
  touched: false,
  validators: [],
  validity: '=validate(value, validators)',
};
