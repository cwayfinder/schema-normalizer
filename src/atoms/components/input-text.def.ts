import { ComponentDescription } from '../../types/component-description';

export const description: ComponentDescription = {
  traits: ['input'],
  properties: [
    { key: 'placeholder', type: 'string' },
    { key: 'icon', type: 'string' },
    { key: 'iconPosition', type: 'string' },
  ],
};

export const defaultSchema = {
  placeholder: '',
  icon: null,
  iconPosition: 'left',
};
