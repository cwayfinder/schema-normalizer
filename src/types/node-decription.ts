export interface NodeDescription {
  readonly type: string;
  readonly key?: string;
  readonly required?: boolean;
  readonly overridable?: boolean;
  readonly label?: string;
  readonly description?: string;
}

export type ChildNodeDescription = NodeDescription & { readonly key: string };

export type ChildNodeDescriptions = NodeDescriptions & { readonly key: string };

export interface AnyNodeDescription extends NodeDescription {
  readonly type: 'any';
  readonly required?: boolean;
}

export interface StringNodeDescription extends NodeDescription {
  readonly type: 'string';
  readonly required?: boolean;
  readonly htmlAllowed?: boolean;
  readonly enum?: { value: string; label: string }[];
}

export interface NumberNodeDescription extends NodeDescription {
  readonly type: 'number';
  readonly required?: boolean;
  readonly min?: number;
  readonly max?: number;
}

export interface BooleanNodeDescription extends NodeDescription {
  readonly type: 'boolean';
  readonly altLabel?: string;
}

export interface ArrayNodeDescription extends NodeDescription {
  readonly type: 'array';
  readonly items: NodeDescriptions;
}

// export type ObjectNodeDescription = NodeDescription &
//   { readonly type: 'object' } &
//   ({
//     readonly flexible?: false;
//     readonly children: ChildNodeDescription[];
//   } | {
//     readonly flexible: true;
//   });

export interface ObjectNodeDescription extends NodeDescription {
  readonly type: 'object';
  readonly children: ChildNodeDescriptions[];
  readonly nullable?: boolean;
}

export interface MapNodeDescription extends NodeDescription {
  readonly type: 'map';
  readonly item: NodeDescriptions;
}

export interface ComponentNodeDescription extends NodeDescription {
  readonly type: 'component';
  readonly prototype?: boolean;
}

export interface ComponentSchemaNodeDescription extends NodeDescription {
  readonly type: 'componentSchema';
}

export interface ValidatorNodeDescription extends NodeDescription {
  readonly type: 'validator';
}

export interface CommandNodeDescription extends NodeDescription {
  readonly type: 'command';
  readonly args?: ChildNodeDescriptions[];
  readonly returns?: string;
}

export type NodeDescriptions =
  | AnyNodeDescription
  | StringNodeDescription
  | NumberNodeDescription
  | BooleanNodeDescription
  | ArrayNodeDescription
  | ObjectNodeDescription
  | MapNodeDescription
  | ComponentNodeDescription
  | ComponentSchemaNodeDescription
  | ValidatorNodeDescription
  | CommandNodeDescription;
