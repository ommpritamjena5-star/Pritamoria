import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Users, Eye, Download, Trash2, AlertTriangle } from 'lucide-react';
import { getAllUsers, exportUsersAsText, clearAllUsers } from '../utils/userStorage';
import { toast } from 'sonner';

/**
 * ViewUserData Component
 * 
 * This component allows viewing the stored user data in localStorage.
 * For demonstration and development purposes only.
 * 
 * ⚠️ WARNING: This exposes user data including plain text passwords.
 * Never use this in a production environment!
 */
export function ViewUserData() {
  const [users, setUsers] = useState(getAllUsers());
  const [showPasswords, setShowPasswords] = useState(false);

  const refreshUsers = () => {
    setUsers(getAllUsers());
  };

  const handleDownload = () => {
    const textData = exportUsersAsText();
    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pritamoria_users_data.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('User data downloaded successfully');
  };

  const handleClearAll = () => {
    if (window.confirm('⚠️ Are you sure you want to delete all user data? This cannot be undone!')) {
      clearAllUsers();
      setUsers([]);
      toast.success('All user data has been cleared');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 shadow-lg z-50"
          onClick={refreshUsers}
        >
          <Users className="w-4 h-4 mr-2" />
          View User Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Stored User Data</span>
            <Badge variant="destructive" className="ml-2">
              Dev Only
            </Badge>
          </DialogTitle>
          <DialogDescription>
            User authentication data stored in browser localStorage (demonstration mode)
          </DialogDescription>
        </DialogHeader>

        {/* Security Warning */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <strong className="block mb-1">Security Warning:</strong>
                Passwords are stored in PLAIN TEXT. This is for demonstration only and should NEVER be used in production!
                For real applications, use proper authentication with encrypted passwords and secure backend storage.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Total Users: {users.length}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasswords(!showPasswords)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPasswords ? 'Hide' : 'Show'} Passwords
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearAll}
              disabled={users.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* User List */}
        {users.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-300">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No users registered yet</p>
              <p className="text-sm mt-1">Sign up to create the first user</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {users.map((user, index) => (
              <Card key={user.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{user.name}</CardTitle>
                    <Badge variant="outline">
                      User #{index + 1}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-300">ID:</span>
                      <div className="text-gray-100 font-mono text-xs">{user.id}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-300">Email:</span>
                      <div className="text-gray-100">{user.email}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-300">Password:</span>
                      <div className="text-gray-100 font-mono">
                        {showPasswords ? user.password : '••••••••'}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-300">Created:</span>
                      <div className="text-gray-100">
                        {new Date(user.createdAt).toLocaleDateString()} {new Date(user.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Storage Info */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="text-sm text-blue-800">
              <strong className="block mb-1">Storage Location:</strong>
              Browser localStorage → Key: <code className="bg-blue-100 px-1 rounded">'pritamoria_users_data'</code>
              <div className="mt-2 text-xs">
                Data persists in this browser only. Clearing browser data will remove all users.
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
