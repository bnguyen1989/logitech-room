import { generateMock } from '@anatine/zod-mock';

import { AssetV2, CreateAssetV2Props } from '../assetsV2/AssetsV2.js';
import client from '../Common.test.js';
import { WRONG_ID } from '../Common.test.js';
import {
  CreateSavedConfigurationProps,
  SavedConfiguration
} from '../savedConfigurations/SavedConfigurations.js';
import { CreateOrderProps, Order, OrderListing } from './Orders.js';

const CreateAssetV2PropsMock = CreateAssetV2Props.omit({ orgId: true });
const CreateSavedConfigurationPropsMock = CreateSavedConfigurationProps.omit({
  productId: true,
  attachments: true
});
const CreateOrderPropsMock = CreateOrderProps.omit({
  orgId: true,
  cart: true
});

describe('Orders', () => {
  let asset1: AssetV2;
  let savedConfiguration1: SavedConfiguration;
  let order1: Order;

  beforeAll(async () => {
    const newAsset = generateMock(CreateAssetV2PropsMock);
    Object.assign(newAsset, {
      customId: `${newAsset.customId ?? ''}-${Date.now()}`
    });
    const res1 = await client.assetsV2.create(newAsset);
    asset1 = res1.data;
    const res2 = await client.savedConfigurations.create({
      ...generateMock(CreateSavedConfigurationPropsMock),
      productId: asset1.id
    });
    savedConfiguration1 = res2.data;
  });

  afterAll(() => client.assetsV2.deleteById(asset1.id));

  describe('healthcheck()', () => {
    it('it should return a 200', async () => {
      const response = await client.orders.healthcheck();
      expect(response.status).toEqual(200);
    });
  });

  describe('create(order)', () => {
    it('it should return a valid result when given a valid Order', async () => {
      const newOrder = generateMock(CreateOrderPropsMock);
      Object.assign(newOrder, {
        status: 'New',
        cart: [{ configurationId: savedConfiguration1.id, count: 1 }]
      });
      //  @ts-ignore
      const response = await client.orders.create(newOrder);
      expect(response.status).toBe(200);
      order1 = response.data;
      expect(response.data).toMatchSchema(Order);
    });
  });

  describe('getById(id)', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.orders.getById('fail');
      expect(result).toThrow();
    });

    it('it should return a valid result when provided a valid orderId', async () => {
      const response = await client.orders.getById(order1.id);
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(Order);
    });

    it('it should return a 404 when given a wrong orderId', async () => {
      const response = await client.orders.getById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });

  describe('get()', () => {
    it('it should return a list of orders', async () => {
      const response = await client.orders.get();
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(OrderListing);
    });
  });
});
