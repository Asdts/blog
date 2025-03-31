"use client"

import type { Container } from "./ContainerTypes"
import { Card, CardContent } from "@/components/ui/card"

interface BlogPreviewProps {
  name: string
  containers: Container[]
}

export default function BlogPreview({ name, containers }: BlogPreviewProps) {
  // Helper function to render nested containers
  const renderContainers = (containerList: Container[], level = 0) => {
    return containerList.map((container) => {
      switch (container.type) {
        case "title":
          return (
            <div key={container.id} className="mb-4">
              <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-primary/10 text-primary mb-2">
                {container.tag}
              </span>
              <h2 className="text-2xl font-bold">{container.title}</h2>
            </div>
          )

        case "description":
          return (
            <div key={container.id} className="mb-4">
              <div className="prose max-w-none">
                {container.content.split("\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              {container.children && container.children.length > 0 && (
                <div className={`pl-4 border-l-2 border-gray-300 mt-2 ${level > 0 ? "ml-4" : ""}`}>
                  {renderContainers(container.children, level + 1)}
                </div>
              )}
            </div>
          )

        case "keyPoint":
          return (
            <div key={container.id} className="mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p>{container.content}</p>
              </div>
            </div>
          )

        case "image":
          return (
            <div key={container.id} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {container.url.map((url, i) => (
                  <div key={i} className="relative">
                    <img
                      src={url || "/placeholder.svg?height=200&width=300"}
                      alt={`Image ${i + 1}`}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    {container.placement[i] && (
                      <div className="absolute bottom-0 left-0 bg-black/70 text-white px-2 py-1 text-sm rounded-tr-md">
                        {container.placement[i]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )

        default:
          return null
      }
    })
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h1 className="text-3xl font-bold mb-6">{name}</h1>
        {renderContainers(containers)}
      </CardContent>
    </Card>
  )
}

