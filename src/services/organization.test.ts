import uuid from 'uuid';
import { IOrganization } from '../interfaces/IOrganization';
import { OrganizationService } from '../services/organization';

/**
 * Setup none
 */

let mockIds = {
  orgId: uuid(),
};

const organization: IOrganization = {
  id: mockIds.orgId,
  org_name: 'test_org',
  subdomain_name: 'test_org',
};

describe('Test the organization service', () => {
  const orgService = new OrganizationService();
  test('should create the organization', async () => {
    const newOrg = await orgService.CreateOrganization(organization);
    expect(newOrg).toEqual(
      expect.objectContaining({
        id: mockIds.orgId,
        org_name: organization.org_name,
      })
    );
    expect(newOrg).toHaveProperty('created_datetime');
    expect(newOrg).toHaveProperty('updated_datetime');
  });

  test('should get the organization', async () => {
    const newOrg = await orgService.GetOrganization(mockIds.orgId);
    expect(newOrg).toEqual(
      expect.objectContaining({
        id: mockIds.orgId,
        org_name: organization.org_name,
      })
    );
    expect(newOrg).toHaveProperty('created_datetime');
    expect(newOrg).toHaveProperty('updated_datetime');
  });

  test('should update the organization name', async () => {
    const newOrg: IOrganization = JSON.parse(JSON.stringify(organization));
    newOrg.subdomain_name = 'mywebsite';
    const updatedOrg = await orgService.UpdateOrganization(newOrg);
    expect(updatedOrg).toEqual(
      expect.objectContaining({
        id: mockIds.orgId,
        org_name: organization.org_name,
        subdomain_name: newOrg.subdomain_name,
      })
    );
    expect(updatedOrg).toHaveProperty('created_datetime');
    expect(updatedOrg).toHaveProperty('updated_datetime');
  });

  test('should delete the organization', async () => {
    async function deleteOrg() {
      await orgService.DeleteOrganization(mockIds.orgId);
    }
    await expect(deleteOrg()).resolves.toBeUndefined();
  });

  test('should reject because org does not exist', async () => {
    async function deleteOrg() {
      await orgService.DeleteOrganization(mockIds.orgId);
    }
    await expect(deleteOrg()).rejects.toThrowError();
  });

  test('should fail to update because org not found', async () => {
    async function updateOrg() {
      const newOrg: IOrganization = JSON.parse(JSON.stringify(organization));
      newOrg.subdomain_name = 'mywebsite';
      const updatedOrg = await orgService.UpdateOrganization(newOrg);
      expect(updatedOrg).toEqual(
        expect.objectContaining({
          id: mockIds.orgId,
          org_name: organization.org_name,
          subdomain_name: newOrg.subdomain_name,
        })
      );
    }
    await expect(updateOrg()).rejects.toThrowError();
  });
});
