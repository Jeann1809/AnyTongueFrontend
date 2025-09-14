'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings, Bell, Shield, Palette, User, MessageSquare, Globe } from 'lucide-react'
import { useChatContext } from '@/app/(main)/layout'
import { useSettings } from '@/lib/settingsContext'

export default function SettingsPage() {
  const { user } = useChatContext()
  const { settings, updateSetting } = useSettings()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new-messages">New Messages</Label>
                <p className="text-sm text-muted-foreground">Get notified of new messages</p>
              </div>
              <Switch
                id="new-messages"
                checked={settings.notifications.newMessages}
                onChange={(checked) => updateSetting('notifications', 'newMessages', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="chat-updates">Chat Updates</Label>
                <p className="text-sm text-muted-foreground">Notifications for chat changes</p>
              </div>
              <Switch
                id="chat-updates"
                checked={settings.notifications.chatUpdates}
                onChange={(checked) => updateSetting('notifications', 'chatUpdates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="system-alerts">System Alerts</Label>
                <p className="text-sm text-muted-foreground">Important system notifications</p>
              </div>
              <Switch
                id="system-alerts"
                checked={settings.notifications.systemAlerts}
                onChange={(checked) => updateSetting('notifications', 'systemAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sound-enabled">Sound Notifications</Label>
                <p className="text-sm text-muted-foreground">Play sounds for notifications</p>
              </div>
              <Switch
                id="sound-enabled"
                checked={settings.notifications.soundEnabled}
                onChange={(checked) => updateSetting('notifications', 'soundEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                <p className="text-sm text-muted-foreground">Show browser notifications</p>
              </div>
              <Switch
                id="desktop-notifications"
                checked={settings.notifications.desktopNotifications}
                onChange={(checked) => updateSetting('notifications', 'desktopNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Manage your privacy and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="online-status">Show Online Status</Label>
                <p className="text-sm text-muted-foreground">Let others see when you're online</p>
              </div>
              <Switch
                id="online-status"
                checked={settings.privacy.showOnlineStatus}
                onChange={(checked) => updateSetting('privacy', 'showOnlineStatus', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="direct-messages">Allow Direct Messages</Label>
                <p className="text-sm text-muted-foreground">Let others send you direct messages</p>
              </div>
              <Switch
                id="direct-messages"
                checked={settings.privacy.allowDirectMessages}
                onChange={(checked) => updateSetting('privacy', 'allowDirectMessages', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="last-seen">Show Last Seen</Label>
                <p className="text-sm text-muted-foreground">Show when you were last active</p>
              </div>
              <Switch
                id="last-seen"
                checked={settings.privacy.showLastSeen}
                onChange={(checked) => updateSetting('privacy', 'showLastSeen', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="data-collection">Data Collection</Label>
                <p className="text-sm text-muted-foreground">Allow usage data collection</p>
              </div>
              <Switch
                id="data-collection"
                checked={settings.privacy.dataCollection}
                onChange={(checked) => updateSetting('privacy', 'dataCollection', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={settings.appearance.theme} onValueChange={(value) => updateSetting('appearance', 'theme', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={settings.appearance.language} onValueChange={(value) => updateSetting('appearance', 'language', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size</Label>
              <Select value={settings.appearance.fontSize} onValueChange={(value) => updateSetting('appearance', 'fontSize', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact-mode">Compact Mode</Label>
                <p className="text-sm text-muted-foreground">Use smaller spacing and elements</p>
              </div>
              <Switch
                id="compact-mode"
                checked={settings.appearance.compactMode}
                onChange={(checked) => updateSetting('appearance', 'compactMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Chat Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Chat Preferences
            </CardTitle>
            <CardDescription>
              Customize your chat experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-translate">Auto Translate</Label>
                <p className="text-sm text-muted-foreground">Automatically translate messages</p>
              </div>
              <Switch
                id="auto-translate"
                checked={settings.chatPrefs.autoTranslate}
                onChange={(checked) => updateSetting('chatPrefs', 'autoTranslate', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-timestamps">Show Timestamps</Label>
                <p className="text-sm text-muted-foreground">Display message timestamps</p>
              </div>
              <Switch
                id="show-timestamps"
                checked={settings.chatPrefs.showTimestamps}
                onChange={(checked) => updateSetting('chatPrefs', 'showTimestamps', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="read-receipts">Read Receipts</Label>
                <p className="text-sm text-muted-foreground">Show when messages are read</p>
              </div>
              <Switch
                id="read-receipts"
                checked={settings.chatPrefs.showReadReceipts}
                onChange={(checked) => updateSetting('chatPrefs', 'showReadReceipts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enter-to-send">Enter to Send</Label>
                <p className="text-sm text-muted-foreground">Press Enter to send messages</p>
              </div>
              <Switch
                id="enter-to-send"
                checked={settings.chatPrefs.enterToSend}
                onChange={(checked) => updateSetting('chatPrefs', 'enterToSend', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* User Profile */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              User Profile
            </CardTitle>
            <CardDescription>
              Manage your profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {user?.username || 'Not available'}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {user?.email || 'Not available'}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Native Language</Label>
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {user?.nativeLanguage || 'Not set'}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Member Since</Label>
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
