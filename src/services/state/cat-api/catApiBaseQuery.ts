import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const THE_CAT_API_KEY = process.env.EXPO_PUBLIC_THE_CAT_API_KEY ?? ''

export const catApiBaseQuery = fetchBaseQuery({
  baseUrl: 'https://api.thecatapi.com/v1',
  prepareHeaders: headers => {
    headers.set('Accept', 'application/json')
    headers.set('x-api-key', THE_CAT_API_KEY)
    return headers
  }
})
