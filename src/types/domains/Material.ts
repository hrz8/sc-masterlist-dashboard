import type CommonDomain from "./common"
import type MaterialGrade from "./MaterialGrade"
import type Partner from "./Partner"

export default interface Material extends CommonDomain {
  id: string
  tsm: string
  description: string
  maker: Partner
  materialGrade: MaterialGrade
}
