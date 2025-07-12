# KAIDENZ Clothing – Next.js E-commerce UI


<img width="1904" height="977" alt="image" src="https://github.com/user-attachments/assets/b3788328-7ea6-4855-962f-2e072a8bb0b9" />



A modern, fully responsive e-commerce UI built with **Next.js 15**, **React 19**, and **Tailwind CSS 4**.  
Features a beautiful hero section, mobile-friendly navigation with a dark-themed sheet menu, and reusable UI components.

---

## ✨ Features

- Responsive design for all screen sizes
- Mobile navigation with a dark sheet menu
- Modern hero section and featured products
- Reusable UI components (Button, Card, Sheet, Dropdown, etc.)
- TypeScript, ESLint, and strict code quality
- Easy customization and extension

---

## 🚀 Getting Started

### 1. **Clone the repository**

```bash
git clone <your-repo-url>
cd wcd_viva
```

### 2. **Install dependencies**

```bash
npm install
# or
yarn install
```

### 3. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🛠️ Project Structure

```
app/            # Next.js app directory (pages, layout, styles)
  globals.css   # Tailwind and global styles
  page.tsx      # Main landing page (hero, featured products)
  login/        # Login page
  signup/       # Signup page

components/     # React components
  ui/           # Reusable UI components (Button, Card, Sheet, Navbar, etc.)
  featured-product.tsx
  login-form.tsx
  signup-form.tsx

lib/            # Utility functions

public/         # Static assets (images, icons, etc.)
```

---

## 🧩 Custom Components

- **Navbar**: Responsive, with dropdowns and a mobile sheet menu
- **Sheet**: Custom side drawer for mobile navigation
- **Button, Card, DropdownMenu, Input, Label, ThemeToggle**: Reusable and styled

---

## 🖌️ Styling

- **Tailwind CSS 4** for utility-first styling
- Custom colors and fonts set in `app/globals.css`
- Animations via `tw-animate-css` and `framer-motion`

---

## 🧑‍💻 Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run lint` – Lint code with ESLint

---

## ⚙️ Configuration

- **TypeScript**: Strict mode enabled (`tsconfig.json`)
- **ESLint**: Next.js and TypeScript rules (`eslint.config.mjs`)
- **PostCSS**: Tailwind plugin (`postcss.config.mjs`)
- **Alias**: Use `@/` for root imports

---

## 📦 Dependencies

- `next`, `react`, `react-dom`
- `tailwindcss`, `tw-animate-css`
- `@radix-ui/react-*` (Sheet, DropdownMenu, etc.)
- `framer-motion`, `lucide-react`, `class-variance-authority`, `clsx`

---

## 🖼️ Assets

All images and icons are in the `public/` directory.  
You can replace them with your own branding as needed.

---

## 📄 License

This project is for educational/demo purposes.  
Feel free to use, modify, and extend for your own needs!

---
