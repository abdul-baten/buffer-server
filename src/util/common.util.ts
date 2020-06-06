import * as stringify from 'json-stringify-safe';
import isJSON = require('is-json');

export class CommonUtil {
  static isObject(val: any): boolean {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
  }

  static isObjectObject(obj: Record<string, any>): boolean {
    return CommonUtil.isObject(obj) === true && Object.prototype.toString.call(obj) === '[object Object]';
  }

  static isPlainObject(obj: Record<string, any>): boolean {
    if (CommonUtil.isObjectObject(obj) === false) return false;

    // If has modified constructor
    const ctor = obj.constructor;
    if (typeof ctor !== 'function') return false;

    // If has modified prototype
    const prot = ctor.prototype;
    if (CommonUtil.isObjectObject(prot) === false) return false;

    // If constructor does not have an Object-specific method
    if (prot.hasOwnProperty('isPrototypeOf') === false) {
      return false;
    }

    // Most likely a plain Object
    return true;
  }

  static isValidJSON(obj: Record<string, any>): boolean {
    return isJSON(obj);
  }

  static getSerializedJSON(obj: Record<string, any>): string {
    const jsonStringify = stringify(CommonUtil.isObject(obj) ? obj : {}, null, 2);
    return jsonStringify || '{}';
  }
}
