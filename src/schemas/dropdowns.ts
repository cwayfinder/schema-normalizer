export const dropdowns: any = {
  componentType: 'inputGroup',
  children: [
    {
      inputKey: 'myInput1',
      componentType: 'dropdown',
      options: '=$options',
    },
    {
      inputKey: 'myInput2',
      componentType: 'dropdown',
      options: '=$options',
      itemSchema: {
        componentType: 'html',
        html: `=$option.label`,
      },
      selectedItem: {
        componentType: 'html',
        html: `=$option.label`,
        variables: {
          option: {
            description: { type: 'any' },
            schema: `=prop('^dropdown', 'selectedOption')`,
          },
        },
      },
    },
    {
      inputKey: 'myInput3',
      componentType: 'dropdown',
      options: '=$options',
      itemSchema: {
        componentType: 'html',
        html: `=$option.label`,
      },
      selectedItem: {
        componentType: 'html',
        html: `=pluck(prop('^dropdown', 'selectedOption'), 'label)`,
      },
    },
    {
      inputKey: 'myInput4',
      componentType: 'dropdown',
      options: '=$options',
      itemSchema: `=$dummyItem`,
      selectedItem: `=$dummyItem`,
      variables: {
        dummyItem: {
          description: { type: 'component' },
          schema: {
            componentType: 'html',
            html: `=$option.label`,
          },
        },
      },
    },
  ],
  variables: {
    options: {
      description: { type: 'array', items: { type: 'any' } },
      schema: [
        { label: 'English', value: 'EN' },
        { label: 'French', value: 'FR' },
        { label: 'German', value: 'DE' },
      ],
    },
  },
};
