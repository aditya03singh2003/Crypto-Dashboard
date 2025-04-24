import DashboardClient from "./dashboard-client"

// This function generates static params for this page at build time
export function generateStaticParams() {
  return [{}] // Generate a single static instance of this page
}

export default function Page() {
  return <DashboardClient />
}
