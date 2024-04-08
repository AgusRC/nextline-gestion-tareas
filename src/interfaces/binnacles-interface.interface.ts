export interface BinnaclesInterface {
  id: number,
  createdDate: string,
  createdBy: string,
  history: string,
}

export interface PaginationBinnacleInterface {
  page: number,
  page_size: number,
  total_pages: number,
  total_results: number,
  binnacles: BinnaclesInterface[],
}