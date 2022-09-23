export interface SaveUserPictureRepo {
  savePicture: (input: SaveUserPictureRepo.Input) => Promise<SaveUserPictureRepo.Output>;
}

export namespace SaveUserPictureRepo {
  export type Input = { id: string, pictureUrl?: string; initials?: string };
  export type Output = void;
}

export interface LoadUserProfile {
  load: (input: LoadUserProfile.Input) => Promise<LoadUserProfile.Output>;
}

export namespace LoadUserProfile {
  export type Input = { userId: string };
  export type Output = { name?: string } | undefined;
}
