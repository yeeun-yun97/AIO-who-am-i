import './globals.css';

// Root layout - only provides global CSS
// The html/body tags are in [locale]/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
