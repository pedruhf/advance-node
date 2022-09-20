export interface SaveUserPictureRepo {
  savePicture: (input: SaveUserPictureRepo.Input) => Promise<SaveUserPictureRepo.Result>;
}

export namespace SaveUserPictureRepo {
  export type Input = { pictureUrl?: string };
  export type Result = void;
}

export interface LoadUserProfile {
  load: (input: LoadUserProfile.Input) => Promise<LoadUserProfile.Result>;
}

export namespace LoadUserProfile {
  export type Input = { userId: string };
  export type Result = void;
}
