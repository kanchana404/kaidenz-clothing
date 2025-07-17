# Java Backend Cookie Fix Guide

## The Problem
JSESSIONID cookies are not being stored in the browser when making cross-origin requests from Next.js to your Java backend.

## Common Causes & Solutions

### 1. CORS Configuration
Your Java backend needs to allow credentials and set proper CORS headers.

**Add this to your Java servlet:**
```java
// In your SignIn servlet
response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
response.setHeader("Access-Control-Allow-Headers", "Content-Type, Cookie");
```

### 2. Cookie Settings
Make sure your JSESSIONID cookie is set with proper attributes.

**In your Java servlet, after successful login:**
```java
// Set JSESSIONID cookie with proper attributes
Cookie jsessionCookie = new Cookie("JSESSIONID", session.getId());
jsessionCookie.setPath("/");
jsessionCookie.setHttpOnly(true);
jsessionCookie.setSecure(false); // Set to false for HTTP development
jsessionCookie.setMaxAge(3600); // 1 hour
response.addCookie(jsessionCookie);
```

### 3. Session Management
Ensure your session is created properly.

**In your SignIn servlet:**
```java
// Get or create session
HttpSession session = request.getSession(true);
session.setMaxInactiveInterval(3600); // 1 hour timeout

// Store user data in session
session.setAttribute("user", user);
session.setAttribute("user_id", user.getUserId());
session.setAttribute("user_email", user.getEmail());
// ... other user attributes
```

### 4. Complete SignIn Servlet Example
```java
@WebServlet("/SignIn")
public class SignInServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Set CORS headers
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Cookie");
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        PrintWriter out = response.getWriter();
        Gson gson = new Gson();
        JsonObject jsonResponse = new JsonObject();
        
        try {
            // Parse request body
            BufferedReader reader = request.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            
            JsonObject requestData = gson.fromJson(sb.toString(), JsonObject.class);
            String email = requestData.get("email").getAsString();
            String password = requestData.get("password").getAsString();
            
            // Your authentication logic here
            // ... validate user credentials ...
            
            if (/* authentication successful */) {
                // Create session
                HttpSession session = request.getSession(true);
                session.setMaxInactiveInterval(3600);
                
                // Store user data in session
                session.setAttribute("user", user);
                session.setAttribute("user_id", user.getUserId());
                session.setAttribute("user_email", user.getEmail());
                session.setAttribute("user_first_name", user.getFirstName());
                session.setAttribute("user_last_name", user.getLastName());
                
                // Set JSESSIONID cookie explicitly
                Cookie jsessionCookie = new Cookie("JSESSIONID", session.getId());
                jsessionCookie.setPath("/");
                jsessionCookie.setHttpOnly(true);
                jsessionCookie.setSecure(false); // false for HTTP development
                jsessionCookie.setMaxAge(3600);
                response.addCookie(jsessionCookie);
                
                // Return success response
                jsonResponse.addProperty("status", true);
                jsonResponse.addProperty("user_id", user.getUserId());
                jsonResponse.addProperty("email", user.getEmail());
                jsonResponse.addProperty("first_name", user.getFirstName());
                jsonResponse.addProperty("last_name", user.getLastName());
                jsonResponse.addProperty("verification_required", false);
                
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                jsonResponse.addProperty("status", false);
                jsonResponse.addProperty("message", "Invalid credentials");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }
            
        } catch (Exception e) {
            jsonResponse.addProperty("status", false);
            jsonResponse.addProperty("message", "Server error: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
        
        out.print(gson.toJson(jsonResponse));
        out.flush();
    }
    
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Handle CORS preflight
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Cookie");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
```

### 5. Testing Steps

1. **Start your Java backend** on `localhost:8080`
2. **Start your Next.js frontend** on `localhost:3000`
3. **Go to** `http://localhost:3000/test-cookies`
4. **Click "Test Signin"** and check the console logs
5. **Check the cookies** displayed on the page

### 6. Debugging Tips

**Check browser developer tools:**
- Open DevTools → Application → Cookies
- Look for JSESSIONID cookie
- Check if it has the correct domain and path

**Check network tab:**
- Look at the request to `/api/signin`
- Check if cookies are being sent
- Check the response headers for Set-Cookie

**Check Java logs:**
- Add logging to see if session is created
- Check if JSESSIONID is being set

### 7. Common Issues

1. **"SameSite" policy**: Modern browsers block cross-site cookies
2. **Domain mismatch**: Cookie domain doesn't match request domain
3. **Missing CORS headers**: Backend doesn't allow credentials
4. **Session not created**: Session creation fails silently

### 8. Alternative Approach

If JSESSIONID still doesn't work, you can use a custom session token:

```java
// Instead of relying on JSESSIONID, create a custom token
String sessionToken = UUID.randomUUID().toString();
session.setAttribute("session_token", sessionToken);

// Set custom session cookie
Cookie sessionCookie = new Cookie("session_token", sessionToken);
sessionCookie.setPath("/");
sessionCookie.setHttpOnly(true);
sessionCookie.setSecure(false);
sessionCookie.setMaxAge(3600);
response.addCookie(sessionCookie);
```

Then update your Next.js code to use `session_token` instead of `JSESSIONID`. 