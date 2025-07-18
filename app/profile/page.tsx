'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
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
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  province?: string;
  city?: string;
  postalCode?: string;
  joinDate?: string;
  avatar?: string;
  verificationRequired?: string;
  status?: string;
  authenticated?: boolean;
  provinces?: Array<{ id: string; name: string }>;
  cities?: Array<{ id: string; name: string; province_id?: string }>;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState<Partial<UserData>>({});
  const [provinces, setProvinces] = useState<Array<{ id: string; name: string }>>([]);
  const [cities, setCities] = useState<Array<{ id: string; name: string; province_id?: string }>>([]);
  const [openProvince, setOpenProvince] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [locationDataLoading, setLocationDataLoading] = useState(true);
  const hasInitialized = useRef(false);

  // Function to set provinces and cities from userinfo response
  const setLocationDataFromUserInfo = (userInfoData: UserData) => {
    if (userInfoData.provinces) {
      setProvinces(userInfoData.provinces);
      console.log('Provinces loaded from userinfo:', userInfoData.provinces);
    }
    if (userInfoData.cities) {
      setCities(userInfoData.cities);
      console.log('Cities loaded from userinfo:', userInfoData.cities);
    }
    setLocationDataLoading(false);
    setLoading(false); // Also set main loading to false
  };

  useEffect(() => {
    if (hasInitialized.current) {
      console.log('Profile page useEffect - already initialized, skipping');
      return;
    }
    
    hasInitialized.current = true;
    console.log('Profile page useEffect triggered');
    
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Loading timeout reached, setting loading to false');
      setLoading(false);
    }, 10000); // 10 seconds timeout
    
    // Use the same API route as navbar for consistency
    const checkSession = async () => {
      try {
        const response = await fetch('/api/check-session');
        const data = await response.json();
        console.log('Profile session check result:', data);
        
        if (!data.hasUser) {
          console.log('No valid session found, redirecting to sign-in');
          setLoading(false);
          router.push('/sign-in?redirect=/profile');
          return;
        }
        
        console.log('Valid session found, proceeding to load profile data');
        
        // Make request to UserInfo endpoint via our API route
        try {
          // Try GET first, if it fails due to CORS, try POST
          let userInfoResponse = await fetch('/api/userinfo', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          // If GET fails with CORS error, try POST
          if (userInfoResponse.status === 405 || userInfoResponse.status === 0) {
            console.log('GET failed, trying POST method');
            userInfoResponse = await fetch('/api/userinfo', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
          }
          
          if (userInfoResponse.ok) {
            const userInfoData = await userInfoResponse.json();
            console.log('UserInfo API response:', userInfoData);
            
            // Check if user is authenticated
            if (userInfoData.authenticated === true) {
              // Use the data from the API
              const userDataFromAPI: UserData = {
                id: userInfoData.id || data.sessionId || 'unknown',
                name: userInfoData.name || `${userInfoData.firstName || ''} ${userInfoData.lastName || ''}`.trim() || 'User',
                email: userInfoData.email || 'user@example.com',
                firstName: userInfoData.firstName,
                lastName: userInfoData.lastName,
                phone: userInfoData.phone || '+1 (555) 123-4567',
                address: userInfoData.address || '123 Fashion Street, Style City, SC 12345',
                joinDate: userInfoData.joinDate || 'January 2024',
                avatar: userInfoData.avatar || undefined,
                verificationRequired: userInfoData.verificationRequired,
                status: userInfoData.status,
                authenticated: userInfoData.authenticated,
                provinces: userInfoData.provinces,
                cities: userInfoData.cities
              };
              
              setUserData(userDataFromAPI);
              setEditForm(userDataFromAPI);
              
              // Set location data from userinfo response
              setLocationDataFromUserInfo(userInfoData);
              console.log('Setting loading to false - success path');
              setLoading(false);
            } else {
              // User not authenticated, redirect to sign-in
              console.log('User not authenticated, redirecting to sign-in');
              setLoading(false);
              router.push('/sign-in?redirect=/profile');
              return;
            }
          } else {
            console.error('UserInfo API request failed:', userInfoResponse.status, userInfoResponse.statusText);
            // Fall back to mock data if API fails
            const mockUserData: UserData = {
              id: data.sessionId || 'unknown',
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
          }
        } catch (userInfoError) {
          console.error('Error fetching user info from API:', userInfoError);
          // Fall back to mock data if API call fails
          const mockUserData: UserData = {
            id: data.sessionId || 'unknown',
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
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setLoading(false);
        router.push('/sign-in?redirect=/profile');
      }
    };

    checkSession();
    
    // Cleanup timeout on unmount
    return () => {
      clearTimeout(timeoutId);
    };
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

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/signout', { method: 'POST' });
      const data = await response.json();
      console.log('Profile sign out result:', data);
      if (data.success) {
        console.log('Successfully signed out from profile page');
        router.push('/');
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  console.log('Profile render - loading:', loading, 'userData:', !!userData);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#ffcb74] border-t-transparent mx-auto"></div>
          <div className="mt-4 text-[#666666]">Loading profile...</div>
          <Button 
            onClick={() => {
              console.log('Manual loading stop clicked');
              setLoading(false);
            }} 
            className="mt-4 bg-[#ffcb74] text-[#111111]"
          >
            Stop Loading
          </Button>
        </div>
      </div>
    );
  }

  if (!userData) {
    console.log('No user data, showing fallback');
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#666666] mb-4">Unable to load profile data</div>
          <Button onClick={() => window.location.reload()} className="bg-[#ffcb74] text-[#111111]">
            Retry
          </Button>
        </div>
      </div>
    );
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

                     
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="province" className="text-[#111111] text-sm font-medium">
                          Province
                        </Label>
                        {isEditing ? (
                          <Popover open={openProvince} onOpenChange={setOpenProvince}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openProvince}
                                disabled={locationDataLoading}
                                className="w-full justify-between bg-white border-[#e5e5e5] text-[#111111] focus:border-[#ffcb74] focus:ring-1 focus:ring-[#ffcb74] disabled:opacity-50"
                              >
                                {locationDataLoading 
                                  ? "Loading provinces..." 
                                  : editForm.province
                                    ? provinces.find((province) => province.name === editForm.province)?.name
                                    : "Select province..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Search province..." />
                                <CommandList>
                                  <CommandEmpty>
                                    {locationDataLoading ? "Loading provinces..." : "No province found."}
                                  </CommandEmpty>
                                  {!locationDataLoading && (
                                    <CommandGroup>
                                      {provinces.map((province) => (
                                        <CommandItem
                                          key={province.id}
                                          value={province.name}
                                          onSelect={(currentValue) => {
                                            setEditForm(prev => ({ ...prev, province: currentValue }));
                                            setOpenProvince(false);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              editForm.province === province.name ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                          {province.name}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  )}
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <div className="flex items-center gap-2 py-2">
                            <MapPin className="w-4 h-4 text-[#ffcb74]" />
                            <span className="text-[#666666]">{userData.province || 'Not provided'}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="city" className="text-[#111111] text-sm font-medium">
                          City
                        </Label>
                        {isEditing ? (
                          <Popover open={openCity} onOpenChange={setOpenCity}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openCity}
                                disabled={locationDataLoading}
                                className="w-full justify-between bg-white border-[#e5e5e5] text-[#111111] focus:border-[#ffcb74] focus:ring-1 focus:ring-[#ffcb74] disabled:opacity-50"
                              >
                                {locationDataLoading 
                                  ? "Loading cities..." 
                                  : editForm.city
                                    ? cities.find((city) => city.name === editForm.city)?.name
                                    : "Select city..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Search city..." />
                                <CommandList>
                                  <CommandEmpty>
                                    {locationDataLoading ? "Loading cities..." : "No city found."}
                                  </CommandEmpty>
                                  {!locationDataLoading && (
                                    <CommandGroup>
                                      {cities.map((city) => (
                                        <CommandItem
                                          key={city.id}
                                          value={city.name}
                                          onSelect={(currentValue) => {
                                            setEditForm(prev => ({ ...prev, city: currentValue }));
                                            setOpenCity(false);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              editForm.city === city.name ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                          {city.name}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  )}
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <div className="flex items-center gap-2 py-2">
                            <MapPin className="w-4 h-4 text-[#ffcb74]" />
                            <span className="text-[#666666]">{userData.city || 'Not provided'}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="postalCode" className="text-[#111111] text-sm font-medium">
                          Postal Code
                        </Label>
                        {isEditing ? (
                          <Input
                            id="postalCode"
                            value={editForm.postalCode || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, postalCode: e.target.value }))}
                            placeholder="A1A 1A1"
                            className="bg-white border-[#e5e5e5] text-[#111111] focus:border-[#ffcb74] focus:ring-1 focus:ring-[#ffcb74]"
                          />
                        ) : (
                          <div className="flex items-center gap-2 py-2">
                            <MapPin className="w-4 h-4 text-[#ffcb74]" />
                            <span className="text-[#666666]">{userData.postalCode || 'Not provided'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="address" className="text-[#111111] text-sm font-medium">
                        Street Address
                      </Label>
                      {isEditing ? (
                        <Input
                          id="address"
                          value={editForm.address || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="123 Main Street"
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