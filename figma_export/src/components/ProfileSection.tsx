import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Switch } from './ui/switch';
import { 
  User, 
  BookmarkIcon, 
  Settings, 
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Award,
  TrendingUp
} from 'lucide-react';

export function ProfileSection() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <h1 className="text-gray-900 mb-1">Profile</h1>
          <p className="text-xs text-gray-500">Manage your account and preferences</p>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <Card className="p-5">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-blue-600 text-white text-xl">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-gray-900 mb-1">John Doe</h2>
              <p className="text-sm text-gray-600">john.doe@email.com</p>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
            <Badge className="bg-blue-600 gap-1">
              <Award className="w-3 h-3" />
              Level 4
            </Badge>
            <Badge variant="secondary">342 Points</Badge>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="w-3 h-3" />
              Top 10%
            </Badge>
          </div>
        </Card>

        {/* Learning Preferences */}
        <Card className="p-4">
          <h3 className="text-gray-900 mb-4">Learning Preferences</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">Daily Digest</p>
                <p className="text-xs text-gray-500">Receive daily news summary</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">Concept Highlights</p>
                <p className="text-xs text-gray-500">Auto-highlight economic terms</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">Quiz Reminders</p>
                <p className="text-xs text-gray-500">Remind me to take quizzes</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-4">
          <h3 className="text-gray-900 mb-4">Notifications</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">Breaking News</p>
                <p className="text-xs text-gray-500">Important economic updates</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">Learning Streak</p>
                <p className="text-xs text-gray-500">Streak milestone alerts</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">New Achievements</p>
                <p className="text-xs text-gray-500">When you earn badges</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Menu Items */}
        <Card className="p-2">
          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <BookmarkIcon className="w-5 h-5 text-gray-600" />
            <span className="flex-1 text-left text-gray-900">Bookmarked Articles</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="flex-1 text-left text-gray-900">Settings</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="flex-1 text-left text-gray-900">Notification Settings</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5 text-gray-600" />
            <span className="flex-1 text-left text-gray-900">Help & Support</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </Card>

        {/* About */}
        <Card className="p-4">
          <h3 className="text-gray-900 mb-2">About EconAI</h3>
          <p className="text-sm text-gray-600 mb-3">
            Your AI-powered companion for learning economics, finance, and accounting through personalized news articles.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Version 1.0.0</span>
            <span>•</span>
            <a href="#" className="text-blue-600">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="text-blue-600">Terms</a>
          </div>
        </Card>

        {/* Logout */}
        <Button variant="outline" className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50">
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
