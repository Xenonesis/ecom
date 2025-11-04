'use client'

import { useEffect } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { useNotificationsStore } from '../lib/store/notifications'
import { useAuthStore } from '../lib/store/auth'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './ui/dropdown-menu'
import { formatDistanceToNow } from 'date-fns'

export function Notifications() {
  const { user } = useAuthStore()
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearError
  } = useNotificationsStore()

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user, fetchNotifications])

  if (!user) return null

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId)
    clearError()
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
    clearError()
  }

  const trigger = (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </Button>
  )

  return (
    <DropdownMenu trigger={trigger}>
      <div className="p-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-auto p-1 text-xs"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          )}
          {!isLoading && notifications.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          )}
          {!isLoading && notifications.length > 0 && (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-4 cursor-pointer ${
                  notification.is_read ? '' : 'bg-muted/50'
                }`}
                onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{notification.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {notification.created_at ? formatDistanceToNow(new Date(notification.created_at), { addSuffix: true }) : 'Unknown time'}
                    </div>
                  </div>
                  {!notification.is_read && (
                    <div className="ml-2">
                      <div className="h-2 w-2 bg-primary rounded-full" />
                    </div>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </div>
    </DropdownMenu>
  )
}