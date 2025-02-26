import { useQuery, type QueryKey, type UseQueryOptions } from "react-query"

/**
 * A custom hook that wraps react-query's useQuery hook for data fetching.
 *
 * @template TData The type of data returned by the query
 * @template TError The type of error that can occur
 * @param {QueryKey} key The key to use for the query cache
 * @param {() => Promise<TData>} fetchFn The function to fetch the data
 * @param {UseQueryOptions<TData, TError>} [options] Additional options for useQuery
 * @returns The query result object from react-query
 */
export function useFetch<TData = unknown, TError = unknown>(
  key: QueryKey,
  fetchFn: () => Promise<TData>,
  options?: UseQueryOptions<TData, TError>,
) {
  return useQuery<TData, TError>(key, fetchFn, options)
}

