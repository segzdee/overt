import { useQuery, type QueryKey, type UseQueryOptions } from "react-query"
import { supabase } from "../utils/supabaseClient"

export function useSupabaseQuery<T>(
  key: QueryKey,
  table: string,
  options?: UseQueryOptions<T[], Error> & {
    filter?: Record<string, unknown>
  },
) {
  return useQuery<T[], Error>(
    key,
    async () => {
      let query = supabase.from(table).select("*")

      if (options?.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }

      const { data, error } = await query

      if (error) throw error
      return data as T[]
    },
    options,
  )
}

