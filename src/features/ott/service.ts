import { apiClient } from '../../services/apiClient';
import type { ApiResponseModel } from '../../services/types';
import { API_ENDPOINTS } from '../../utils/constants';
import type { OttChannel } from './types';

type OttChannelApiItem = {
  channel_id?: number;
  channelId?: number;
  name?: string | null;
  image_path?: string | null;
  imagePath?: string | null;
  status?: number | null;
  created_at?: string | Date | null;
  createdAt?: string | null;
};

function mapItem(item: OttChannelApiItem): OttChannel {
  return {
    id: Number(item.channel_id ?? item.channelId ?? 0),
    name: String(item.name ?? '').trim(),
    imagePath: String(item.image_path ?? item.imagePath ?? '').trim(),
    status: Number(item.status ?? 0) === 1 ? 1 : 0,
    createdAt:
      item.createdAt ??
      (item.created_at != null ? String(item.created_at) : null),
  };
}

function unwrap<T>(response: ApiResponseModel<T>): T {
  if (!response || response.status !== 'Success' || response.data == null) {
    throw new Error(response?.message || 'Unable to load OTT channels');
  }
  return response.data;
}

export const ottService = {
  async list(): Promise<OttChannel[]> {
    const response = await apiClient.get<
      ApiResponseModel<OttChannelApiItem[]>
    >(API_ENDPOINTS.ALL_OTT_CHANNELS);

    const items = unwrap(response);
    return (Array.isArray(items) ? items : [])
      .map(mapItem)
      .filter(item => item.id > 0 && item.status === 1);
  },
};
