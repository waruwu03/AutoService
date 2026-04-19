'use client'

import { useState, useCallback } from 'react'
import useSWR, { SWRConfiguration, mutate as globalMutate } from 'swr'
import { api, getErrorMessage } from '@/lib/api-client'
import type { ApiResponse, PaginatedResponse } from '@/types'

// SWR fetcher
const fetcher = <T>(url: string) => api.get<T>(url)

/**
 * Hook for GET requests with SWR caching
 */
export function useApiGet<T>(
  url: string | null,
  config?: SWRConfiguration
) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<ApiResponse<T>>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      ...config,
    }
  )

  return {
    data: data?.data,
    error: error ? getErrorMessage(error) : null,
    isLoading,
    isValidating,
    mutate,
  }
}

/**
 * Hook for paginated GET requests
 */
export function useApiPaginated<T>(
  baseUrl: string,
  page: number = 1,
  perPage: number = 10,
  filters?: Record<string, unknown>,
  config?: SWRConfiguration
) {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    ...Object.fromEntries(
      Object.entries(filters || {})
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => [k, String(v)])
    ),
  })

  const url = `${baseUrl}?${params.toString()}`

  const { data, error, isLoading, isValidating, mutate } = useSWR<ApiResponse<PaginatedResponse<T>>>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      ...config,
    }
  )

  return {
    data: data?.data?.data || [],
    meta: data?.data?.meta,
    error: error ? getErrorMessage(error) : null,
    isLoading,
    isValidating,
    mutate,
  }
}

/**
 * Hook for mutations (POST, PUT, PATCH, DELETE)
 */
export function useApiMutation<TData = unknown, TResponse = unknown>() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (
    method: 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: TData,
    options?: {
      onSuccess?: (response: TResponse) => void
      onError?: (error: string) => void
      revalidateKeys?: string[]
    }
  ): Promise<TResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      let response: ApiResponse<TResponse>

      switch (method) {
        case 'post':
          response = await api.post<ApiResponse<TResponse>>(url, data)
          break
        case 'put':
          response = await api.put<ApiResponse<TResponse>>(url, data)
          break
        case 'patch':
          response = await api.patch<ApiResponse<TResponse>>(url, data)
          break
        case 'delete':
          response = await api.delete<ApiResponse<TResponse>>(url)
          break
      }

      // Revalidate specified keys
      if (options?.revalidateKeys) {
        options.revalidateKeys.forEach(key => {
          globalMutate((k) => typeof k === 'string' && k.startsWith(key), undefined, { revalidate: true })
        })
      }

      options?.onSuccess?.(response.data)
      return response.data
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      options?.onError?.(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const post = useCallback((url: string, data?: TData, options?: Parameters<typeof execute>[3]) => 
    execute('post', url, data, options), [execute])

  const put = useCallback((url: string, data?: TData, options?: Parameters<typeof execute>[3]) => 
    execute('put', url, data, options), [execute])

  const patch = useCallback((url: string, data?: TData, options?: Parameters<typeof execute>[3]) => 
    execute('patch', url, data, options), [execute])

  const del = useCallback((url: string, options?: Parameters<typeof execute>[3]) => 
    execute('delete', url, undefined, options), [execute])

  const reset = useCallback(() => {
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    isLoading,
    error,
    post,
    put,
    patch,
    delete: del,
    reset,
  }
}

/**
 * Invalidate and refetch SWR cache
 */
export function invalidateCache(keyPrefix: string) {
  globalMutate(
    (key) => typeof key === 'string' && key.startsWith(keyPrefix),
    undefined,
    { revalidate: true }
  )
}
