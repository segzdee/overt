import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">OVERTIMESTAFF</h3>
            <p className="text-sm">Connecting hospitality talent with opportunities.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">For Staff</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/staff/register" className="hover:text-primary">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/find-shifts" className="hover:text-primary">
                  Find Shifts
                </Link>
              </li>
              <li>
                <Link href="/staff/faq" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">For Businesses</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/business/register" className="hover:text-primary">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/post-job" className="hover:text-primary">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/business/pricing" className="hover:text-primary">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} OVERTIMESTAFF. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

