# Kaidenz Clothing Store - Backend Implementation

This directory contains the backend implementation for the Kaidenz Clothing Store, including the AddToCart servlet and related components.

## Project Structure

```
backend/
├── AddToCart.java              # Main AddToCart servlet
├── TestAddToCart.java          # Test servlet for debugging
├── HibernateUtil.java          # Hibernate utility class
├── web.xml                     # Web application configuration
├── hibernate.cfg.xml           # Hibernate database configuration
├── README.md                   # This file
└── entities/                   # Entity classes (should be in your main project)
    ├── User.java
    ├── Product.java
    ├── Cart.java
    ├── Color.java
    └── Category.java
```

## Prerequisites

1. **Java Development Kit (JDK) 8 or higher**
2. **Apache Tomcat 9.x or 10.x**
3. **MySQL Database Server**
4. **Hibernate 5.x or 6.x**
5. **Gson library for JSON processing**

## Required Dependencies

Add these dependencies to your project:

### Maven (pom.xml)
```xml
<dependencies>
    <!-- Hibernate Core -->
    <dependency>
        <groupId>org.hibernate</groupId>
        <artifactId>hibernate-core</artifactId>
        <version>5.6.15.Final</version>
    </dependency>
    
    <!-- MySQL Connector -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.33</version>
    </dependency>
    
    <!-- Gson for JSON processing -->
    <dependency>
        <groupId>com.google.code.gson</groupId>
        <artifactId>gson</artifactId>
        <version>2.10.1</version>
    </dependency>
    
    <!-- Servlet API -->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>4.0.1</version>
        <scope>provided</scope>
    </dependency>
    
    <!-- C3P0 Connection Pool -->
    <dependency>
        <groupId>com.mchange</groupId>
        <artifactId>c3p0</artifactId>
        <version>0.9.5.5</version>
    </dependency>
</dependencies>
```

### Gradle (build.gradle)
```gradle
dependencies {
    implementation 'org.hibernate:hibernate-core:5.6.15.Final'
    implementation 'mysql:mysql-connector-java:8.0.33'
    implementation 'com.google.code.gson:gson:2.10.1'
    providedCompile 'javax.servlet:javax.servlet-api:4.0.1'
    implementation 'com.mchange:c3p0:0.9.5.5'
}
```

## Database Setup

1. **Create MySQL Database:**
```sql
CREATE DATABASE kaidenz_db;
USE kaidenz_db;
```

2. **Create Required Tables:**
```sql
-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    address TEXT,
    verification_required BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active'
);

-- Categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    qty INT DEFAULT 0,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Colors table
CREATE TABLE color (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);

-- Cart table
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    qty INT NOT NULL DEFAULT 1,
    users_id INT,
    products_id INT,
    color_id INT,
    FOREIGN KEY (users_id) REFERENCES users(id),
    FOREIGN KEY (products_id) REFERENCES products(id),
    FOREIGN KEY (color_id) REFERENCES color(id)
);
```

3. **Insert Sample Data:**
```sql
-- Insert default color
INSERT INTO color (name) VALUES ('Default');

-- Insert sample categories
INSERT INTO categories (name) VALUES ('Men'), ('Women'), ('Accessories');

-- Insert sample products
INSERT INTO products (name, description, price, qty, category_id) VALUES
('Classic White T-Shirt', 'Premium cotton, relaxed fit', 19.99, 50, 1),
('Denim Jacket', 'Timeless style, durable denim', 49.99, 30, 1),
('Summer Floral Dress', 'Lightweight, breezy design', 39.99, 25, 2),
('Comfy Joggers', 'Soft fabric, tapered fit', 29.99, 40, 1);
```

## Configuration

1. **Update Database Connection:**
   - Edit `hibernate.cfg.xml`
   - Update username, password, and database URL as needed

2. **Deploy to Tomcat:**
   - Copy all files to your Tomcat webapps directory
   - Ensure the context path is `/kaidenz`

## Hibernate Implementation

The backend uses a simplified Hibernate approach with `HibernateUtil`:

### HibernateUtil.java
```java
public class HibernateUtil {
    private static SessionFactory sessionFactory;
    
    static {
        try {
            Configuration configuration = new Configuration().configure();
            sessionFactory = configuration.buildSessionFactory();
        } catch (Exception e) {
            throw new ExceptionInInitializerError(e);
        }
    }
    
    public static SessionFactory getSessionFactory() {
        return sessionFactory;
    }
}
```

### Simplified Database Operations
```java
// Get session factory
SessionFactory sf = HibernateUtil.getSessionFactory();
Session s = sf.openSession();

// Perform operations
s.save(entity);
s.beginTransaction().commit();
s.close();
```

## API Endpoints

### AddToCart Servlet
- **URL:** `POST /kaidenz/AddToCart`
- **Content-Type:** `application/json`
- **Request Body:**
```json
{
    "productId": 1,
    "quantity": 1,
    "colorId": 1
}
```
- **Response:**
```json
{
    "success": true,
    "message": "Product added to cart successfully",
    "productId": 1,
    "quantity": 1,
    "colorId": 1,
    "userId": 1
}
```

### TestAddToCart Servlet
- **URL:** `GET /kaidenz/TestAddToCart`
- **Purpose:** Test the AddToCart functionality via web interface

## Testing

1. **Start Tomcat Server**
2. **Access Test Page:** `http://localhost:8080/kaidenz/TestAddToCart`
3. **Test API Directly:** Use Postman or curl to test the AddToCart endpoint

### Curl Example:
```bash
curl -X POST http://localhost:8080/kaidenz/AddToCart \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=your-session-id" \
  -d '{
    "productId": 1,
    "quantity": 2,
    "colorId": 1
  }'
```

## Troubleshooting

### Common Issues:

1. **Hibernate Configuration Error:**
   - Check database connection settings
   - Verify MySQL server is running
   - Ensure database and tables exist

2. **Session Issues:**
   - Make sure user is logged in
   - Check session timeout settings
   - Verify session attributes are set correctly

3. **CORS Issues:**
   - Ensure CORS headers are set correctly
   - Check if frontend URL matches CORS configuration

4. **Entity Mapping Errors:**
   - Verify all entity classes are mapped in hibernate.cfg.xml
   - Check entity annotations are correct

### Debug Mode:
The servlet includes extensive logging. Check Tomcat logs for detailed information:
```bash
tail -f $TOMCAT_HOME/logs/catalina.out
```

## Security Considerations

1. **Input Validation:** Always validate input parameters
2. **SQL Injection:** Use Hibernate parameterized queries
3. **Session Security:** Implement proper session management
4. **CORS:** Configure CORS headers appropriately for production

## Production Deployment

1. **Database:** Use connection pooling for better performance
2. **Logging:** Configure proper logging levels
3. **Security:** Implement HTTPS and secure session management
4. **Monitoring:** Add health checks and monitoring endpoints 