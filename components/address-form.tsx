'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, MapPin, Phone, Save, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AddressFormProps {
  onSave: (addressData: AddressData) => Promise<void>;
  onCancel: () => void;
  initialData?: AddressData;
  provinces: Array<{ id: string; name: string }>;
  cities: Array<{ id: string; name: string }>;
  loading?: boolean;
}

export interface AddressData {
  line1: string;
  line2?: string;
  postal_code: string;
  phone: string;
  city_name: string;
  province_name: string;
}

export default function AddressForm({ 
  onSave, 
  onCancel, 
  initialData, 
  provinces, 
  cities, 
  loading = false 
}: AddressFormProps) {
  const [formData, setFormData] = useState<AddressData>({
    line1: initialData?.line1 || '',
    line2: initialData?.line2 || '',
    postal_code: initialData?.postal_code || '',
    phone: initialData?.phone || '',
    city_name: initialData?.city_name || '',
    province_name: initialData?.province_name || '',
  });

  const [openProvince, setOpenProvince] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [filteredCities, setFilteredCities] = useState(cities);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedData, setLastSavedData] = useState<AddressData | null>(initialData || null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Validation functions
  const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
    return cleanPhone.length === 10;
  };

  const validateForm = (data: AddressData): {isValid: boolean, errors: {[key: string]: string}} => {
    const errors: {[key: string]: string} = {};

    // Required field validations
    if (!data.line1.trim()) {
      errors.line1 = 'Address Line 1 is required';
    }

    if (!data.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(data.phone)) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }

    if (!data.city_name.trim()) {
      errors.city_name = 'City is required';
    }

    if (!data.province_name.trim()) {
      errors.province_name = 'Province is required';
    }

    if (!data.postal_code.trim()) {
      errors.postal_code = 'Postal code is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  // Filter cities based on selected province
  useEffect(() => {
    if (formData.province_name) {
      // For now, show all cities since we don't have province filtering
      setFilteredCities(cities);
    } else {
      setFilteredCities([]);
    }
  }, [formData.province_name, cities]);

  // Debounced auto-save function
  const debouncedAutoSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (data: AddressData) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const validation = validateForm(data);
          if (validation.isValid) {
            setAutoSaveStatus('saving');
            onSave(data).then(() => {
              setAutoSaveStatus('saved');
              setLastSavedData(data);
              setValidationErrors({});
              setTimeout(() => setAutoSaveStatus('idle'), 2000);
            }).catch(() => {
              setAutoSaveStatus('error');
              setTimeout(() => setAutoSaveStatus('idle'), 3000);
            });
          } else {
            setValidationErrors(validation.errors);
            // Show toast for validation errors
            const errorMessages = Object.values(validation.errors);
            if (errorMessages.length > 0) {
              toast.error(`Please fix the following errors: ${errorMessages.join(', ')}`);
            }
          }
        }, 1000); // 1 second delay
      };
    })(),
    [onSave]
  );

  // Auto-save when form data changes
  useEffect(() => {
    if (JSON.stringify(formData) !== JSON.stringify(lastSavedData)) {
      debouncedAutoSave(formData);
    }
  }, [formData, lastSavedData, debouncedAutoSave]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const validation = validateForm(formData);
    if (validation.isValid) {
      setAutoSaveStatus('saving');
      try {
        await onSave(formData);
        setAutoSaveStatus('saved');
        setLastSavedData(formData);
        setValidationErrors({});
        toast.success('Address saved successfully!');
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      } catch (error) {
        setAutoSaveStatus('error');
        toast.error('Failed to save address. Please try again.');
        setTimeout(() => setAutoSaveStatus('idle'), 3000);
      }
    } else {
      setValidationErrors(validation.errors);
      const errorMessages = Object.values(validation.errors);
      toast.error(`Please fix the following errors: ${errorMessages.join(', ')}`);
    }
  };

  const handleDone = async () => {
    // If there are unsaved changes, save them first
    if (JSON.stringify(formData) !== JSON.stringify(lastSavedData)) {
      const validation = validateForm(formData);
      if (validation.isValid) {
        setAutoSaveStatus('saving');
        try {
          await onSave(formData);
          setAutoSaveStatus('saved');
          setLastSavedData(formData);
          setValidationErrors({});
          toast.success('Address saved successfully!');
          // Wait a moment to show "Saved" status, then close
          setTimeout(() => {
            onCancel();
          }, 500);
        } catch (error) {
          setAutoSaveStatus('error');
          toast.error('Failed to save address. Please try again.');
          setTimeout(() => setAutoSaveStatus('idle'), 3000);
        }
      } else {
        setValidationErrors(validation.errors);
        const errorMessages = Object.values(validation.errors);
        toast.error(`Please fix the following errors: ${errorMessages.join(', ')}`);
      }
    } else {
      // No changes, just close
      onCancel();
    }
  };

  const getProvinceName = (name: string) => {
    return name || 'Select province...';
  };

  const getCityName = (name: string) => {
    return name || 'Select city...';
  };

  const getStatusIcon = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />;
      case 'saved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      case 'error':
        return 'Save failed';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Information
          </div>
          {autoSaveStatus !== 'idle' && (
            <div className="flex items-center gap-2 text-sm">
              {getStatusIcon()}
              <span className={cn(
                "text-sm",
                autoSaveStatus === 'saving' && "text-blue-600",
                autoSaveStatus === 'saved' && "text-green-600",
                autoSaveStatus === 'error' && "text-red-600"
              )}>
                {getStatusText()}
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Address Line 1 */}
          <div className="space-y-2">
            <Label htmlFor="line1">Address Line 1 *</Label>
            <Input
              id="line1"
              value={formData.line1}
              onChange={(e) => setFormData(prev => ({ ...prev, line1: e.target.value }))}
              placeholder="Street address, P.O. box, company name"
              required
              className={validationErrors.line1 ? "border-red-500" : ""}
            />
            {validationErrors.line1 && (
              <p className="text-sm text-red-500">{validationErrors.line1}</p>
            )}
          </div>

          {/* Address Line 2 */}
          <div className="space-y-2">
            <Label htmlFor="line2">Address Line 2</Label>
            <Input
              id="line2"
              value={formData.line2}
              onChange={(e) => setFormData(prev => ({ ...prev, line2: e.target.value }))}
              placeholder="Apartment, suite, unit, building, floor, etc."
            />
          </div>

          {/* Province Selection */}
          <div className="space-y-2">
            <Label>Province *</Label>
            <Popover open={openProvince} onOpenChange={setOpenProvince}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openProvince}
                  className={cn("w-full justify-between", validationErrors.province_name && "border-red-500")}
                >
                  {getProvinceName(formData.province_name)}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search province..." />
                  <CommandList>
                    <CommandEmpty>No province found.</CommandEmpty>
                    <CommandGroup>
                      {provinces.map((province) => (
                        <CommandItem
                          key={province.id}
                          value={province.name}
                          onSelect={() => {
                            setFormData(prev => ({ 
                              ...prev, 
                              province_name: province.name,
                              city_name: '' // Reset city when province changes
                            }));
                            setOpenProvince(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.province_name === province.name ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {province.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {validationErrors.province_name && (
              <p className="text-sm text-red-500">{validationErrors.province_name}</p>
            )}
          </div>

          {/* City Selection */}
          <div className="space-y-2">
            <Label>City *</Label>
            <Popover open={openCity} onOpenChange={setOpenCity}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCity}
                  className={cn("w-full justify-between", validationErrors.city_name && "border-red-500")}
                  disabled={!formData.province_name}
                >
                                      {getCityName(formData.city_name)}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search city..." />
                  <CommandList>
                    <CommandEmpty>No city found.</CommandEmpty>
                    <CommandGroup>
                      {filteredCities.map((city) => (
                        <CommandItem
                          key={city.id}
                          value={city.name}
                          onSelect={() => {
                            setFormData(prev => ({ ...prev, city_name: city.name }));
                            setOpenCity(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.city_name === city.name ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {city.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {validationErrors.city_name && (
              <p className="text-sm text-red-500">{validationErrors.city_name}</p>
            )}
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <Label htmlFor="postal_code">Postal Code *</Label>
            <Input
              id="postal_code"
              value={formData.postal_code}
              onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
              placeholder="12345"
              required
              className={validationErrors.postal_code ? "border-red-500" : ""}
            />
            {validationErrors.postal_code && (
              <p className="text-sm text-red-500">{validationErrors.postal_code}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number * (10 digits)
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => {
                // Only allow digits and common phone formatting characters
                const value = e.target.value.replace(/[^\d\s\(\)\-\+]/g, '');
                setFormData(prev => ({ ...prev, phone: value }));
              }}
              placeholder="+1 (555) 123-4567"
              required
              className={validationErrors.phone ? "border-red-500" : ""}
            />
            {validationErrors.phone && (
              <p className="text-sm text-red-500">{validationErrors.phone}</p>
            )}
            <p className="text-xs text-gray-500">
              Enter exactly 10 digits (e.g., 5551234567 or +1 (555) 123-4567)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={autoSaveStatus === 'saving'}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Now
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleDone}
              disabled={autoSaveStatus === 'saving'}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Done
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 