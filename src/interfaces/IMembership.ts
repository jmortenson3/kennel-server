export interface IMembership {
  org_id: string;
  userEmail: string;
  can_accept_appointments?: boolean;
  can_deny_appointments?: boolean;
  can_edit_kennel_layout?: boolean;
  created_datetime?: string;
  updated_datetime?: string;
}
