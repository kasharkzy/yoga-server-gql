import SchemaBuilder from "@pothos/core";

const builder = new SchemaBuilder({})

builder.queryType({
  fields: t => ({
    hello: t.string({
      resolve: () => 'world'
    })
  })
})

export const helloschema = builder.toSchema()