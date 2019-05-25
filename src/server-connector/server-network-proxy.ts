import { StateService } from '../state.service';
import { WorkerStatusRequest } from './_models/status-request';
import { reportJobStatus, reportWorkerStatus } from './server-endpoints';
import { TypedResponse } from '../endpoints';
import { JobStatusRequest } from './_models/job-status-request';

export class ServerNetworkProxy {
  constructor(private stateService: StateService) {

  }

  async reportWorkerStatus(body: WorkerStatusRequest) {
    return await this.handleJsonResponse(reportWorkerStatus(this.stateService.serverUrl, this.stateService.serverToken, body));
  }

  async reportJobStatus(body: JobStatusRequest) {
    return await this.handleJsonResponse(reportJobStatus(this.stateService.serverUrl, this.stateService.serverToken, body));
  }

  /* ------------------------------------------------------------- */
  private async handleJsonResponse<T>(request: Promise<TypedResponse<T>>) {
    const resp = await request;

    const body = await resp.json();

    if (!resp.ok) {
      if (resp.status === 403) {
        throw new InvalidTokenError(resp.url, body);
      }

      throw new BadRequestError(resp.url, body);
    }

    return body;

  }

}

export class BadRequestError extends Error {
  constructor(url: string, body: any) {
    super(`Bad Request: ${url} -> ${JSON.stringify(body)}`);
  }
}

export class InvalidTokenError extends Error {
  constructor(url: string, body: any) {
    super(`Invalid Token: ${url} -> ${JSON.stringify(body)}`);
  }
}
