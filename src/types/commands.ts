import { IObservableValue } from 'mobx';
import { Store } from '../mobx/store';

export interface FunctionContext {
  store: Store;
  nodeRelativePath?: string;
}

export type CommandExecute<TResult> = (ctx: FunctionContext, ...params: any[]) => TResult | Promise<TResult>;

export type CommandDefinition = {
  execute: CommandExecute<unknown>;
};

export type FormulaFunctionExecute<TResult> = (
  ctx: FunctionContext,
  ...params: any[]
) => TResult | Promise<TResult> | IObservableValue<TResult>;

export type FormulaFunctionDefinition = {
  execute: FormulaFunctionExecute<unknown>;
};
