export interface IAppointment {
  loc_id: string;
  id?: string;
  org_id?: string;
  is_boarding?: boolean;
  is_grooming?: boolean;
  dropoff_datetime?: string;
  pickup_datetime?: string;
  user_email?: string;
  pet_id?: string;
  notes?: string;
  status?: string;
  created_datetime?: string;
  updated_datetime?: string;
}
