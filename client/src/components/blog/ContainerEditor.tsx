"use client"
import type { Container, ContainerType } from "./ContainerTypes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PlusCircle, Trash2, MoveUp, MoveDown } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface ContainerEditorProps {
  containers: Container[]
  onChange: (containers: Container[]) => void
  allowNesting?: boolean
  nestingLevel?: number
}

export default function ContainerEditor({
  containers,
  onChange,
  allowNesting = false,
  nestingLevel = 0,
}: ContainerEditorProps) {
  const addContainer = (type: ContainerType) => {
    let newContainer: Container

    switch (type) {
      case "title":
        newContainer = {
          type: "title",
          tag: "",
          title: "",
          id: uuidv4(),
        }
        break
      case "description":
        newContainer = {
          type: "description",
          content: "",
          id: uuidv4(),
          children: [],
        }
        break
      case "keyPoint":
        newContainer = {
          type: "keyPoint",
          content: "",
          id: uuidv4(),
        }
        break
      case "image":
        newContainer = {
          type: "image",
          placement: [""],
          url: [""],
          id: uuidv4(),
        }
        break
      default:
        return
    }

    onChange([...containers, newContainer])
  }

  const updateContainer = (index: number, updatedContainer: Container) => {
    const newContainers = [...containers]
    newContainers[index] = updatedContainer
    onChange(newContainers)
  }

  const removeContainer = (index: number) => {
    const newContainers = [...containers]
    newContainers.splice(index, 1)
    onChange(newContainers)
  }

  const moveContainer = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === containers.length - 1)) {
      return
    }

    const newContainers = [...containers]
    const newIndex = direction === "up" ? index - 1 : index + 1
    ;[newContainers[index], newContainers[newIndex]] = [newContainers[newIndex], newContainers[index]]

    onChange(newContainers)
  }

  const updateNestedContainers = (parentIndex: number, nestedContainers: Container[]) => {
    const newContainers = [...containers]
    if (newContainers[parentIndex].type === "description") {
      ;(newContainers[parentIndex] as any).children = nestedContainers
      onChange(newContainers)
    }
  }

  return (
    <div className="space-y-4">
      {containers.map((container, index) => (
        <Card
          key={container.id}
          className={`border-l-4 ${nestingLevel > 0 ? "border-l-blue-500" : "border-l-primary"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <div className="font-medium capitalize">{container.type} Container</div>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={() => moveContainer(index, "up")} disabled={index === 0}>
                <MoveUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => moveContainer(index, "down")}
                disabled={index === containers.length - 1}
              >
                <MoveDown className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => removeContainer(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {container.type === "title" && (
              <div className="space-y-4">
                <Input
                  placeholder="Tag"
                  value={container.tag}
                  onChange={(e) =>
                    updateContainer(index, {
                      ...container,
                      tag: e.target.value,
                    } as any)
                  }
                />
                <Input
                  placeholder="Title"
                  value={container.title}
                  onChange={(e) =>
                    updateContainer(index, {
                      ...container,
                      title: e.target.value,
                    } as any)
                  }
                />
              </div>
            )}

            {container.type === "description" && (
              <div className="space-y-4">
                <Textarea
                  placeholder="Description content"
                  value={(container as any).content}
                  onChange={(e) =>
                    updateContainer(index, {
                      ...container,
                      content: e.target.value,
                    } as any)
                  }
                  rows={4}
                />

                {allowNesting && nestingLevel < 3 && (
                  <div className="pl-4 border-l-2 border-dashed border-gray-300 mt-4">
                    <div className="mb-2 text-sm font-medium">Nested Containers</div>
                    <ContainerEditor
                      containers={(container as any).children || []}
                      onChange={(nestedContainers) => updateNestedContainers(index, nestedContainers)}
                      allowNesting={true}
                      nestingLevel={nestingLevel + 1}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const children = [...((container as any).children || [])]
                          children.push({
                            type: "description",
                            content: "",
                            id: uuidv4(),
                            children: [],
                          })
                          updateContainer(index, {
                            ...container,
                            children,
                          } as any)
                        }}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Nested Description
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {container.type === "keyPoint" && (
              <Textarea
                placeholder="Key point"
                value={(container as any).content}
                onChange={(e) =>
                  updateContainer(index, {
                    ...container,
                    content: e.target.value,
                  } as any)
                }
                rows={2}
              />
            )}

            {container.type === "image" && (
              <div className="space-y-4">
                <div>
                  <div className="mb-2 text-sm font-medium">Placement</div>
                  {(container as any).placement.map((place: string, i: number) => (
                    <div key={i} className="flex mb-2">
                      <Input
                        placeholder={`Placement ${i + 1}`}
                        value={place}
                        onChange={(e) => {
                          const newPlacement = [...(container as any).placement]
                          newPlacement[i] = e.target.value
                          updateContainer(index, {
                            ...container,
                            placement: newPlacement,
                          } as any)
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newPlacement = [...(container as any).placement]
                          newPlacement.splice(i, 1)
                          updateContainer(index, {
                            ...container,
                            placement: newPlacement,
                          } as any)
                        }}
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newPlacement = [...(container as any).placement, ""]
                      updateContainer(index, {
                        ...container,
                        placement: newPlacement,
                      } as any)
                    }}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Placement
                  </Button>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium">URLs</div>
                  {(container as any).url.map((url: string, i: number) => (
                    <div key={i} className="flex mb-2">
                      <Input
                        placeholder={`URL ${i + 1}`}
                        value={url}
                        onChange={(e) => {
                          const newUrls = [...(container as any).url]
                          newUrls[i] = e.target.value
                          updateContainer(index, {
                            ...container,
                            url: newUrls,
                          } as any)
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newUrls = [...(container as any).url]
                          newUrls.splice(i, 1)
                          updateContainer(index, {
                            ...container,
                            url: newUrls,
                          } as any)
                        }}
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newUrls = [...(container as any).url, ""]
                      updateContainer(index, {
                        ...container,
                        url: newUrls,
                      } as any)
                    }}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add URL
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <div className="flex flex-wrap gap-2 mt-4">
        <Button variant="outline" onClick={() => addContainer("title")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Title
        </Button>
        <Button variant="outline" onClick={() => addContainer("description")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Description
        </Button>
        <Button variant="outline" onClick={() => addContainer("keyPoint")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Key Point
        </Button>
        <Button variant="outline" onClick={() => addContainer("image")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Image
        </Button>
      </div>
    </div>
  )
}

