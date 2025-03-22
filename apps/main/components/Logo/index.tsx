import { AcmeIcon } from '../ui/icons/acme-icon'

const company = { name: 'Mentality', logo: <AcmeIcon /> }

const Logo = () => (
  <div className="flex items-center gap-2">
    {company.logo}
    <div className="flex flex-col gap-4">
      <span className="whitespace-nowrap text-xl font-medium text-default-900">{company.name}</span>
    </div>
  </div>
)

export default Logo
