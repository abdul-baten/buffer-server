import { networkInterfaces, type, cpus } from 'os';

export class NetworkUtil {
  static getCPUInfo(): string {
    const cpusArray = cpus();
    return cpusArray[0].model;
  }

  static getOSType(): string {
    return type();
  }

  static getIPAddress(): string {
    const networkInterfacesArray = networkInterfaces();
    return Object.keys(networkInterfacesArray)
      .reduce((r: any, k: any) => r.concat(k, networkInterfacesArray[k]), [])
      .filter((item: any) => item.family === 'IPv4' && item.internal === false)
      .map((val: any) => val.address)[0];
  }
}
