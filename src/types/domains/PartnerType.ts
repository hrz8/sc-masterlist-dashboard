import type CommonDomain from "./common"

export default interface PartnerType extends CommonDomain {
  id: string
  name: string
  description: string
}
