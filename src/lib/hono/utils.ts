type FetchArgs = Parameters<typeof fetch>

export async function fetcher<T>(url: FetchArgs[0], args: FetchArgs[1]) {
  const response = await fetch(url, args)
  const data: T = await response.json()

  return data
}

