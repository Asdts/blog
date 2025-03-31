"use client"

import React from "react"

import { useState } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { X } from "lucide-react"

export type NotificationType = "default" | "destructive" | "success"

export interface NotificationProps {
  title: string
  description?: string
  type?: NotificationType
  duration?: number
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<(NotificationProps & { id: string })[]>([])

  const showNotification = (notification: NotificationProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setNotifications((prev) => [...prev, { ...notification, id }])

    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 5000)
    }

    return id
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  return {
    notifications,
    showNotification,
    removeNotification,
  }
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notifications, removeNotification } = useNotification()

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            variant={notification.type || "default"}
            className="animate-in slide-in-from-right-5 duration-300 relative"
          >
            <button
              onClick={() => removeNotification(notification.id)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
            <AlertTitle>{notification.title}</AlertTitle>
            {notification.description && <AlertDescription>{notification.description}</AlertDescription>}
          </Alert>
        ))}
      </div>
    </>
  )
}

export const NotificationContext = React.createContext<{
  showNotification: (notification: NotificationProps) => string
  removeNotification: (id: string) => void
}>({
  showNotification: () => "",
  removeNotification: () => {},
})

export const useNotificationContext = () => {
  return React.useContext(NotificationContext)
}

export const NotificationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notifications, showNotification, removeNotification } = useNotification()

  return (
    <NotificationContext.Provider value={{ showNotification, removeNotification }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            variant={notification.type || "default"}
            className="animate-in slide-in-from-right-5 duration-300 relative"
          >
            <button
              onClick={() => removeNotification(notification.id)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
            <AlertTitle>{notification.title}</AlertTitle>
            {notification.description && <AlertDescription>{notification.description}</AlertDescription>}
          </Alert>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

