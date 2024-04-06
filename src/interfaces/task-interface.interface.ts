export interface TaskInterface {
    id: number,
    title: string,
    description: string,
    status: string,
    deadline: string,
    comments: string,
    tags: string,
    //file: null,
}

export interface PaginationTaskInterface {
  page: number,
  page_size: number,
  total_pages: number,
  tasks: TaskInterface[]
}