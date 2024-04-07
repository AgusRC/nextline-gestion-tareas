export interface BinnaclesInterface {
  id: number,
  history: string,
  createdDate: string,
}

export interface PaginationBinnacleInterface {
  page: number,
  page_size: number,
  total_pages: number,
  binnacles: BinnaclesInterface[],
}