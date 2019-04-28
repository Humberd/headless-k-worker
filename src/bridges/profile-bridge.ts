import { StateService } from '../state.service';
import { NetworkProxy } from '../network-proxy';
import { phase } from '../utils';

export class ProfileBridge {
  constructor(private networkProxy: NetworkProxy,
              private stateService: StateService) {

  }

  @phase('Refresh Profile Information')
  async refreshProfileInformation() {
    const response = await this.networkProxy.getProfile(this.stateService.userId);

    this.stateService.currentCountryLocationId = response.location.residenceCountry.id;

    return response;
  }

  @phase('Refresh User Data')
  async refreshUserData() {
    const response = await this.networkProxy.getUserData();

    this.stateService._token = response.csrf;
    this.stateService.userId = String(response.id);
    this.stateService.healthBarLimit = response.energyPool;
    this.stateService.division = response.division;
    this.stateService.currentCountryLocationId = response.citizenshipCountryId;

    return response

  }
}
