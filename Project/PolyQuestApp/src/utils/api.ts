const API_URL = "http://localhost:8080/"

export interface FetchOptions {
  url: string
  params?: Record<string, any>
  body?: any
  headers?: Record<string, string>
  token?: string
}

interface ErrorResponse {
  [x: string]: any
  success: false
  message: string
  details?: any
}

interface SuccessResponse<T> {
  data: T
  success: true
}

const fetchWrapper = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  options: FetchOptions
): Promise<SuccessResponse<T> | ErrorResponse> => {
  const { url, params, body, headers, token } = options

  let sanitisedUrl = url.startsWith("/") ? url.slice(1) : url
  const apiUrl = `${API_URL}${sanitisedUrl}`
  const queryParams = params ? "?" + new URLSearchParams(params).toString() : ""

  const fetchHeaders: HeadersInit = new Headers({
    "Content-Type": "application/json", // Ensure JSON content type
    ...headers, // Merge in any custom headers
    ...(token ? { Authorization: `Bearer ${token}` } : {}) // Add Authorization if token is provided
  })

  const fetchOptions: RequestInit = {
    method,
    headers: fetchHeaders,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include"
  }

  console.log(`Req: ${method} ${url}${queryParams}`)

  try {
    const response = await fetch(apiUrl + queryParams, fetchOptions)

    let responseData = await response.json()

    console.log(`Response: ${response.status}`, responseData)

    if (!response.ok) {
      return {
        success: false,
        message: response.statusText,
        details: responseData
      }
    }

    return {
      success: true,
      data: responseData as T
    }
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`)
    return {
      success: false,
      message: (error as Error).message
    }
  }
}

export const get = async <T>(options: FetchOptions) =>
  fetchWrapper<T>("GET", options)

export const post = async <T>(options: FetchOptions) =>
  fetchWrapper<T>("POST", options)

export const patch = async <T>(options: FetchOptions) =>
  fetchWrapper<T>("PUT", options)

export const del = async <T>(options: FetchOptions) =>
  fetchWrapper<T>("DELETE", options)
