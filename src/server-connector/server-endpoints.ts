import { default as fetch, RequestInit } from 'node-fetch';
import { TypedResponse } from '../endpoints';
import { WorkerStatusRequest } from './_models/status-request';
import { JobStatusRequest } from './_models/job-status-request';

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
export async function reportWorkerStatus(baseUrl: string, token: string, body: WorkerStatusRequest) {
  return request(`${baseUrl}/status`, {
    method: 'PUT',
    body: body,
    token: token
  });
}

export async function reportJobStatus(baseUrl: string, token: string, body: JobStatusRequest) {
  return request(`${baseUrl}/jobs`, {
    method: 'PUT',
    body: body,
    token: token
  })
}
