export type ContainerType = "title" | "description" | "keyPoint" | "image"

export interface TitleContainer {
  type: "title"
  tag: string
  title: string
  id: string
}

export interface DescriptionContainer {
  type: "description"
  content: string
  id: string
  children?: Container[]
}

export interface KeyPointContainer {
  type: "keyPoint"
  content: string
  id: string
}

export interface ImageContainer {
  type: "image"
  placement: string[]
  url: string[]
  id: string
}

export type Container = TitleContainer | DescriptionContainer | KeyPointContainer | ImageContainer

export interface BlogData {
  name: string
  title: { tag: string; title: string }[]
  description: string[]
  imageUrl: { placement: string[]; url: string[] }[]
  keyPoints: string[]
  authorID: string
  _id?: string
}

