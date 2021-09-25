import qs from 'qs'

import type { HTTPMethod } from "./methods";

export type EndpointMap = Record<string, Record<string, { method: HTTPMethod, url: string }>>
export type EndpointPayload = {
  params?: Record<string, any>,
  query?: Record<string, any>,
  data?: Record<string, any>
}

export class RestAPI {
  private _baseUrl: string
  private _endpoints: EndpointMap

  constructor(baseUrl: string, endpointList: EndpointMap) {
    this._baseUrl = baseUrl
    this._endpoints = endpointList
  }

  private paramsBuilder(urlPath: string, payloadParams: Record<string, any>): string {
    return Object
      .keys(payloadParams)
      .reduce((acc, curr) => acc.replaceAll(`:${curr}`, payloadParams[curr]), urlPath)
  }

  private queryParamsBuilder(urlPath: string, payloadQueryParams: Record<string, any>): string {
    return `${urlPath}?${qs.stringify(payloadQueryParams, { encodeValuesOnly: true })}`
  }

  public async call(
    endpointPath: string,
    payload: EndpointPayload
  ) {
    const [domainName, actionName] = endpointPath.split('.')
    const endpointmap = this._endpoints[domainName][actionName]

    const requestOptions = {
      method: endpointmap.method,
      headers: {
        'Accept'      : 'application/json',
        'Content-Type': 'application/json'
      }
    } as RequestInit

    // parse params
    if (payload.params) {
      endpointmap.url = this.paramsBuilder(endpointmap.url, payload.params)
    }

    // parse query
    if (payload.query) {
      endpointmap.url = this.queryParamsBuilder(endpointmap.url, payload.query)
    }

    // parse body
    if (payload.data) {
      requestOptions.body = JSON.stringify(payload.data)
    }

    const response = await fetch(`${this._baseUrl}/${endpointmap.url}`, requestOptions)

    console.log("response", response)
  }
}
