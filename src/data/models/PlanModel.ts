export interface OttChannelModel {
  channel_id: number;
  plan_id: number;
  name: string;
  image_path: string;
}

export interface PlanModel {
  id: number;
  offertype: string;
  planType: string;
  speed: string;
  planprice: number;
  pricewithgst: number;
  gst: number;
  subone: string;
  subtwo: string;
  active: number;
  validity: number;
  validityType: string;
  channelList: OttChannelModel[];
}
