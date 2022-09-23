import { ChangeProfilePicture } from "@/data/use-cases";

class DeleteProfilePicture {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {}

  async handle ({ userId }: any): Promise<void> {
    await this.changeProfilePicture({ userId });
  }
}

describe("DeleteProfilePicture Controller", () => {
  let changeProfilePicture: jest.Mock;
  let sut: DeleteProfilePicture;

  beforeAll(() => {
    changeProfilePicture = jest.fn();
  });

  beforeEach(() => {
    sut = new DeleteProfilePicture(changeProfilePicture);
  });

  test("Shoul call ChangeProfilePicture with correct input", async () => {
    await sut.handle({ userId: "any_user_id" });

    expect(changeProfilePicture).toHaveBeenCalledWith({ userId: "any_user_id" });
    expect(changeProfilePicture).toHaveBeenCalledTimes(1);
  });
});
