import { NetworkProxy } from '../network-proxy';
import { handleErrorMessage, phase } from '../utils';
import { getLogger } from 'log4js';
import { StateService } from '../state.service';
import { JobResponse } from '../dispatcher/types';

const logger = getLogger('WorkBridge');

export class WorkBridge {

  constructor(private networkProxy: NetworkProxy,
              private stateService: StateService) {

  }

  @phase('Daily work')
  async workDaily(): Promise<JobResponse> {
    try {
      await this.networkProxy.work();
      this.stateService.lastWorkDay = this.stateService.currentDay;

      return JobResponse.success();
    } catch (e) {
      return handleErrorMessage(e, 'already_worked', () => {
        logger.info('Already worked');
        this.stateService.lastWorkDay = this.stateService.currentDay;
        return JobResponse.alreadyDone('Already worked');
      });
    }
  }

  @phase('Daily overtime work')
  async workOvertimeDaily(): Promise<JobResponse> {
    try {
      await this.networkProxy.workOvertime();
      this.stateService.lastWorkOvertimeDay = this.stateService.currentDay;

      return JobResponse.success();
    } catch (e) {
      return handleErrorMessage(e, 'no_rest_points', () => {
        logger.info('Already worked');
        this.stateService.lastWorkOvertimeDay = this.stateService.currentDay;
        return JobResponse.alreadyDone('Already worked');

      });
    }
  }

  @phase('Daily production work')
  async workProductionDaily(): Promise<JobResponse>  {
    const copaniesIds = await this.getCompaniesIds();

    if (copaniesIds.length === 0) {
      logger.info('Already worked');
      this.stateService.lastWorkProductionDay = this.stateService.currentDay;

      return JobResponse.alreadyDone('Already worked');
    }

    if (copaniesIds.length * 10 > this.stateService.healthBarPrimary) {
      logger.warn('Not enough hp to work');

      return JobResponse.error('Not enough hp to work');
    }

    const requestData = copaniesIds.map(it => ({
      id: it,
      own_work: 1 as 1,
      employee_works: 0 as 0
    }));

    await this.networkProxy.workProduction(requestData);

    const msg = `Worked in ${copaniesIds.length} companies`;
    logger.info(msg);
    this.stateService.lastWorkProductionDay = this.stateService.currentDay;
    return JobResponse.success(msg);
  }

  private async getCompaniesIds(): Promise<string[]> {
    const dom = await this.networkProxy.getCompaniesPage();

    // language=CSS
    const companies = dom.querySelectorAll('.companies_group:first-child > .companies_listing > .listing.companies');
    logger.info(`Found ${companies.length} companies`);

    const ids: string[] = [];
    const alreadyWorkedIn: string[] = [];
    companies.forEach(it => {
      const regex = /company_(\d+)/;
      const result = regex.exec(it.id);
      if (result === null) {
        logger.error(`Company id cannot be found on id ${it.id}`);
        return;
      }

      // language=CSS
      const isWorkable = it.querySelector('.as_employee.owner_work')
          .attributes
          .getNamedItem('title').value === 'Work as Manager';
      if (!isWorkable) {
        alreadyWorkedIn.push(it.id);
        return;
      }

      ids.push(result[1]);
    });

    alreadyWorkedIn.length && logger.info(`Already worked in ${alreadyWorkedIn.length} companies`);

    return ids;
  }
}
