/* eslint-disable @typescript-eslint/no-empty-interface */
import { users_auth, users_data, users_tokens } from "./users";

declare namespace PMSDB {
  namespace users {
    interface data extends users_data {}
    interface auth extends users_auth {}
    interface tokens extends users_tokens {}
  }
}
