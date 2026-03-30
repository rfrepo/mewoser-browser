import { useEffect, useRef, useState } from 'react'
import { useUploadImageMutation } from '@/services/state/catApi'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { toApiFailureFromBaseQueryError } from '@/services/state/cat-api/utils'
import { getInstallationIdentity } from '@/services/persistence/installation-identity/installationIdentity'

type UploadParams = {
  fileUri: string
  fileType: string
}

const isFetchBaseQueryError = (e: unknown): e is FetchBaseQueryError =>
  e !== null &&
  typeof e === 'object' &&
  'status' in e &&
  typeof (e as FetchBaseQueryError).status !== 'undefined'

const toDisplayError = (e: unknown): Error => {
  if (isFetchBaseQueryError(e)) {
    return new Error(
      toApiFailureFromBaseQueryError(e as FetchBaseQueryError).message
    )
  }

  if (e instanceof Error) return e

  return new Error(String(e))
}

export const useUploadMutation = () => {
  const isMountedRef = useRef(true)
  const [uploadImage] = useUploadImageMutation()
  const [isPending, setIsPending] = useState(false)
  const { installationId } = getInstallationIdentity()
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const mutateAsync = async ({ fileUri, fileType }: UploadParams) => {
    if (isMountedRef.current) {
      setError(null)
      setIsPending(true)
    }

    try {
      return await uploadImage({ installationId, fileUri, fileType }).unwrap()
    } catch (uploadError) {
      const displayError = toDisplayError(uploadError)

      if (isMountedRef.current) setError(displayError)

      throw displayError
    } finally {
      if (isMountedRef.current) setIsPending(false)
    }
  }

  return {
    error,
    isPending,
    mutateAsync,
    reset: () => {
      setError(null)
      setIsPending(false)
    },
    mutate: (params: UploadParams) => {
      void mutateAsync(params).catch(() => undefined)
    }
  }
}
