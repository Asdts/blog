"use client"

import BlogEditor from "@/components/blog/BlogEditor"
import { useEffect, useState } from "react"

export default function NewBlogPage() {
  const [apiEndpoint, setApiEndpoint] = useState("")

  useEffect(() => {
    // Get the API endpoint from environment variables
    const endpoint = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
    setApiEndpoint(`${endpoint}/blogs`)
  }, [])

  if (!apiEndpoint) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading...</p>
      </div>
    )
  }

  return <BlogEditor apiEndpoint={apiEndpoint} />
}

