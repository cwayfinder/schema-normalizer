import { ComponentDefinition } from '../../mobx/types';
import * as component from './component.def';
import * as input from './input.def';
import * as compositeInput from './composite-input.def';
import * as inputGroup from './input-group.def';
import * as inputText from './input-text.def';
import * as dropdown from './dropdown.def';
import * as html from './html.def';

export const components: Record<string, ComponentDefinition> = {
  component,
  input,
  compositeInput,

  inputGroup,
  inputText,
  dropdown,
  html,
};
