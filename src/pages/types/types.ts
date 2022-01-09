export interface ICategory {
  value: string,
  id: number,
}

export interface IImageProperties {
  width: number,
  height: number,
  categories: ICategory[]
}
