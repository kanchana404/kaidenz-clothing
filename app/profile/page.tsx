'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  LogOut,
  ShoppingBag,
  Heart,
  Settings,
  Shield,
  Camera
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  joinDate: string;
  avatar?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState<Partial<UserData>>({});

  useEffect(() => {
    // Check if user is authenticated
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    if (!cookies.JSESSIONID || cookies.user_status !== 'verified') {
      router.push('/sign-in?redirect=/profile');
      return;
    }

    // Mock user data - in real app, fetch from API
    const mockUserData: UserData = {
      id: cookies.JSESSIONID,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Fashion Street, Style City, SC 12345',
      joinDate: 'January 2024',
      avatar: undefined
    };

    setUserData(mockUserData);
    setEditForm(mockUserData);
    setLoading(false);
  }, [router]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData(prev => prev ? { ...prev, ...editForm } : null);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(userData || {});
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Clear cookies and redirect to home
    document.cookie = 'user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'user_status=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#ffcb74] border-t-transparent"></div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-[#111111]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[#111111]">Profile</h1>
              <p className="text-[#666666] mt-1">Manage your account settings</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="border-[#e5e5e5] text-[#666666] hover:bg-[#ff4d4f] hover:text-white hover:border-[#ff4d4f]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Profile Header Card */}
        <Card className="bg-white border-[#e5e5e5] shadow-sm mb-8">
          <CardContent className="pt-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-2 border-[#ffcb74]">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback className="bg-[#f6f6f6] text-[#ffcb74] text-2xl font-medium">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-[#ffcb74] text-[#111111] hover:bg-[#f6f6f6] p-0"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-semibold text-[#111111]">{userData.name}</h2>
                  <Badge className="bg-[#ffcb74] text-[#111111] font-medium">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                <p className="text-[#666666] mb-1">{userData.email}</p>
                <p className="text-[#666666] text-sm">Member since {userData.joinDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Content Area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white border border-[#e5e5e5] p-1">
                <TabsTrigger 
                  value="profile" 
                  className="data-[state=active]:bg-[#ffcb74] data-[state=active]:text-[#111111]"
                >
                  Personal Info
                </TabsTrigger>
                <TabsTrigger 
                  value="orders" 
                  className="data-[state=active]:bg-[#ffcb74] data-[state=active]:text-[#111111]"
                >
                  Orders
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="data-[state=active]:bg-[#ffcb74] data-[state=active]:text-[#111111]"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <Card className="bg-white border-[#e5e5e5] shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-[#111111] text-lg font-medium">
                      Personal Information
                    </CardTitle>
                    {!isEditing ? (
                      <Button 
                        onClick={handleEdit}
                        variant="outline" 
                        size="sm"
                        className="border-[#ffcb74] text-[#ffcb74] hover:bg-[#ffcb74] hover:text-[#111111]"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSave}
                          size="sm"
                          className="bg-[#ffcb74] text-[#111111] hover:bg-[#f6f6f6]"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button 
                          onClick={handleCancel}
                          variant="outline" 
                          size="sm"
                          className="border-[#e5e5e5] text-[#666666] hover:bg-[#f6f6f6]"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-[#111111] text-sm font-medium">
                          Full Name
                        </Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            value={editForm.name || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-white border-[#e5e5e5] text-[#111111] focus:border-[#ffcb74] focus:ring-1 focus:ring-[#ffcb74]"
                          />
                        ) : (
                          <div className="flex items-center gap-2 py-2">
                            <User className="w-4 h-4 text-[#ffcb74]" />
                            <span className="text-[#666666]">{userData.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-[#111111] text-sm font-medium">
                          Email Address
                        </Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={editForm.email || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            className="bg-white border-[#e5e5e5] text-[#111111] focus:border-[#ffcb74] focus:ring-1 focus:ring-[#ffcb74]"
                          />
                        ) : (
                          <div className="flex items-center gap-2 py-2">
                            <Mail className="w-4 h-4 text-[#ffcb74]" />
                            <span className="text-[#666666]">{userData.email}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-[#111111] text-sm font-medium">
                          Phone Number
                        </Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={editForm.phone || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="bg-white border-[#e5e5e5] text-[#111111] focus:border-[#ffcb74] focus:ring-1 focus:ring-[#ffcb74]"
                          />
                        ) : (
                          <div className="flex items-center gap-2 py-2">
                            <Phone className="w-4 h-4 text-[#ffcb74]" />
                            <span className="text-[#666666]">{userData.phone || 'Not provided'}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[#111111] text-sm font-medium">
                          Member Since
                        </Label>
                        <div className="flex items-center gap-2 py-2">
                          <Calendar className="w-4 h-4 text-[#ffcb74]" />
                          <span className="text-[#666666]">{userData.joinDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="address" className="text-[#111111] text-sm font-medium">
                        Address
                      </Label>
                      {isEditing ? (
                        <Input
                          id="address"
                          value={editForm.address || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                          className="bg-white border-[#e5e5e5] text-[#111111] focus:border-[#ffcb74] focus:ring-1 focus:ring-[#ffcb74]"
                        />
                      ) : (
                        <div className="flex items-center gap-2 py-2">
                          <MapPin className="w-4 h-4 text-[#ffcb74]" />
                          <span className="text-[#666666]">{userData.address || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="mt-6">
                <Card className="bg-white border-[#e5e5e5] shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-[#111111] text-lg font-medium">Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <ShoppingBag className="w-12 h-12 text-[#ffcb74] mx-auto mb-4" />
                      <p className="text-[#666666] mb-4">No orders yet</p>
                      <Button className="bg-[#ffcb74] text-[#111111] hover:bg-[#f6f6f6]">
                        Start Shopping
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <Card className="bg-white border-[#e5e5e5] shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-[#111111] text-lg font-medium">Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3">
                        <span className="text-[#111111]">Email Notifications</span>
                        <Button variant="outline" size="sm" className="border-[#e5e5e5] text-[#666666]">
                          Manage
                        </Button>
                      </div>
                      <Separator className="bg-[#e5e5e5]" />
                      <div className="flex items-center justify-between py-3">
                        <span className="text-[#111111]">Privacy Settings</span>
                        <Button variant="outline" size="sm" className="border-[#e5e5e5] text-[#666666]">
                          Configure
                        </Button>
                      </div>
                      <Separator className="bg-[#e5e5e5]" />
                      <div className="flex items-center justify-between py-3">
                        <span className="text-[#111111]">Change Password</span>
                        <Button variant="outline" size="sm" className="border-[#e5e5e5] text-[#666666]">
                          Update
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="bg-white border-[#e5e5e5] shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[#111111] text-lg font-medium">Account Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#ffcb74]" />
                      <span className="text-[#666666] text-sm">Orders</span>
                    </div>
                    <Badge className="bg-[#f6f6f6] text-[#111111] border border-[#e5e5e5]">12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#ffcb74]" />
                      <span className="text-[#666666] text-sm">Wishlist</span>
                    </div>
                    <Badge className="bg-[#f6f6f6] text-[#111111] border border-[#e5e5e5]">8</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-[#ffcb74]" />
                      <span className="text-[#666666] text-sm">Reviews</span>
                    </div>
                    <Badge className="bg-[#f6f6f6] text-[#111111] border border-[#e5e5e5]">5</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white border-[#e5e5e5] shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[#111111] text-lg font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-[#666666] hover:bg-[#f6f6f6] hover:text-[#ffcb74]"
                  >
                    <ShoppingBag className="w-4 h-4 mr-3" />
                    View Orders
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-[#666666] hover:bg-[#f6f6f6] hover:text-[#ffcb74]"
                  >
                    <Heart className="w-4 h-4 mr-3" />
                    My Wishlist
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-[#666666] hover:bg-[#f6f6f6] hover:text-[#ffcb74]"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Account Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}