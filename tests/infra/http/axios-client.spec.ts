import axios from "axios";
import { HttpGetClient } from "@/infra/http";

jest.mock("axios");

class AxiosHttpClient {
  async get(params: HttpGetClient.Params): Promise<void> {
    await axios.get(params.url, { params: params.params });
  }
}

const makeSut = () => {
  const sut = new AxiosHttpClient();

  return { sut };
};

describe("AxiosHttpClient", () => {
  let fakeAxios: jest.Mocked<typeof axios>;
  let url: string;
  let params: object;

  beforeAll(() => {
    fakeAxios = axios as jest.Mocked<typeof axios>;
    url = "any_url";
    params = {
      anyField: "any_value",
    };
  });

  test("Shoul call get with correct params", async () => {
    const { sut } = makeSut();
    await sut.get({
      url,
      params,
    });

    expect(fakeAxios.get).toHaveBeenCalledWith(url, {
      params,
    });
    expect(fakeAxios.get).toHaveBeenCalledTimes(1);
  });
});
