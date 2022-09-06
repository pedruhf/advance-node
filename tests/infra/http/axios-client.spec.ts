import axios from "axios";
import { HttpGetClient } from "@/infra/http";

jest.mock("axios");

class AxiosHttpClient {
  async get<T = any>(params: HttpGetClient.Params): Promise<T> {
    const result = await axios.get(params.url, { params: params.params });
    return result.data;
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
    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: "any_data",
    });
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

  test("Shoul return data on success", async () => {
    const { sut } = makeSut();
    const result = await sut.get({
      url,
      params,
    });

    expect(result).toEqual("any_data");
  });
});
