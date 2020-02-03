import { ILocation } from '../interfaces/ILocation';
import { nowISO, clone } from '../utils';
import Organization from '../models/organization';
import Location from '../models/location';

export class LocationService {
  constructor() {}

  public async CreateLocation(location: ILocation) {
    try {
      const locationModel = clone(location);
      const now = nowISO();
      locationModel.created_datetime = now;
      locationModel.updated_datetime = now;
      const newLocation = await Location.create(locationModel);
      return newLocation;
    } catch (err) {
      throw err;
    }
  }

  public async GetLocation(id: string) {
    try {
      const location = Location.findOne({ where: { id } });

      if (!location) {
        throw new Error('location not found');
      }

      return location;
    } catch (err) {
      throw err;
    }
  }

  public async GetLocations() {
    try {
      const locations = Location.findAll();
      return locations;
    } catch (err) {
      throw err;
    }
  }

  public async GetLocationsByOrgId(id: string) {
    try {
      const organization = await Organization.findOne({ where: { id } });

      if (!organization) {
        throw new Error('organization not found');
      }

      const locations = await organization.getLocations();
      return locations;
    } catch (err) {
      throw err;
    }
  }

  public async UpdateLocation(location: ILocation) {
    try {
      const oldLocation = await Location.findOne({
        where: { id: location.id },
      });

      if (!oldLocation) {
        throw new Error('location not found');
      }

      console.log(oldLocation.toJSON());

      const newLocation: Location = Object.assign(oldLocation, location);
      newLocation.updated_datetime = nowISO();
      console.log(newLocation.toJSON());
      const {
        id,
        org_id,
        loc_name,
        created_datetime,
        updated_datetime,
      } = newLocation;
      await Location.update(
        {
          loc_name,
          created_datetime,
          updated_datetime,
        },
        { where: { id, org_id } }
      );
      return newLocation;
    } catch (err) {
      throw err;
    }
  }

  public async DeleteLocation(locationId: string, orgId: string) {
    try {
      const deletedCount = await Location.destroy({
        where: { id: locationId, org_id: orgId },
      });
      if (deletedCount === 0) {
        throw new Error('problem deleting location');
      }
    } catch (err) {
      throw err;
    }
  }
}
