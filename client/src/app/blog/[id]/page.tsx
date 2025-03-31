"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import BlogPreview from "@/components/blog/BlogPreview"
import type { Container, BlogData } from "@/components/blog/ContainerTypes"
import { fetchBlog, deleteBlog } from "@/lib/api"
import { useNotificationContext } from "@/components/notification"
import { v4 as uuidv4 } from "uuid"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function BlogPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { showNotification } = useNotificationContext()

  const [blog, setBlog] = useState<BlogData | null>(null)
  const [containers, setContainers] = useState<Container[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // useEffect(() => {
  //   const getBlog = async () => {
  //     try {
  //       setLoading(true)
  //       const data = await fetchBlog(id)
  //       setBlog(data)

  //       // Convert blog data to containers format for the preview
  //       const loadedContainers: Container[] = []

  //       // Add titles
  //       if (data.title && data.title.length > 0) {
  //         data.title.forEach((titleItem: any) => {
  //           loadedContainers.push({
  //             type: "title",
  //             tag: titleItem.tag,
  //             title: titleItem.title,
  //             id: uuidv4(),
  //           })
  //         })
  //       }

  //       // Add descriptions
  //       if (data.description && data.description.length > 0) {
  //         data.description.forEach((desc: string) => {
  //           loadedContainers.push({
  //             type: "description",
  //             content: desc,
  //             id: uuidv4(),
  //             children: [],
  //           })
  //         })
  //       }

  //       // Add key points
  //       if (data.keyPoints && data.keyPoints.length > 0) {
  //         data.keyPoints.forEach((point: string) => {
  //           loadedContainers.push({
  //             type: "keyPoint",
  //             content: point,
  //             id: uuidv4(),
  //           })
  //         })
  //       }

  //       // Add images
  //       if (data.imageUrl && data.imageUrl.length > 0) {
  //         data.imageUrl.forEach((img: any) => {
  //           loadedContainers.push({
  //             type: "image",
  //             placement: img.placement,
  //             url: img.url,
  //             id: uuidv4(),
  //           })
  //         })
  //       }

  //       setContainers(loadedContainers)
  //     } catch (error: any) {
  //       setError(error.message || "Failed to fetch blog")
  //       showNotification({
  //         title: "Error",
  //         description: error.message || "Failed to fetch blog",
  //         type: "destructive",
  //       })
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   if (id) {
  //     getBlog()
  //   }
  // }, [id, showNotification])

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await deleteBlog(id)
      showNotification({
        title: "Success",
        description: "Blog deleted successfully",
        type: "success",
      })
      router.push("/")
    } catch (error: any) {
      showNotification({
        title: "Error",
        description: error.message || "Failed to delete blog",
        type: "destructive",
      })
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading blog...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
        <p>{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/")}>
          Go Back Home
        </Button>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Blog Not Found</h2>
        <p>The blog you're looking for doesn't exist or has been removed.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/")}>
          Go Back Home
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Button>
        </Link>
        <div className="flex space-x-2">
          <Link href={`/blog/edit/${id}`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Blog
            </Button>
          </Link>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <BlogPreview name={blog.name} containers={containers} />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

