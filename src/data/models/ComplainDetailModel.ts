export type CreateComplainPayload = {
  user_mobile: string;
  user_name: string;
  cust_id: number;
  problem: string;
  problem_type: string;
  description: string;
};

export interface ComplainDetailModel {
  assign_date: any;
  assign_to: number;
  assign: string;
  complain_key: string;
  created_at: string;
  cust_id: number;
  description: string;
  id: number;
  problem: string;
  problem_type: string;
  remark: any;
  resolve_time: any;
  status: number;
  user_mobile: string;
  user_name: string;
  first_name?: string;
  last_name?: string;
  mobile?: string;
}
