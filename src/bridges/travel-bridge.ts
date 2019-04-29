import { NetworkProxy } from '../network-proxy';
import { phase } from '../utils';
import { Nationality } from '../battle-algorithm/battle-analyzer-enums';
import { StateService } from '../state.service';

export class TravelBridge {
  constructor(private networkProxy: NetworkProxy,
              private stateService: StateService) {

  }

  @phase('travel')
  async travel(battleId: string, sideId: string) {
    const response = await this.networkProxy.travel({
      battleId: battleId,
      sideCountryId: sideId
    });

    this.stateService.currentCountryLocationId = Number(sideId);

    return response;
  }

  @phase('travel home')
  async travelHome() {
    const response = await this.networkProxy.travel({
      battleId: '0',
      toCountryId: String(Nationality.POLAND),
      inRegionId: '424'
    });

    this.stateService.currentCountryLocationId = Nationality.POLAND;

    return response;
  }

}
