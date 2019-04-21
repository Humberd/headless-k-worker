import { UnknownError } from './network-proxy';
import { getLogger } from 'log4js';

export function objArrToCompoundObj(prefix: string, arr: any[]) {
  const container: any = {};
  arr.forEach((obj, index) => {
    Object.entries(obj).forEach(([key, value]) => {
      container[`${prefix}[${index}][${key}]`] = value;
    });
  });

  return container;
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function handleErrorMessage(error: Error, desiredMessage: string, action: () => any) {
  if (error instanceof UnknownError) {
    if (error.body.message === desiredMessage) {
      action();
      return;
    }
    throw error;
  }
  throw error;
}

export async function noExceptionExecutor(tasks: (() => Promise<any>)[]): Promise<Error[]> {
  const errors: Error[] = [];

  for (const task of tasks) {
    try {
      await task();
    } catch (e) {
      errors.push(e);
    }
  }

  return errors;
}


/**
 * @returns value in ms
 */
export function time(value: number, unit: 'seconds' | 'minutes' | 'hours' | 'days'): number {
  switch (unit) {
    case 'seconds':
      return value * 1000;
    case 'minutes':
      return value * 60 * 1000;
    case 'hours':
      return value * 60 * 60 * 1000;
    case 'days':
      return value * 24 * 60 * 60 * 1000;
    default:
      throw Error(`Unknown unit: ${unit}`);
  }
}


/**
 * Property decorator that logs setting values
 */
export function log({secure = false} = {}) {
  const logger = getLogger('Log');

  return function (target: Object, key: string | symbol) {
    // @ts-ignore
    let val = target[key];

    const getter = () => {
      return val;
    };
    const setter = (next: any) => {
      let printableValue = next;
      if (secure && printableValue) {
        printableValue = '**********';
      }

      if (typeof next === 'number' && String(next) === 'NaN') {
        throw new NaNError(`${String(key)}: ${printableValue}`);
      }

      logger.debug(`${String(key)}:`, printableValue);
      val = next;
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });

  };
}

export function phase(name: string) {
  const logger = getLogger('Phase');

  return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      logger.info(`--- ${name} ---`);

      try {
        const result = await original.apply(this, args);

        logger.info(`--- ${name} --- => SUCCESS`);
        return result;
      } catch (e) {
        logger.error(`--- ${name} --- => FAIL`);
        throw e;
      }
    };

    return descriptor;
  };
}

export class NaNError extends Error {
  constructor(msg: string) {
    super(`NaN Error: ${msg}`);
  }
}
