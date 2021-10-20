import { HTTPMethod } from '../methods'
import type { EndpointMap } from '../service'

export const BASE_URL = 'http://localhost:3999/api'

export const endpoints: EndpointMap = {
  partner: {
    list: {
      method: HTTPMethod.GET,
      url: '/v1/partner'
    },
    detail: {
      method: HTTPMethod.GET,
      url: '/v1/partner/:id'
    },
    create: {
      method: HTTPMethod.POST,
      url: '/v1/partner'
    },
    update: {
      method: HTTPMethod.PUT,
      url: '/v1/partner/:id'
    },
    delete: {
      method: HTTPMethod.DELETE,
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
    },
    update: {
      method: HTTPMethod.PUT,
      url: '/v1/partner-type/:id'
    },
    delete: {
      method: HTTPMethod.DELETE,
      url: '/v1/partner-type/:id'
    }
  },
  material: {
    list: {
      method: HTTPMethod.GET,
      url: '/v1/material'
    },
    detail: {
      method: HTTPMethod.GET,
      url: '/v1/material/:id'
    },
    create: {
      method: HTTPMethod.POST,
      url: '/v1/material'
    },
    update: {
      method: HTTPMethod.PUT,
      url: '/v1/material/:id'
    },
    delete: {
      method: HTTPMethod.DELETE,
      url: '/v1/material/:id'
    }
  }
}

export default endpoints
