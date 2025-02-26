import Link from "next/link"
import { Button } from "@/components/ui/button"

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          OVERTIMESTAFF
        </Link>
        <div className="space-x-4">
          <Link href="/find-shifts" className="text-gray-600 hover:text-primary">
            Find Shifts
          </Link>
          <Link href="/find-staff" className="text-gray-600 hover:text-primary">
            Find Staff
          </Link>
          <Button variant="outline" className="mr-2">
            Log in
          </Button>
          <Button>Sign up</Button>
        </div>
      </nav>
    </header>
  )
}

export default Header

