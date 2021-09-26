import type CommonDomain from "./common"
import type MaterialGrade from "./MaterialGrade"

export default interface Material extends CommonDomain {
  id: string
  tsm: string
  description: string
  materialGrade: MaterialGrade
}
