import { ComponentRawSchema } from '../types/schema';

const createArrayElement = (index: number): ComponentRawSchema => {
  return {
    componentType: 'inputGroup',
    inputKey: `group-${index}`,
    children: [
      {
        componentType: 'inputText',
        inputKey: `input-${index}`,
        value: Math.random(),
        placeholder: 'inputGroup' + index,
      },
    ],
  };
};

function createChildren(length: number): ComponentRawSchema[] {
  return [...Array(length)].map((_, index) => createArrayElement(index));
}

export const nestedInputGroups: ComponentRawSchema = {
  componentType: 'inputGroup',
  inputKey: `root-group`,
  children: createChildren(10_000),
};
