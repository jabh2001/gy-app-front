import api from './index';
import type { SiteSettings } from './models';

export type SettingsUpdatePayload = Partial<Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>>;

export async function getSettings(): Promise<SiteSettings> {
  return api.get('/settings/');
}

export async function updateSettings(payload: SettingsUpdatePayload): Promise<SiteSettings> {
  return api.post('/settings/', payload);
}

export async function uploadSettingsImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const result = await api.post('/settings/upload-image/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }) as any;
  return result.url;
}
