export interface ISalon {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  is_active: boolean;
  image_url?: string | null;
}
