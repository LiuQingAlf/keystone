const { Text, Integer } = require('@keystonejs/fields');
const { multiAdapterRunners, setupServer } = require('@keystonejs/test-utils');

const {
  createItems,
  createItem,
  deleteItem,
  deleteItems,
  getItem,
  getItems,
  updateItem,
  updateItems,
} = require('../lib/server-side-graphql-client');

const testData = [
  {
    data: {
      name: 'test',
      age: 30,
    },
  },
  { data: { name: 'test2', age: 40 } },
];
const schemaName = 'testing';

const seedDb = ({ keystone }) =>
  createItems({
    keystone,
    listName: 'Test',
    items: testData,
    context: keystone.createContext({ schemaName }),
  });

function setupKeystone(adapterName) {
  return setupServer({
    adapterName,
    createLists: keystone => {
      keystone.createList('Test', {
        fields: {
          name: { type: Text },
          age: { type: Integer },
        },
      });
    },
  });
}

multiAdapterRunners().map(({ runner, adapterName }) =>
  describe(`Adapter: ${adapterName}`, () => {
    describe('create', () => {
      test(
        'Should create and get single item',
        runner(setupKeystone, async ({ keystone }) => {
          // Seed the db
          const context = keystone.createContext({ schemaName });
          const item = await createItem({
            keystone,
            listName: 'Test',
            item: testData[0].data,
            context,
          });
          expect(typeof item.id).toBe('string');

          // Get single item from db
          const singleItem = await getItem({
            keystone,
            listName: 'Test',
            returnFields: 'name, age',
            itemId: item.id,
            context,
          });

          expect(singleItem).toEqual(testData[0].data);
        })
      );
      test(
        'Should create and get multiple items',
        runner(setupKeystone, async ({ keystone }) => {
          // Seed the db
          await seedDb({ keystone });
          const context = keystone.createContext({ schemaName });
          // Get all the items back from db
          const allItems = await getItems({
            keystone,
            listName: 'Test',
            returnFields: 'name, age',
            context,
          });

          expect(allItems).toEqual(testData.map(x => x.data));
        })
      );
    });
    describe('udpate', () => {
      test(
        'Should update single item',
        runner(setupKeystone, async ({ keystone }) => {
          // Seed the db
          const seedItems = await seedDb({ keystone });
          const context = keystone.createContext({ schemaName });
          // Update a single item
          const item = await updateItem({
            keystone,
            listName: 'Test',
            item: { id: seedItems[0].id, data: { name: 'updateTest' } },
            returnFields: 'name, age',
            context,
          });
          expect(item).toEqual({ name: 'updateTest', age: 30 });
        })
      );

      test(
        'Should update multiple items',
        runner(setupKeystone, async ({ keystone }) => {
          // Seed the db
          const seedItems = await seedDb({ keystone });
          const context = keystone.createContext({ schemaName });
          // Update multiple items
          const items = await updateItems({
            keystone,
            listName: 'Test',
            items: seedItems.map((item, i) => ({ id: item.id, data: { name: `update-${i}` } })),
            returnFields: 'name, age',
            context,
          });

          expect(items).toEqual([
            { name: 'update-0', age: 30 },
            { name: 'update-1', age: 40 },
          ]);
        })
      );
    });
    describe('delete', () => {
      test(
        'Should delete single item',
        runner(setupKeystone, async ({ keystone }) => {
          // Seed the db
          const items = await seedDb({ keystone });
          const context = keystone.createContext({ schemaName });
          // Delete a single item
          await deleteItem({
            keystone,
            listName: 'Test',
            returnFields: 'name age',
            itemId: items[0].id,
            context,
          });

          // Retrieve items
          const allItems = await getItems({
            keystone,
            listName: 'Test',
            returnFields: 'name, age',
            context,
          });

          expect(allItems).toEqual([{ name: 'test2', age: 40 }]);
        })
      );
      test(
        'Should delete multiple items',
        runner(setupKeystone, async ({ keystone }) => {
          // Seed the db
          const items = await seedDb({ keystone });
          const context = keystone.createContext({ schemaName });
          // Delete multiple items
          const deletedItems = await deleteItems({
            keystone,
            listName: 'Test',
            returnFields: 'name age',
            items: items.map(item => item.id),
            context,
          });

          expect(deletedItems).toEqual(testData.map(d => d.data));

          // Get all the items back from db
          const allItems = await getItems({
            keystone,
            listName: 'Test',
            returnFields: 'name, age',
            context,
          });

          expect(allItems).toEqual([]);
        })
      );
    });
    describe('getItems', () => {
      test(
        'Should get all items when no where clause',
        runner(setupKeystone, async ({ keystone }) => {
          // Seed the db
          await seedDb({ keystone });
          const context = keystone.createContext({ schemaName });
          const allItems = await getItems({
            keystone,
            listName: 'Test',
            returnFields: 'name, age',
            context,
          });

          expect(allItems).toEqual(testData.map(x => x.data));
        })
      );
      test(
        'Should get specific items with where clause',
        runner(setupKeystone, async ({ keystone }) => {
          // Seed the db
          await seedDb({ keystone });
          const context = keystone.createContext({ schemaName });
          const allItems = await getItems({
            keystone,
            listName: 'Test',
            context,
            returnFields: 'name',
            where: { name: 'test' },
          });

          expect(allItems).toEqual([{ name: 'test' }]);
        })
      );
    });
  })
);
