export type ApiResponse<T> = {
  data: T;
  meta?: { requestId?: string };
};
