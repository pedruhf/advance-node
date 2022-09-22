import { FacebookAccount } from "@/domain/entities";
import { accountModelmock, fbModelMock } from "@/tests/domain/mocks";

describe("FacebookAccount", () => {
  const fbData = fbModelMock();

  test("Should create with facebook data only", () => {
    const sut = new FacebookAccount(fbData);
    expect(sut).toEqual(fbData);
  });

  test("Should update name if its empty", () => {
    const accountData = {
      id: "any_id",
    };

    const sut = new FacebookAccount(fbData, accountData);

    expect(sut).toEqual({
      id: "any_id",
      name: "any_facebook_name",
      email: "any_facebook_email",
      facebookId: "any_facebook_id",
    });
  });

  test("Should not update name if its not empty", () => {
    const accountData = accountModelmock();
    const sut = new FacebookAccount(fbData, accountData);

    expect(sut).toEqual({
      id: "any_id",
      name: "any_name",
      email: "any_facebook_email",
      facebookId: "any_facebook_id",
    });
  });
});
