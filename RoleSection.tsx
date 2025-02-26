import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Role {
  title: string
  description: string
  icon: string
  ctaText: string
  ctaLink: string
}

interface RoleSectionProps {
  roles: Role[]
}

const RoleSection: React.FC<RoleSectionProps> = ({ roles }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Role</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className={`fas ${role.icon} text-primary mr-2`}></i>
                  {role.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{role.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a href={role.ctaLink}>{role.ctaText}</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RoleSection

