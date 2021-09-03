/* eslint-disable @typescript-eslint/no-empty-interface */
import { patients_info_decrypted, patients_info_encrypted } from "./patient";
import { users_auth, users_data, users_tokens } from "./users";

declare namespace PMSDB {
  namespace users {
    interface data extends users_data {}
    interface auth extends users_auth {}
    interface tokens extends users_tokens {}
  }

  namespace patients {
    interface info_decrypted extends patients_info_decrypted {}
    interface info_encrypted extends patients_info_encrypted {}
  }
}
