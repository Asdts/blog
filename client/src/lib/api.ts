import type { BlogData } from "@/components/blog/ContainerTypes"

// Replace with your actual API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export async function fetchBlogs() {
  const res = await fetch(`${API_URL}/blogs`)

  if (!res.ok) {
    throw new Error("Failed to fetch blogs")
  }

  return res.json()
}

export async function fetchBlog(id: string) {
  const res = await fetch(`${API_URL}/blogs/${id}`)

  if (!res.ok) {
    throw new Error("Failed to fetch blog")
  }

  return res.json()
}

export async function createBlog(data: BlogData) {
  const res = await fetch(`${API_URL}/blogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to create blog")
  }

  return res.json()
}

export async function updateBlog(id: string, data: BlogData) {
  const res = await fetch(`${API_URL}/blogs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to update blog")
  }

  return res.json()
}

export async function deleteBlog(id: string) {
  const res = await fetch(`${API_URL}/blogs/${id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to delete blog")
  }

  return res.json()
}

