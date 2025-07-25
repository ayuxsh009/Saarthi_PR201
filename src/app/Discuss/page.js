"use client"

import React from "react"
import { useChat } from "ai/react"
import { useUser } from "@clerk/nextjs"
import { useState, useRef } from "react"
import { Send, Paperclip, ImageIcon, FileText, X, Download } from "lucide-react"
import Image from "next/image"


function Button({ 
  children, 
  className = "", 
  variant = "default", 
  size = "default", 
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
  
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-gray-100",
    link: "text-blue-600 underline hover:text-blue-800",
  }

  const sizeStyles = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

function Badge({ 
  children, 
  className = "", 
  variant = "default", 
  ...props 
}) {
  const variantStyles = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-gray-300 bg-white",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

// Card Component
function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// Avatar Components
function Avatar({ className = "", children, ...props }) {
  return (
    <div
      className={`relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

function AvatarImage({ src, className = "", ...props }) {
  return (
    <img
      src={src}
      className={`aspect-square h-full w-full ${className}`}
      {...props}
    />
  )
}

function AvatarFallback({ className = "", children, ...props }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// MessageBubble Component
function MessageBubble({ message }) {
  const isUser = message.role === "user"
  const userName = message.data?.userName || "Anonymous"
  const userImage = message.data?.userImage

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarFallback className="bg-blue-500 text-white text-xs">SYS</AvatarFallback>
        </Avatar>
      )}

      <div className={`max-w-[70%] ${isUser ? "order-1" : ""}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-gray-600">{isUser ? userName : "System"}</span>
          <span className="text-xs text-gray-400">{new Date().toLocaleTimeString()}</span>
        </div>

        <Card className={`p-3 ${isUser ? "bg-blue-500 text-white" : "bg-white border border-gray-200"}`}>
          {message.content && <div className="whitespace-pre-wrap text-sm">{message.content}</div>}

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment, index) => (
                <div key={index}>
                  {attachment.contentType?.startsWith("image/") ? (
                    <div className="relative">
                      <Image
                        src={attachment.url || "/placeholder.svg"}
                        alt={attachment.name || `Image ${index + 1}`}
                        width={300}
                        height={200}
                        className="rounded-md object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={`flex items-center gap-2 p-2 rounded border ${
                        isUser ? "border-blue-300 bg-blue-400" : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <FileText size={16} />
                      <span className="text-sm flex-1 truncate">{attachment.name || "File"}</span>
                      <a href={attachment.url} download={attachment.name} className="p-1 hover:bg-black/10 rounded">
                        <Download size={14} />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {isUser && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarImage src={userImage || "/placeholder.svg"} />
          <AvatarFallback className="bg-blue-500 text-white text-xs">
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

export default function DiscussPage() {
  const { user } = useUser()
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: { 
      category: "general",
      userName: user?.firstName || user?.username || "Anonymous",
      userImage: user?.imageUrl
    },
  })

  const [files, setFiles] = useState(undefined)
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    if (event.target.files) {
      setFiles(event.target.files)
    }
  }

  const removeFiles = () => {
    setFiles(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!input.trim() && !files?.length) return

    const formData = new FormData()
    formData.append("message", input)
    formData.append("category", "general")
    formData.append("userName", user?.firstName || user?.username || "Anonymous")
    if (user?.imageUrl) {
      formData.append("userImage", user.imageUrl)
    }
    
    if (files) {
      Array.from(files).forEach((file) => {
        formData.append("attachments", file)
      })
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      handleInputChange({ target: { value: "" } })
      removeFiles()
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <FileText size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-1">Start the conversation</h3>
            <p className="text-gray-500">Be the first to share something in the general discussion!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={{
                id: message.id,
                role: message.role === "data" || message.role === "system" ? "assistant" : message.role,
                content: message.content,
                data: {
                  userName: user?.firstName || user?.username || "Anonymous",
                  userImage: user?.imageUrl
                }
              }}
            />
          ))
        )}
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-pulse text-gray-500">Sending message...</div>
          </div>
        )}
      </div>

      {/* File Preview */}
      {files && files.length > 0 && (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Paperclip size={16} />
            <span className="text-sm font-medium">Attached Files:</span>
            <Button variant="ghost" size="sm" onClick={removeFiles} className="ml-auto">
              <X size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from(files).map((file, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {file.type.startsWith("image/") ? <ImageIcon size={12} /> : <FileText size={12} />}
                {file.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={onSubmit} className="flex gap-2" encType="multipart/form-data">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt,.py,.js,.html,.css"
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0"
          >
            <Paperclip size={16} />
          </Button>

          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Share your thoughts in the general discussion..."
            className="flex-1"
            disabled={isLoading}
          />

          <Button type="submit" disabled={isLoading || (!input.trim() && !files?.length)}>
            <Send size={16} />
          </Button>
        </form>
      </div>
    </div>
  )
}