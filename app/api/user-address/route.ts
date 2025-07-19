import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Forward cookies from the incoming request
    const cookieHeader = request.headers.get('cookie');
    console.log("=== USER ADDRESS DEBUG ===");
    console.log("Incoming cookies:", cookieHeader);

    // First, get user info to check authentication
    const userInfoResponse = await fetch('http://localhost:8080/kaidenz/UserInfo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      credentials: 'include',
    });

    if (!userInfoResponse.ok) {
      console.error('Backend UserInfo API failed:', userInfoResponse.status, userInfoResponse.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch user info from backend' },
        { status: userInfoResponse.status }
      );
    }

    const userData = await userInfoResponse.json();
    console.log('UserInfo API response:', userData);

    // Check if the user is authenticated
    if (userData.authenticated === true) {
      // Try to fetch address data from UpdateAddress servlet's GET method
      try {
        const addressResponse = await fetch('http://localhost:8080/kaidenz/UpdateAddress', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(cookieHeader && { Cookie: cookieHeader }),
          },
          credentials: 'include',
        });

        if (addressResponse.ok) {
          const addressData = await addressResponse.json();
          console.log('Address data from UpdateAddress servlet:', addressData);
          
          if (addressData.status === 'success' && addressData.address) {
            return NextResponse.json({
              status: 'success',
              address: addressData.address,
              authenticated: true
            });
          } else {
            console.log('No address data in response, using fallback');
            // Fallback to empty address data
            const fallbackAddressData = {
              line1: '',
              line2: '',
              postal_code: '',
              phone: '',
              city_name: '',
              province_name: '',
            };
            
            return NextResponse.json({
              status: 'success',
              address: fallbackAddressData,
              authenticated: true
            });
          }
        } else {
          console.log('UpdateAddress servlet not available, status:', addressResponse.status, addressResponse.statusText);
          const errorText = await addressResponse.text();
          console.log('Error response body:', errorText);
          
          // Fallback to empty address data
          const fallbackAddressData = {
            line1: '',
            line2: '',
            postal_code: '',
            phone: '',
            city_name: '',
            province_name: '',
          };
          
          return NextResponse.json({
            status: 'success',
            address: fallbackAddressData,
            authenticated: true
          });
        }
      } catch (addressError) {
        console.log('Error fetching address data, using fallback:', addressError);
        // Fallback to empty address data
        const fallbackAddressData = {
          line1: '',
          line2: '',
          postal_code: '',
          phone: '',
          city_name: '',
          province_name: '',
        };
        
        return NextResponse.json({
          status: 'success',
          address: fallbackAddressData,
          authenticated: true
        });
      }
    } else {
      return NextResponse.json(
        { error: 'User not authenticated', authenticated: false },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error in user-address API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 