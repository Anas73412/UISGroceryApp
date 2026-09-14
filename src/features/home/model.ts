export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}
export interface UserServiceModel {
  id: number;
  service_name: string;
  service_key: string;
  device_name: string;
  cust_id: number;
  status: number;
  created_at: string | null;
}
