export const metadata = {
  title: 'Fraud Detection System',
  description: 'Automated Fraud Detection & Behavioral Transaction Audit System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}