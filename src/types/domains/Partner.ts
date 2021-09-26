import type CommonDomain from "./common"
import type Material from "./Material"
import type PartnerType from "./PartnerType"

export default interface Partner extends CommonDomain {
  id: string
  name: string
  address: string
  contact: string
  description: string
  partnerTypes: PartnerType[]
  materials?: Material[]
}
