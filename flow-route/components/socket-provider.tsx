"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

const SocketContext = createContext<Socket | null>(null)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    console.log("Attempting to connect to socket server...")

    const socketInstance = io("http://localhost:5000", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['polling', 'websocket'], // Try polling first, then websocket
      withCredentials: true,
      extraHeaders: {
        "Access-Control-Allow-Origin": "*"
      }
    })

    socketInstance.on("connect", () => {
      console.log("Socket connected successfully")
      setIsConnected(true)
      setSocket(socketInstance)
      setError(null)
    })

    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason)
      setIsConnected(false)
    })

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
      console.error("Error details:", {
        message: error.message,
        description: error.description,
        type: error.type
      })
      setError(`Failed to connect to server: ${error.message}. Please make sure:
        1. The backend server is running on http://localhost:5000
        2. You have started the server using 'npm start' or 'node server.js'
        3. The server is properly configured for Socket.IO connections`)
    })

    return () => {
      console.log("Cleaning up socket connection...")
      socketInstance.close()
    }
  }, [])

  // Show loading state while connecting
  if (!isConnected && !error) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-2">Connecting to server...</span>
    </div>
  }

  // Show error state if connection failed
  if (error) {
    return <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-red-500 text-center mb-4">{error}</div>
      <div className="text-sm text-gray-500 text-center">
        <p className="mb-2">Troubleshooting steps:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Open a terminal and navigate to your backend directory</li>
          <li>Run <code className="bg-gray-100 px-1 py-0.5 rounded">npm start</code> or <code className="bg-gray-100 px-1 py-0.5 rounded">node server.js</code></li>
          <li>Wait for the message "Server is running on port 5000"</li>
          <li>Refresh this page</li>
        </ol>
      </div>
    </div>
  }

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export const useSocket = () => {
  const socket = useContext(SocketContext)
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return socket
}

