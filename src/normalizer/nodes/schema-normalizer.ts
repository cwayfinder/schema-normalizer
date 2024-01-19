import {
    ArrayNodeDescription, ChildNodeDescription, MapNodeDescription,
    NodeDescription,
    ObjectNodeDescription
} from "../../types/node-decription";
import {NormalizeContext} from "../node.normalizer";
import {ComponentSchemaId} from "../../mobx/types";
import {
    CommandSchema,
    ComponentRawSchema,
    NodeSchema,
    ValidatorNodeRawSchema, ValidatorSchema,
    VariableSchema
} from "../../types/schema";
import {schemaIdGenerator} from "../../util/id-generator";
import {ComponentSchema} from "../../mobx/component-schema";
import {validatorPropertiesDescriptions} from "../../types/validators";
import {Observable} from "../../mobx/Observable";


// todo: rework this part
function addResolverDataToParent(ctx: NormalizeContext<NodeDescription>, from: From, result: NodeSchema | { [key: string]: NodeSchema } )  {
    if(from.nodeType === 'component') {
        ctx.components![from.componentId!].props[from.nodeKey!].value = { resolverName: 'static', resolverData: result, coerced: false };
    }

    if(from.nodeType === 'array') {
        (ctx.components![from.componentId!].props[from.nodeKey!].value.resolverData as unknown[]).push(result.resolverData);
    }

    if(from.nodeType === 'object') {
        const resolvedData = ctx.components![from.componentId!].props[from.nodeKey!].value.resolverData as Record<string, NodeSchema>;
        ctx.components![from.componentId!].props[from.nodeKey!].value = { resolverName: 'static', resolverData: {...resolvedData, ...result}, coerced: false };
    }

}

type QueueItem = {schema: unknown, nodeDescription: NodeDescription, from: From};

type Queue = QueueItem[];

type From = {componentId: ComponentSchemaId | null, nodeKey: string, nodeType: string };


const normalizers = {
    component: (ctx: NormalizeContext<NodeDescription>, queue: Queue, queueItem: QueueItem) => {
        if (queueItem.schema === null || queueItem.schema === undefined) {
            return { resolverName: 'static', resolverData: null, coerced: ctx.rawSchema === undefined };
        }

        const rawSchema = queueItem.schema as ComponentRawSchema;

        if (rawSchema.customId && ctx.customIds![rawSchema.customId]) {
            throw new Error(`Duplicated customId "${rawSchema.customId}".`);
        }

        if (!rawSchema.componentType) {
            throw new Error(`Component schema "${JSON.stringify(ctx.rawSchema)}" has no componentType.`);
        }

        const componentSchemaId = schemaIdGenerator.generateId()

        const componentSchema =  new ComponentSchema({
            id: componentSchemaId,
            componentType: rawSchema.componentType,
            props: {},
            variables: {},
            hooks: rawSchema.hooks || [],
        })
        ctx.components![componentSchema.id] = componentSchema

        if(queueItem.from.componentId) {
            addResolverDataToParent(ctx, queueItem.from, { resolverName: 'static', resolverData: componentSchemaId, coerced: false })
        }

        const defaultRawSchema = ctx.store.getComponentComputedDefaultRawSchema(rawSchema.componentType);

        const mergedRawSchema = { ...defaultRawSchema, ...rawSchema };
        const descriptions =  ctx.store.getComponentComputedProperties(mergedRawSchema.componentType)

        const props = {} as Record<string, Observable<NodeSchema>>;
        for (const propDescription of descriptions) {
            const key = propDescription.key;

            if(propDescription.type === 'component') {
                queue.push({
                    schema: mergedRawSchema[key],
                    nodeDescription: propDescription,
                    from: { nodeKey: key, componentId: componentSchemaId, nodeType: 'component' }
                })
                continue;
            }

            props[key] = new Observable(normalizeNode(ctx, queue, {
                schema: mergedRawSchema[key],
                nodeDescription: propDescription,
                from: { nodeKey: key, componentId: componentSchemaId, nodeType: propDescription.type }
            }))
        }

        const variables: Record<string, Observable<VariableSchema>> = {};
        for (const [key, { description, schema }] of Object.entries(mergedRawSchema.variables || {})) {
            if (!description) {
                throw new Error(`Context variable "${key}" has no description.`);
            }
            const parsedSchema = normalizeNode(ctx, queue, {
                    schema: schema,
                    nodeDescription: description,
                    from: { nodeKey: key, componentId: componentSchemaId, nodeType: description.type }
                })
            variables[key] = new Observable<VariableSchema>({ description, schema: parsedSchema });
        }

        componentSchema.update({
            componentType: componentSchema.componentType,
            props,
            variables: {},
            hooks: mergedRawSchema.hooks || [],
        });

        return { resolverName: 'static', resolverData: componentSchemaId, coerced: false };
    },
    componentSchema: (ctx: NormalizeContext<NodeDescription>, queue: Queue, queueItem: QueueItem) => {
      return normalizers.component(ctx, queue, queueItem)
    },
    array: (_: NormalizeContext<NodeDescription>, queue: Queue, queueItem: QueueItem) => {
        if (!Array.isArray(queueItem.schema)) {
            throw new Error(
                `Array node schema "${JSON.stringify(queueItem.nodeDescription)}" must be an array. Got ${JSON.stringify(
                    queueItem.schema,
                )} instead.`,
            );
        }
        queueItem.schema.forEach((itemSchema) => {
            queue.push({
                schema: itemSchema,
                nodeDescription: (queueItem.nodeDescription as ArrayNodeDescription).items,
                from: {nodeKey: queueItem.from.nodeKey, componentId: queueItem.from.componentId, nodeType: 'array'}
            })
        })
        return {resolverName: 'static', resolverData: [], coerced: false}
    },
    object: (_: NormalizeContext<NodeDescription>, queue: Queue, queueItem: QueueItem) => {
        const rawSchema =  queueItem.schema  as Record<string, unknown>
        const resolverData: Record<string, NodeSchema> = {};
        for (const childNodeDescription of (queueItem.nodeDescription as ObjectNodeDescription).children) {
            queue.push({
                schema: rawSchema[childNodeDescription.key],
                nodeDescription: childNodeDescription,
                from: { nodeKey: queueItem.from.nodeKey, componentId: queueItem.from.componentId, nodeType: 'object' }
            })
        }
        return { resolverName: 'static', resolverData: resolverData, coerced: rawSchema === undefined }
    },
    map: (_: NormalizeContext<NodeDescription>, queue: Queue, queueItem: QueueItem) => {
        if (!queueItem.schema) {
            return { resolverName: 'static', resolverData: {}, coerced: queueItem.schema === undefined };
        }

        if (queueItem.schema && typeof queueItem.schema !== 'object') {
            throw new Error(`Invalid schema for "${queueItem.nodeDescription.key}"`);
        }

        const rawSchema = (queueItem.schema || {}) as Record<string, unknown>;
        const resolverData: Record<string, NodeSchema> = {};

        for (const [key, value] of Object.entries(rawSchema)) {
            queue.push({
                schema: value,
                nodeDescription: (queueItem.nodeDescription as MapNodeDescription).item,
                from: { nodeKey: queueItem.from.nodeKey, componentId: queueItem.from.componentId, nodeType: 'map'}
            })
        }

        return { resolverName: 'static', resolverData, coerced: queueItem.schema === undefined };
    },

    boolean: (ctx: NormalizeContext<NodeDescription>, __: Queue, queueItem: QueueItem) => {
        return {
            resolverName: 'static',
            resolverData: !!queueItem.schema,
            coerced: queueItem.schema === undefined,
            inverted: ctx.inverted,
        };
    },
    any: (_: NormalizeContext<NodeDescription>, __: Queue, queueItem: QueueItem) => {
        return { resolverName: 'static', resolverData: queueItem.schema, coerced: queueItem.schema === undefined };
    },
    string: (_: NormalizeContext<NodeDescription>, __: Queue, queueItem: QueueItem) => {
        const resolverData = queueItem.schema ? String(queueItem.schema) : '';
        return { resolverName: 'static', resolverData, coerced: queueItem.schema === undefined };
    },
    number: (_: NormalizeContext<NodeDescription>, __: Queue, queueItem: QueueItem) => {
        const result = Number(queueItem.schema);
        const resolverData = result || 0;
        return { resolverName: 'static', resolverData, coerced: queueItem.schema === undefined };
    },
    command: (ctx: NormalizeContext<NodeDescription>, __: Queue, queueItem: QueueItem) => {
        if (!queueItem.schema) {
            return { resolverName: 'static', resolverData: null, coerced: true };
        }

        if (typeof queueItem.schema === 'object' && 'runnerName' in queueItem.schema && 'runnerData' in queueItem.schema) {
            const rawCommandSchema = queueItem.schema;
            if (typeof rawCommandSchema.runnerName !== 'string') {
                throw new Error(`Command schema is invalid. Field "runnerName" must be string.`);
            }
            if (!rawCommandSchema.runnerData) {
                throw new Error(`Command schema is invalid. Field "runnerData" must be defined.`);
            }

            const commandSchema = rawCommandSchema as CommandSchema;
            return { resolverName: 'static', resolverData: commandSchema, coerced: false };
        }

        if (typeof ctx.rawSchema === 'function') {
            return {
                resolverName: 'static',
                resolverData: { runnerName: 'inline', runnerData: ctx.rawSchema },
                coerced: false,
            };
        }

        throw new Error(`Command schema is invalid. Got ${JSON.stringify(ctx.rawSchema)}.`);
    },
    validator: (ctx: NormalizeContext<NodeDescription>, queue: Queue, queueItem: QueueItem) => {
        function normalizeChildNodes(
            ctx: NormalizeContext<NodeDescription>,
            queue: Queue,
            queueItem: QueueItem,
            descriptions: ChildNodeDescription[],
            rawSchema: Record<string, unknown>,
        ): Record<string, NodeSchema> {
            const children: Record<string, NodeSchema> = {};
            for (const description of descriptions) {
                const key = description.key;
                const paramCtx: NormalizeContext<NodeDescription> = {
                    ...ctx,
                    nodeDescription: description,
                    rawSchema: rawSchema[key],
                };
                queue.push({
                    schema: rawSchema[key],
                    nodeDescription: description,
                    from: { nodeKey: queueItem.from.nodeKey, componentId: queueItem.from.componentId, nodeType: 'validator' }

                })
            }

            return children;
        }

        if (!queueItem.schema || typeof queueItem.schema !== 'object') {
            throw new Error(`Validator node schema "${JSON.stringify(ctx.rawSchema)}" is invalid. It must be an object.`);
        }

        const rawSchema = queueItem.schema as ValidatorNodeRawSchema;
        if (!rawSchema.validatorType) {
            throw new Error(
                `Validator node schema "${JSON.stringify(rawSchema)}" is invalid. It must contain field "validatorType".`,
            );
        }

        const props = normalizeChildNodes(ctx, queue, queueItem, validatorPropertiesDescriptions, rawSchema);

        const paramsDescriptions = ctx.store.getValidatorDefinition(rawSchema.validatorType).description.params;
        const params = normalizeChildNodes(ctx, queue, queueItem, paramsDescriptions, rawSchema);

        const resolverData = { validatorType: rawSchema.validatorType, ...props, params } as ValidatorSchema;
        return { resolverName: 'static', resolverData, coerced: false };
    }
}

function normalizeNode(ctx: NormalizeContext<NodeDescription>, queue: Queue, queueItem: QueueItem) {
    const schema = queueItem.schema
    if (typeof schema === 'string') {
        if (schema.startsWith('=')) {
            return {
                resolverName: 'formula',
                resolverData: schema.slice(1),
            };
        } else if (schema.startsWith('!=')) {
            return {
                resolverName: 'formula',
                resolverData: schema.slice(2),
                inverted: true,
            };
        }
    }

    if (schema && (schema as NodeSchema).resolverName) {
        return schema;
    }

    // @ts-ignore
    const impl = normalizers[queueItem.nodeDescription.type]
    if(impl) {
        return impl(ctx, queue, queueItem);
    }
    else {
        throw new Error("Not implemented")
    }
}

export function normalizeSchema(ctx: NormalizeContext<NodeDescription>) {
    ctx.components = ctx.components || {};
    ctx.customIds = ctx.customIds || {};
    ctx.parentId = ctx.parentId || null;

    const queue: Queue = [
        {
            schema: ctx.rawSchema,
            nodeDescription: ctx.nodeDescription,
            from:  {componentId: '', nodeKey: '', nodeType: ''}
        },
    ];

    while (queue.length > 0) {
        const queueItem = queue.shift()!;
        const resolved = normalizeNode(ctx, queue, queueItem);

        addResolverDataToParent(ctx, queueItem.from, resolved)

    }

    return { resolverName: 'static', resolverData: Object.keys(ctx.components)[0], coerced: false };

}