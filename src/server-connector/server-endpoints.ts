import { default as fetch, RequestInit } from 'node-fetch';
import { TypedResponse } from '../endpoints';
import { StatusUpdateRequest } from './_models/status-request';

interface RequestConfig {
  token: string;
  method: 'GET' | 'POST' | 'PUT',
  body?: any
}

async function request<T>(url: string, config: RequestConfig): Promise<TypedResponse<T>> {
  const requestConfig: RequestInit = {
    method: config.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': config.token
    },
    body: JSON.stringify(config.body)
  };

  return fetch(url, requestConfig);
}


/* ------------------------------------------------------------- */
export async function reportStatus(baseUrl: string, token: string, body: StatusUpdateRequest) {
  return request(`${baseUrl}/status`, {
    method: 'PUT',
    body: body,
    token: token
  });
}
