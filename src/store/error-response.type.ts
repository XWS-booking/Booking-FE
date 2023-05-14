export type ErrorResponse<T> = {
  data: T;
  error: string | null;
};
