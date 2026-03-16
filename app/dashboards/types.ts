export type ApiKeyItem = {
  id: string;
  name: string;
  key: string;
  usage: number;
  limit: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiKeyRow = {
  id: string;
  name: string;
  key: string;
  usage: number;
  limit_count: number | null;
  created_at: string;
  updated_at: string;
};

export type ToastState = {
  tone: "success" | "error";
  message: string;
};
