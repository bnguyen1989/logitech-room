import { generateMock } from '@anatine/zod-mock';
import fsPromises from 'fs/promises';
import { z } from 'zod';

import client, { assetPath, WRONG_ID } from '../Common.test.js';
import {
  CreateDatatableProps,
  Datatable,
  DatatableColumn,
  DatatableListing,
  DatatableRow,
  DatatableRowListing
} from './Datatables.js';

const filePath = assetPath(`assets/league-table.csv`);

const newDatatableBase = {
  delimiter: ',',
  columnInfo: [
    {
      name: 'Team',
      type: 'String'
    },
    {
      name: 'Matches Played',
      type: 'Number'
    },
    {
      name: 'Wins',
      type: 'Number'
    },
    {
      name: 'Draws',
      type: 'Number'
    },
    {
      name: 'Loses',
      type: 'Number'
    }
  ] satisfies DatatableColumn[]
};

describe('Datatables', () => {
  let datatable1: Datatable;

  /*
  BEN: This route does not exist on the /datatables REST API endpoint as of Dec 6, 2023
  describe('healthcheck()', () => {
    it('it should return a 200', async () => {
      const response = await request.datatables.healthcheck();
      expect(response.status).toEqual(200);
    });
  });*/

  describe('create(datatable)', () => {
    it('it should return a 422 when creating an Datatable with no name', async () => {
      const newDatatable = generateMock(
        CreateDatatableProps.omit({ name: true })
      );
      //  @ts-ignore
      const response = await client.datatables.create(newDatatable);
      expect(response.status).toBe(422);
    });

    it('it should return a valid result when given a valid Datatable', async () => {
      const newDatatable = generateMock(CreateDatatableProps);

      const data = await fsPromises.readFile(filePath);

      const response = await client.datatables.create({
        ...newDatatable,
        ...newDatatableBase,
        file: new File([data], 'league-table.csv', {
          type: 'text/csv'
        })
      });
      datatable1 = response.data;
      expect(response.data).toMatchSchema(Datatable);
    });
  });

  describe('getById(id)', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.datatables.getById('fail');
      expect(result).toThrow();
    });

    it('it should return a valid result when provided a valid datatableId', async () => {
      const response = await client.datatables.getById(datatable1.id);
      expect(response.data).toMatchSchema(Datatable);
    });

    it('it should return a 404 when given a wrong datatableId', async () => {
      const response = await client.datatables.getById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });

  describe('get()', () => {
    it('it should return a list of datatables', async () => {
      const response = await client.datatables.get();
      expect(response.data).toMatchSchema(DatatableListing);
    });
  });

  describe('getRowById(id)', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.datatables.getRowById('fail');
      expect(result).toThrow();
    });

    it('it should return a row when provided a valid datatableId', async () => {
      const response = await client.datatables.getRowById(datatable1.id);
      expect(response.data).toMatchSchema(DatatableRow);
    });

    it('it should return a 404 when given a wrong datatableId', async () => {
      const response = await client.datatables.getRowById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });

  describe('downloadCsvById(id)', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.datatables.downloadCsvById('fail');
      expect(result).toThrow();
    });

    it('it should return a CSV string when provided a valid datatableId', async () => {
      const response = await client.datatables.downloadCsvById(
        datatable1.id,
        'text'
      );
      expect(response.data).toMatchSchema(z.string());
    });

    it('it should return a 404 when given a wrong datatableId', async () => {
      const response = await client.datatables.downloadCsvById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });

  describe('getRowsById(id)', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.datatables.getRowsById('fail');
      expect(result).toThrow();
    });

    it('it should return a list of rows when provided a valid datatableId', async () => {
      const response = await client.datatables.getRowsById(datatable1.id);
      expect(response.status).toBe(200);
      expect(response.data).toMatchSchema(DatatableRowListing);
    });

    it('it should return a 404 when given a wrong datatableId', async () => {
      const response = await client.datatables.getRowsById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });

  describe('deleteById', () => {
    it('it should throw an error if an invalid ID is provided', async () => {
      const result = () => client.datatables.deleteById('fail');
      expect(result).toThrow();
    });

    it('it should return a 204 when given a valid datatableId', async () => {
      const response = await client.datatables.deleteById(datatable1.id);
      expect(response.status).toBe(200);
    });

    it('it should return a 404 when given a wrong datatableId', async () => {
      const response = await client.datatables.deleteById(WRONG_ID);
      expect(response.status).toBe(404);
    });
  });
});
