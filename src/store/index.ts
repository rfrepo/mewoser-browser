import { configureStore } from '@reduxjs/toolkit'
import { catApiSlice } from '@/services/state/catApi'

export const createAppStore = () =>
  configureStore({
    reducer: {
      [catApiSlice.reducerPath]: catApiSlice.reducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(catApiSlice.middleware)
  })

export const store = createAppStore()

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
