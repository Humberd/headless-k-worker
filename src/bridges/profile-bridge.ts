import { StateService } from '../state.service';
import { NetworkProxy } from '../network-proxy';
import { phase } from '../utils';

export class ProfileBridge {
  constructor(private networkProxy: NetworkProxy,
              private stateService: StateService) {

  }

  @phase('Refresh Profile Information')
  async refreshProfileInformation() {
    return await this.networkProxy.getProfile(this.stateService.userId);
  }
}
