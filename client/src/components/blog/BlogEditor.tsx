"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Container, BlogData } from "./ContainerTypes"
import ContainerEditor from "./ContainerEditor"
import BlogPreview from "./BlogPreview"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Save, ArrowLeft } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { useNotificationContext } from "@/components/notification"

interface BlogEditorProps {
  initialData?: BlogData
  isEditing?: boolean
  apiEndpoint: string // The API endpoint to send data to
}

export default function BlogEditor({ initialData, isEditing = false, apiEndpoint }: BlogEditorProps) {
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  const [name, setName] = useState("")
  const [containers, setContainers] = useState<Container[]>([])
  const [activeTab, setActiveTab] = useState("edit")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)

      const loadedContainers: Container[] = []

      // Load titles
      initialData.title.forEach((titleItem) => {
        loadedContainers.push({
          type: "title",
          tag: titleItem.tag,
          title: titleItem.title,
          id: uuidv4(),
        })
      })

      // Load descriptions
      initialData.description.forEach((desc) => {
        loadedContainers.push({
          type: "description",
          content: desc,
          id: uuidv4(),
          children: [],
        })
      })

      // Load key points
      initialData.keyPoints.forEach((point) => {
        loadedContainers.push({
          type: "keyPoint",
          content: point,
          id: uuidv4(),
        })
      })

      // Load images
      initialData.imageUrl.forEach((img) => {
        loadedContainers.push({
          type: "image",
          placement: img.placement,
          url: img.url,
          id: uuidv4(),
        })
      })

      setContainers(loadedContainers)
    }
  }, [initialData])

  const convertContainersToData = (): BlogData => {
    const title: { tag: string; title: string }[] = []
    const description: string[] = []
    const imageUrl: { placement: string[]; url: string[] }[] = []
    const keyPoints: string[] = []

    // Helper function to process containers recursively
    const processContainers = (containerList: Container[]) => {
      containerList.forEach((container) => {
        switch (container.type) {
          case "title":
            title.push({
              tag: container.tag,
              title: container.title,
            })
            break
          case "description":
            description.push(container.content)
            // Process nested containers if any
            if (container.children && container.children.length > 0) {
              processContainers(container.children)
            }
            break
          case "keyPoint":
            keyPoints.push(container.content)
            break
          case "image":
            imageUrl.push({
              placement: container.placement,
              url: container.url,
            })
            break
        }
      })
    }

    processContainers(containers)

    return {
      name,
      title,
      description,
      imageUrl,
      keyPoints,
      authorID: initialData?.authorID || "000000000000000000000000", // Dummy ID for testing
      _id: initialData?._id,
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!name) {
        showNotification({
          title: "Error",
          description: "Blog name is required",
          type: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (containers.length === 0) {
        showNotification({
          title: "Error",
          description: "Add at least one container",
          type: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const data = convertContainersToData()

      const url = isEditing && initialData?._id ? `${apiEndpoint}/${initialData._id}` : apiEndpoint

      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save blog")
      }

      const savedBlog = await response.json()

      showNotification({
        title: "Success",
        description: isEditing ? "Blog updated successfully" : "Blog created successfully",
        type: "success",
      })

      router.push(`/blog/${savedBlog._id}`)
    } catch (error: any) {
      showNotification({
        title: "Error",
        description: error.message,
        type: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{isEditing ? "Edit Blog" : "Create New Blog"}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Details</CardTitle>
          <CardDescription>Enter the name of your blog post</CardDescription>
        </CardHeader>
        <CardContent>
          <Input placeholder="Blog Name" value={name} onChange={(e) => setName(e.target.value)} className="mb-4" />
        </CardContent>
      </Card>

      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-4">
            <ContainerEditor containers={containers} onChange={setContainers} allowNesting={true} />
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <BlogPreview name={name} containers={containers} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-end mt-6 space-x-4">
        <Button variant="outline" onClick={() => setActiveTab(activeTab === "edit" ? "preview" : "edit")}>
          <Eye className="h-4 w-4 mr-2" />
          {activeTab === "edit" ? "Preview" : "Edit"}
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Saving..." : isEditing ? "Update Blog" : "Save Blog"}
        </Button>
      </div>
    </div>
  )
}

