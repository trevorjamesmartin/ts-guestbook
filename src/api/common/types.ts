export interface SocketData {
  username: string|undefined;
  token: string|undefined;
  [key:string]:any;
}

export interface AuthMapItem {
  username: string;
  token: string;
  uid: string;
  loggedIn: boolean;
}

export interface PostType {
  id: number;
  author_id: number;
  title: string;
  tags: string;
  content: JSON;
  posted_at: any;
  thread_id: number;
  parent_id: number;
  created_at: any;
}
export type PostedMessage = Required<PostType>

export interface RequestConnect {
  id: number;
  from_id: number;
  to_id: number;
  accepted: boolean;
  created_at: any;
  updated_at: any;
}

export interface Friend {
  id: number;
  req_from: number;
  req_to: number;
  created_at: any;
  updated_at: any;
  weight: number;
}

export interface ProfileType {
  id: number;
  user_id: number;
  name: string;
  avatar: string;
  email: string;
  dob: Date;
  config: JSON;
  updated_at: any;
}

export interface DecodedToken {
  subject: number;
  username: string;
}

export interface Paginated {
  total: number,
  next: { page: number; limit: number; } | undefined,
  previous: { page: number; limit: number; } | undefined,
  pages: any[]
}

export interface ModelOptions {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}
export interface UserType {
  id: number | undefined;
  username: string;
  password: string;
  created_at: any;
}

export interface Food {
  id: number;
  author_id: number;
  title: string;
  tags: string;
  content: JSON;
  posted_at: any;
  parent_id: number;
  thread_id: number;
  created_at: any;
  username: any;
  avatar: any;
  name: any;
}

export interface TokenError {
  error: string;
  response: {
      event: string;
      [key:string]:any;
  }
}

