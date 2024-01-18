import client, { LAYER_ID, WRONG_ID } from '../Common.test.js';
import { Layer, LayerListing } from './Layers.js';

describe('Layers', () => {
  describe('getById()', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const response = await client.layers.getById('fail');
      expect(response.status).toBe(422);
    });

    it('it should return a valid result when provided a valid layerId', async () => {
      const response = await client.layers.getById(LAYER_ID!);
      expect(response.data).toMatchSchema(Layer);
    });

    it('it should return a 404 when given a wrong layerId', async () => {
      const response = await client.layers.getById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });

  describe('getLayers()', () => {
    it('get all', async () => {
      const response = await client.layers.get();
      const layerListing = response.data;
      expect(layerListing).toMatchSchema(LayerListing);
      expect(layerListing.layers.length).toBeGreaterThan(0);
    });

    it('get via assetLayerConfiguration query', async () => {
      const response = await client.layers.get({
        assetLayerConfiguration: {
          Height: 0.3,
          'Team 1': { assetId: 'ef326ab6-eb64-4980-b634-0bda416b0448' }
        }
      });
      const layerListing = response.data;
      expect(layerListing).toMatchSchema(LayerListing);
      expect(layerListing.layers.length).toBeGreaterThan(0);
    });
  });
});
