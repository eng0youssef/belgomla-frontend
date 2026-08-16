"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { useState } from "react";

function notifyQueryError(error: unknown) {
  const message =
    error instanceof Error ? error.message : "حدث خطأ أثناء تحميل البيانات";
  console.error("[BelGomla Query Error]:", message);
}

function notifyMutationError(error: unknown) {
  const message =
    error instanceof Error ? error.message : "حدث خطأ أثناء تنفيذ العملية";
  console.error("[BelGomla Mutation Error]:", message);
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            notifyQueryError(error);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            notifyMutationError(error);
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30 seconds
            refetchOnWindowFocus: true,
            retry: (failureCount, error) => {
              // Never retry 401/403/404 errors
              if (error instanceof Error) {
                if (
                  error.message.includes("401") ||
                  error.message.includes("403") ||
                  error.message.includes("404")
                ) {
                  return false;
                }
              }
              return failureCount < 2;
            },
          },
          mutations: {
            retry: 0, // NEVER auto-retry mutations to prevent duplicate side effects (e.g. order creation)
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

