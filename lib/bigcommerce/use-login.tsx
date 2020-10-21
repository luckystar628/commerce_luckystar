import { useCallback } from 'react'
import { HookFetcher } from '@lib/commerce/utils/types'
import useCommerceLogin from '@lib/commerce/use-login'
import type { LoginBody } from './api/customers/login'

const defaultOpts = {
  url: '/api/bigcommerce/customers/login',
  method: 'POST',
}

export type LoginInput = LoginBody

export const fetcher: HookFetcher<null, LoginBody> = (
  options,
  { email, password },
  fetch
) => {
  if (!(email && password)) {
    throw new Error(
      'A first name, last name, email and password are required to login'
    )
  }

  return fetch({
    url: options?.url ?? defaultOpts.url,
    method: options?.method ?? defaultOpts.method,
    body: { email, password },
  })
}

export function extendHook(customFetcher: typeof fetcher) {
  const useLogin = () => {
    const fn = useCommerceLogin<null, LoginInput>(defaultOpts, customFetcher)

    return useCallback(
      async function login(input: LoginInput) {
        const data = await fn(input)
        return data
      },
      [fn]
    )
  }

  useLogin.extend = extendHook

  return useLogin
}

export default extendHook(fetcher)
