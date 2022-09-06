import axios from "axios";
import { HttpGetClient } from "@/infra/http";

jest.mock("axios");

class AxiosHttpClient {
  async get(params: HttpGetClient.Params): Promise<void> {
    await axios.get(params.url, { params: params.params });
  }
}

describe("AxiosHttpClient", () => {
  test("Shoul call get with correct params", async () => {
    const fakeAxios = axios as jest.Mocked<typeof axios>;
    const sut = new AxiosHttpClient();

    await sut.get({
      url: "any_url",
      params: {
        anyField: "any_value",
      },
    });

    expect(fakeAxios.get).toHaveBeenCalledWith("any_url", {
      params: {
        anyField: "any_value",
      },
    });
    expect(fakeAxios.get).toHaveBeenCalledTimes(1);
  });
});
