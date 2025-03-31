"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { fetchBlogs } from "@/lib/api"
import { useNotificationContext } from "@/components/notification"

export default function Home() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { showNotification } = useNotificationContext()

  // useEffect(() => {
  //   const getBlogs = async () => {
  //     try {
  //       // const data = await fetchBlogs()
  //       setBlogs(data)
  //     } catch (error: any) {
  //       showNotification({
  //         title: "Error",
  //         description: error.message || "Failed to fetch blogs",
  //         type: "destructive",
  //       })
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   getBlogs()
  // }, [showNotification])

  return (
    <main className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link href="/blog/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Blog
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">No blog posts yet</h2>
          <p className="text-muted-foreground mb-6">Create your first blog post to get started</p>
          <Link href="/blog/new">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Blog
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog: any) => (
            <Card key={blog._id} className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-2">{blog.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                {blog.title && blog.title[0] && (
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-primary/10 text-primary">
                      {blog.title[0].tag}
                    </span>
                    <p className="font-medium mt-1">{blog.title[0].title}</p>
                  </div>
                )}
                {blog.description && blog.description[0] && (
                  <p className="text-muted-foreground line-clamp-3">{blog.description[0]}</p>
                )}
              </CardContent>
              <CardFooter>
                <Link href={`/blog/${blog._id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Read More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}

