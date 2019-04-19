import { StateService } from '../state.service';
import { StatusUpdateRequest } from './_models/status-request';
import { reportStatus } from './server-endpoints';
import { TypedResponse } from '../endpoints';

export class ServerNetworkProxy {
  constructor(private stateService: StateService) {

  }

  async reportStatus(body: StatusUpdateRequest) {
    return await this.handleJsonResponse(reportStatus(this.stateService.serverUrl, this.stateService.serverToken, body));
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
