export interface users_data {
  id: number;
  username: string;
  email?: string;
  fname: string;
  lname: string;
  created_at: Date;
  updated_at: Date;
  created_by: number;
}

export interface users_auth {
  id: number;
  username: string;
  pwd: string;
}

export interface users_tokens {
  id: number;
  token: string;
  expires: Date;
  blacklisted: boolean;
}
