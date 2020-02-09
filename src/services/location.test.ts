import uuid from 'uuid';

import { ILocation } from '../interfaces/ILocation';
import { IOrganization } from '../interfaces/IOrganization';
import Organization from '../models/organization';
import { LocationService } from '../services/location';

/**
 * Setup
 *  1. create organization
 */
let mockIds = {
  orgId: uuid(),
  southLocId: uuid(),
  northLocId: uuid(),
};

const organization: IOrganization = {
  id: mockIds.orgId,
  org_name: 'test_org',
  subdomain_name: 'test_org',
};

const southLocation: ILocation = {
  org_id: mockIds.orgId,
  loc_name: 'test_loc_name',
  id: mockIds.southLocId,
};

const northLocation: ILocation = {
  org_id: mockIds.orgId,
  loc_name: 'test_loc_name',
  id: mockIds.northLocId,
};

beforeAll(async () => {
  try {
    await Organization.create(organization);
  } catch (err) {
    console.log(err);
  }
});

afterAll(async () => {
  try {
    await Organization.destroy({ where: { id: mockIds.orgId } });
  } catch (err) {
    console.log(err);
  }
});

describe('Test the location service', () => {
  const locService = new LocationService();

  test('should create the north location', async () => {
    const newLoc = await locService.CreateLocation(northLocation);
    expect(newLoc).toEqual(
      expect.objectContaining({
        ...northLocation,
      })
    );
  });

  test('should create the south location', async () => {
    const newLoc = await locService.CreateLocation(southLocation);
    expect(newLoc).toEqual(
      expect.objectContaining({
        ...southLocation,
      })
    );
  });

  test('should get locations for this org', async () => {
    const locations = await locService.GetLocationsByOrgId(mockIds.orgId);
    expect(locations).toHaveLength(2);
  });

  test('should update the name of north location', async () => {
    const newNorthLocation = JSON.parse(JSON.stringify(northLocation));
    newNorthLocation.loc_name = 'a new location test name';
    const newLoc = await locService.UpdateLocation(newNorthLocation);
    expect(newLoc).toEqual(
      expect.objectContaining({
        ...newNorthLocation,
      })
    );
    expect(newLoc.updated_datetime).not.toBe(newLoc.created_datetime);
  });

  test('should delete the north location', async () => {
    async function deleteLocation() {
      await locService.DeleteLocation(northLocation.id, northLocation.org_id);
    }
    await expect(deleteLocation()).resolves.toBeUndefined();
  });

  test('should delete the south location', async () => {
    async function deleteLocation() {
      await locService.DeleteLocation(southLocation.id, southLocation.org_id);
    }
    await expect(deleteLocation()).resolves.toBeUndefined();
  });
});
