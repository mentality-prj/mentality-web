import { Sparkles } from 'lucide-react'

const company = { name: 'Mentality', logo: <Sparkles /> }

const Logo = () => (
  <div className="flex items-center gap-2">
    {company.logo}
    <div className="flex flex-col gap-4">
      <span className="text-default-900 whitespace-nowrap text-xl font-medium">{company.name}</span>
    </div>
  </div>
)

export default Logo
