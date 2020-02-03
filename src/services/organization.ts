import { nowISO, clone } from '../utils';
import { IOrganization } from '../interfaces/IOrganization';
import Organization from '../models/organization';

export class OrganizationService {
  constructor() {}

  public async CreateOrganization(organization: IOrganization) {
    try {
      const organizationModel: Organization = clone(organization);
      const now = nowISO();
      organizationModel.created_datetime = now;
      organizationModel.updated_datetime = now;
      const newOrganization = await Organization.create(organizationModel);
      return newOrganization;
    } catch (err) {
      throw err;
    }
  }

  public async GetOrganization(id: string) {
    try {
      const organization = await Organization.findOne({
        where: { id },
      });
      return organization;
    } catch (err) {
      throw err;
    }
  }

  public async GetOrganizations() {
    try {
      const organizations = await Organization.findAll();
      return organizations;
    } catch (err) {
      throw err;
    }
  }

  public async UpdateOrganization(organization: IOrganization) {
    try {
      const oldOrganization = await Organization.findOne({
        where: { id: organization.id },
      });

      if (!oldOrganization) {
        throw new Error('org not found');
      }

      const { org_name, subdomain_name } = Object.assign(
        <IOrganization>oldOrganization,
        organization
      );
      const newOrganization = await oldOrganization.update({
        org_name,
        subdomain_name,
        updated_datetime: nowISO(),
      });
      return newOrganization;
    } catch (err) {
      throw err;
    }
  }

  public async DeleteOrganization(id: string) {
    try {
      const organization = await Organization.findOne({ where: { id } });
      if (!organization) {
        throw new Error('membership not found');
      }

      await organization.destroy();
    } catch (err) {
      throw err;
    }
  }
}
