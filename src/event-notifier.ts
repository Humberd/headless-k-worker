import { default as fetch } from 'node-fetch';

export class EventNotifier {

  notifyError(taskId: string, error: any) {
    fetch('/error', {
      body: JSON.stringify({taskId, error})
    });


  }

}
