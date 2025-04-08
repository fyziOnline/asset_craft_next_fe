import { urls } from "@/apis/urls"
import { ApiService } from "@/lib/axios_generic"
import { useState } from "react"

interface RawAIOutputResponse {
  isSuccess: boolean
  errorOnFailure: string
  assetID: string
  rawAIOutput: string
  assetAIPrompt: string
  baseRawPrompt: string
}

interface UseRawAIOutputProps {
  assetID?: string
  assetVersionID?: string
}

export const useRawAIOutput = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [rawAIOutput, setRawAIOutput] = useState<string>("")
  const [assetAIPrompt, setAssetAIPrompt] = useState<string>("")
  const [baseRawPrompt, setBaseRawPrompt] = useState<string>("")

  const fetchRawAIOutput = async ({ assetID, assetVersionID }: UseRawAIOutputProps) => {
    if (!assetID && !assetVersionID) {
      setError("Either assetID or assetVersionID is required")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const queryParam = assetID ? `assetID=${assetID}` : `assetVersionID=${assetVersionID}`
      const response = await ApiService.get<RawAIOutputResponse>(`${urls.asset_getRawAIOutput}?${queryParam}`)

      if (response.isSuccess) {
        setRawAIOutput(response.rawAIOutput || "")
        setAssetAIPrompt(response.assetAIPrompt || "")
        setBaseRawPrompt(response.baseRawPrompt || "")
        return {
          rawAIOutput: response.rawAIOutput,
          assetAIPrompt: response.assetAIPrompt,
          baseRawPrompt: response.baseRawPrompt
        }
      } else {
        setError(response.errorOnFailure || "Failed to fetch raw AI output")
        setRawAIOutput("")
        setAssetAIPrompt("")
        setBaseRawPrompt("")
        return { rawAIOutput: "", assetAIPrompt: "", baseRawPrompt: "" }
      }
    } catch (error) {
      const apiError = ApiService.handleError(error)
      setError(apiError.message)
      setRawAIOutput("")
      setAssetAIPrompt("")
      setBaseRawPrompt("")
      return { rawAIOutput: "", assetAIPrompt: "", baseRawPrompt: "" }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    rawAIOutput,
    assetAIPrompt,
    baseRawPrompt,
    fetchRawAIOutput
  }
} 