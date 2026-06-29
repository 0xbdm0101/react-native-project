/**
 * 通用 HTTP 请求 Hook（TanStack Query + axios）
 *
 * 特性:
 *   - staleTime 内读缓存（默认 30s）
 *   - 并发去重：相同 key 只发一个请求
 *   - 失败自动重试 2 次
 *
 * 使用:
 *   const { data, error, isLoading } = useHttp(
 *     ["pets", "available"],
 *     () => api.pet.findPetsByStatus({ status: ["available"] })
 *   );
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export function useHttp<TData = unknown, TError = Error>(
  queryKey: ReadonlyArray<string | number>,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn,
    staleTime: 30 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    ...options,
  });
}
