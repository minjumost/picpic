import { QueryClient, QueryCache } from "@tanstack/react-query";
import { handleError } from "../utils/errorHandler";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleError,
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});
