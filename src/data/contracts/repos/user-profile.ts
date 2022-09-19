export interface SaveUserPictureRepo {
  savePicture: (params: SaveUserPictureRepo.Params) => Promise<SaveUserPictureRepo.Result>;
}

export namespace SaveUserPictureRepo {
  export type Params = { pictureUrl?: string };
  export type Result = void;
}
