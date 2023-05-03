export type ResponseState<T> = {
    error: string | null,
    data: T,
    status: "IDLE" | "LOADING" | "SUCCESS" | "ERROR"
};
