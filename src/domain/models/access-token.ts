export class AccessToken {
  constructor(public readonly value: string) {}

  static get expirationInMs(): number {
    return 30 * 60 * 1000; // 30 minutes;
  }
}
