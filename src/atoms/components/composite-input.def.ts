import { ComponentDescription } from '../../types/component-description';

export const description: ComponentDescription = {
  traits: ['input'],
  properties: [
    { key: 'value', type: 'any', overridable: false },
    {
      key: 'selfValidity',
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
    { key: 'subInputsValid', type: 'boolean', label: 'Valid', altLabel: 'Invalid', overridable: false },
  ],
};

export const defaultSchema = {
  touched: `=some(propArray('children :input', 'touched'))`,
  dirty: `=some(propArray('children :input', 'dirty'))`,

  selfValidity: '=validate(value, validators)',
  subInputsValid: `=every(propArray('children :input', 'validity.valid'))`,
  validity: `={ valid: and(selfValidity.valid, subInputsValid), errors: selfValidity.errors }`,
};
