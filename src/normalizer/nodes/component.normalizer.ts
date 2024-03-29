import { ComponentNodeDescription, NodeDescription } from '../../types/node-decription';
import { NormalizeContext, normalizeNode } from '../node.normalizer';
import { ComponentNodeSchema, ComponentRawSchema, NodeSchema, VariableSchema } from '../../types/schema';
import { ComponentSchema } from '../../mobx/component-schema';
import { schemaIdGenerator } from '../../util/id-generator';

export function normalizeComponent(ctx: NormalizeContext<ComponentNodeDescription>): ComponentNodeSchema {
  ctx.components = ctx.components || {};
  ctx.customIds = ctx.customIds || {};
  ctx.parentId = ctx.parentId || null;

  if (ctx.rawSchema === null || ctx.rawSchema === undefined) {
    return { resolverName: 'static', resolverData: null, coerced: ctx.rawSchema === undefined };
  }

  const rawSchema = ctx.rawSchema as ComponentRawSchema;

  if (rawSchema.customId && ctx.customIds[rawSchema.customId]) {
    throw new Error(`Duplicated customId "${rawSchema.customId}".`);
  }

  if (!rawSchema.componentType) {
    throw new Error(`Component schema "${JSON.stringify(ctx.rawSchema)}" has no componentType.`);
  }

  const defaultRawSchema = ctx.store.getComponentComputedDefaultRawSchema(rawSchema.componentType);
  const mergedRawSchema = { ...defaultRawSchema, ...rawSchema };

  const componentSchemaId = schemaIdGenerator.generateId();
  const propsDescriptions = ctx.store.getComponentComputedProperties(mergedRawSchema.componentType);
  const props: Record<string, NodeSchema> = {};
  for (const propDescription of propsDescriptions) {
    const key = propDescription.key;

    const nodeCtx: NormalizeContext<NodeDescription> = {
      ...ctx,
      rawSchema: mergedRawSchema[key],
      nodeDescription: propDescription,
      parentId: componentSchemaId!,
    };
    props[key] = normalizeNode(nodeCtx);
  }

  const variables: Record<string, VariableSchema> = {};
  for (const [key, { description, schema }] of Object.entries(mergedRawSchema.variables || {})) {
    if (!description) {
      throw new Error(`Context variable "${key}" has no description.`);
    }

    const nodeCtx: NormalizeContext<NodeDescription> = {
      ...ctx,
      rawSchema: schema,
      nodeDescription: description,
      parentId: componentSchemaId!,
    };
    const parsedSchema = normalizeNode(nodeCtx);
    variables[key] = { description, schema: parsedSchema };
  }

  const componentSchema = new ComponentSchema({
    id: componentSchemaId,
    componentType: rawSchema.componentType,
    props,
    variables,
    hooks: mergedRawSchema.hooks || [],
  });

  ctx.components[componentSchemaId] = componentSchema;

  if (rawSchema.customId) {
    ctx.customIds[rawSchema.customId] = componentSchemaId;
  }

  return { resolverName: 'static', resolverData: componentSchemaId, coerced: false };
}
