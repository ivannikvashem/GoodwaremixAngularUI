export class Document {
  id: string
  supplierId: string
  type: string
  url: string[] = []
  certTitle: string
  certNumber: string
  files: string[] = []
  certOrganizNumber: string
  certOrganizDescr: string
  startDate: Date
  endDate: Date
  blankNumber: string
  isDeleted: boolean
  keywords: string[] = []
}
