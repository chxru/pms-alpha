export interface patients_info_decrypted {
  fname: string;
  lname: string;
  gender: string;
  dob: {
    d?: number;
    m?: number;
    y?: number;
  };
  address?: string;
  email?: string;
  tp?: string;
}

export interface patients_info_encrypted {
  id: number;
  data: string;
  created_at: Date;
}
