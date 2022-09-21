import { v4 } from "uuid";

import { UUIDGenerator } from "@/data/contracts/gateways";

export class UUIDHandler implements UUIDGenerator {
  uuid({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    const uuid = v4();
    return `${key}_${uuid}`;
  }
}
