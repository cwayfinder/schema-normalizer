import { ComponentDescription } from '../../types/component-description';

export const description: ComponentDescription = {
  traits: [],
  properties: [
    { key: 'disabled', type: 'boolean', label: 'Disabled', altLabel: 'Enabled' },
    { key: 'hidden', type: 'boolean', label: 'Hidden', altLabel: 'Visible' },
  ],
};

export const defaultSchema = {
  disabled: false,
  hidden: false,
};
