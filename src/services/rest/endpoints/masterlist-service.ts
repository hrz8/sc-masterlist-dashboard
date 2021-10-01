import { HTTPMethod } from '../methods'
import type { EndpointMap } from '../service'

export const BASE_URL = 'http://localhost:3999/api'

export const endpoints: EndpointMap = {
  partner: {
    create: {
      method: HTTPMethod.POST,
      url: '/v1/partner'
    },
    list: {
      method: HTTPMethod.GET,
      url: '/v1/partner'
    },
    detail: {
      method: HTTPMethod.GET,
      url: '/v1/partner/:id'
    }
  },
  partnerType: {
    list: {
      method: HTTPMethod.GET,
      url: '/v1/partner-type'
    },
    detail: {
      method: HTTPMethod.GET,
      url: '/v1/partner-type/:id'
    },
    create: {
      method: HTTPMethod.POST,
      url: '/v1/partner-type'
    }
  }
}

export default endpoints
