export class UserProfile {
  public initials?: string;
  public pictureUrl?: string;

  constructor (readonly id: string) {}

  public setPicture ({ pictureUrl, name }: { pictureUrl?: string, name?: string }): void {
    this.pictureUrl = pictureUrl;
    if (!pictureUrl && name) {
      const firstLetters = name?.match(/\b(.)/g) ?? [];
      if (firstLetters.length > 1) {
        this.initials = `${firstLetters.shift()?.toUpperCase() ?? ""}${firstLetters.pop()?.toUpperCase() ?? ""}`;
      } else {
        this.initials = name.substring(0, 2).toUpperCase();
      }
    }
  }
}
