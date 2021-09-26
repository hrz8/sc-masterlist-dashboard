import type CommonDomain from "./common"

export default interface MaterialGrade extends CommonDomain {
  id: string
  code: string
  description: string
}
