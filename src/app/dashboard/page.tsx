'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, ExternalLink, User, Settings, Package } from "lucide-react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

interface LightspeedConnection {
  isConnected: boolean;
  lastSync?: string;
  accountId?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [lightspeedStatus, setLightspeedStatus] = useState<LightspeedConnection>({
    isConnected: false
  });
  const [loading, setLoading] = useState(true);
  const [connectingToLightspeed, setConnectingToLightspeed] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    checkLightspeedStatus();
  }, []);


const checkAuthStatus = async () => {
  try {
    const res = await fetch('/api/auth/me', {
      credentials: 'include' // Make sure cookies are sent
    });
    if (!res.ok) {
      if (res.status === 401) {
        console.log('User not authenticated, redirecting to login');
        router.push('/login');
        return;
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const userData = await res.json();
    setUser(userData);
  } catch (error) {
    console.error('Auth check failed:', error);
    router.push('/login');
  } finally {
    setLoading(false);
  }
};

const checkLightspeedStatus = async () => {
  try {
    const res = await fetch('/api/lightspeed/status');
    if (res.ok) {
      const status = await res.json();
      setLightspeedStatus(status);
    } else if (res.status === 401) {
      // Don't fail the whole dashboard if Lightspeed auth fails
      console.log('Lightspeed not authenticated, but continuing with dashboard');
      setLightspeedStatus({ isConnected: false });
    }
  } catch (error) {
    console.error('Failed to check Lightspeed status:', error);
    // Set default state so dashboard still works
    setLightspeedStatus({ isConnected: false });
  }
};

  const handleConnectToLightspeed = async () => {
    setConnectingToLightspeed(true);
    try {
      const res = await fetch('/api/lightspeed/auth-url');
      if (res.ok) {
        const { authUrl } = await res.json();
        // Open Lightspeed OAuth in new window
        window.location.href = authUrl;
      } else {
        throw new Error('Failed to get auth URL');
      }
    } catch (error) {
      console.error('Failed to connect to Lightspeed:', error);
      setConnectingToLightspeed(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">BikeShop Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">{user?.email}</span>
                {user?.isAdmin && (
                  <Badge variant="secondary" className="text-xs">Admin</Badge>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Hey {user?.firstName || 'there'}! 👋
          </h2>
          <p className="text-gray-600">
            Welcome to your BikeShop dashboard. Manage your inventory and sync with Lightspeed.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Lightspeed Status Card */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lightspeed Integration</span>
                {lightspeedStatus.isConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </CardTitle>
              <CardDescription>
                Connect your Lightspeed POS to sync inventory and manage products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Connection Status:</span>
                  <Badge 
                    variant={lightspeedStatus.isConnected ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {lightspeedStatus.isConnected ? 'Connected' : 'Not Connected'}
                  </Badge>
                </div>
                
                {lightspeedStatus.isConnected && lightspeedStatus.lastSync && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Sync:</span>
                    <span className="text-sm text-gray-600">
                      {new Date(lightspeedStatus.lastSync).toLocaleString()}
                    </span>
                  </div>
                )}

                {lightspeedStatus.isConnected && lightspeedStatus.accountId && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Account ID:</span>
                    <span className="text-sm text-gray-600 font-mono">
                      {lightspeedStatus.accountId}
                    </span>
                  </div>
                )}

                {!lightspeedStatus.isConnected && (
                  <Alert>
                    <AlertDescription>
                      Connect to Lightspeed to sync your inventory and manage products directly from your POS system.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  {!lightspeedStatus.isConnected ? (
                    <Button 
                      onClick={handleConnectToLightspeed}
                      disabled={connectingToLightspeed}
                      className="flex items-center gap-2"
                    >
                      {connectingToLightspeed ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <ExternalLink className="h-4 w-4" />
                      )}
                      Connect to Lightspeed
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Sync Now
                      </Button>
                      <Button variant="outline" size="sm">
                        View Products
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  View Inventory
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity to show</p>
              <p className="text-sm">Connect to Lightspeed to start tracking inventory changes</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}