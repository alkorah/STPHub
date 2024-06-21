import { Action } from "./Action";

export class MongoAction<Result extends GenericPayload>
  implements Action<Result>
{
  exectute(payload: Result): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}
