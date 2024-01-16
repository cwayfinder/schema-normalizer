import {
  ArrayNodeDescription,
  BooleanNodeDescription,
  CommandNodeDescription,
  ComponentNodeDescription,
  MapNodeDescription,
  NodeDescription,
  NodeDescriptions,
  NumberNodeDescription,
  ObjectNodeDescription,
  StringNodeDescription,
  ValidatorNodeDescription,
} from '../types/node-decription';

import { normalizeArray } from './nodes/array.normalizer';
import { normalizeDefault } from './nodes/default.normalizer';
import { normalizeBoolean } from './nodes/boolean.normalizer';
import { normalizeString } from './nodes/string.normalizer';
import { normalizeNumber } from './nodes/number.normalizer';
import { normalizeObject } from './nodes/object.normalizer';
import { normalizeComponent } from './nodes/component.normalizer';
import { normalizeValidator } from './nodes/validator.normalizer';
import { normalizeCommand } from './nodes/command.normalizer';
import { NormalizeContext } from './node.normalizer';
import { normalizeMap } from './nodes/map.normalizer';

export const registry: Record<string, (ctx: NormalizeContext<NodeDescription>) => unknown> = {
  any: (ctx) => normalizeDefault(ctx as NormalizeContext<NodeDescriptions>),
  boolean: (ctx) => normalizeBoolean(ctx as NormalizeContext<BooleanNodeDescription>),
  string: (ctx) => normalizeString(ctx as NormalizeContext<StringNodeDescription>),
  number: (ctx) => normalizeNumber(ctx as NormalizeContext<NumberNodeDescription>),
  array: (ctx) => normalizeArray(ctx as NormalizeContext<ArrayNodeDescription>),
  object: (ctx) => normalizeObject(ctx as NormalizeContext<ObjectNodeDescription>),
  map: (ctx) => normalizeMap(ctx as NormalizeContext<MapNodeDescription>),
  component: (ctx) => normalizeComponent(ctx as NormalizeContext<ComponentNodeDescription>),
  componentSchema: (ctx) => normalizeComponent(ctx as NormalizeContext<ComponentNodeDescription>),
  validator: (ctx) => normalizeValidator(ctx as NormalizeContext<ValidatorNodeDescription>),
  command: (ctx) => normalizeCommand(ctx as NormalizeContext<CommandNodeDescription>),
};
