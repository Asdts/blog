"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import BlogEditor from "@/components/blog/BlogEditor"
import { fetchBlog } from "@/lib/api"
import { useNotificationContext } from "@/components/notification"

export default function EditBlogPage() {
  const params = useParams()
  const id = params.id as string
  const { showNotification } = useNotificationContext()

  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [apiEndpoint, setApiEndpoint] = useState("")

  // useEffect(() => {
  //   const getBlog = async () => {
  //     try {
  //       const data = await fetchBlog(id)
  //       setBlog(data)
  //     } catch (error: any) {
  //       showNotification({
  //         title: "Error",
  //         description: error.message || "Failed to fetch blog",
  //         type: "destructive",
  //       })
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   // Get the API endpoint from environment variables
  //   const endpoint = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
  //   setApiEndpoint(`${endpoint}/blogs`)

  //   if (id) {
  //     getBlog()
  //   }
  // }, [id, showNotification])

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading blog...</p>
      </div>
    )
  }

  return <BlogEditor initialData={blog} isEditing={true} apiEndpoint={apiEndpoint} />
}

