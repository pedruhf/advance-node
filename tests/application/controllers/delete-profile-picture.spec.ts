import { ChangeProfilePicture } from "@/data/use-cases";

class DeleteProfilePicture {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {}

  async handle ({ userId }: any): Promise<void> {
    await this.changeProfilePicture({ userId });
  }
}

describe("DeleteProfilePicture Controller", () => {
  test("Shoul call ChangeProfilePicture with correct input", async () => {
    const changeProfilePicture = jest.fn();
    const sut = new DeleteProfilePicture(changeProfilePicture);
    await sut.handle({ userId: "any_user_id" });

    expect(changeProfilePicture).toHaveBeenCalledWith({ userId: "any_user_id" });
    expect(changeProfilePicture).toHaveBeenCalledTimes(1);
  });
});
