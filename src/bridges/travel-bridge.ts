import { NetworkProxy } from '../network-proxy';
import { phase } from '../utils';
import { Nationality } from '../battle-algorithm/battle-analyzer-enums';

export class TravelBridge {
  constructor(private networkProxy: NetworkProxy) {

  }

  @phase('travel')
  async travel(battleId: string, sideId: string) {
    return await this.networkProxy.travel({
      battleId: battleId,
      sideCountryId: sideId
    });
  }

  @phase('travel home')
  async travelHome() {
    return await this.networkProxy.travel({
      battleId: '0',
      toCountryId: String(Nationality.POLAND),
      inRegionId: '424'
    })
  }
}
