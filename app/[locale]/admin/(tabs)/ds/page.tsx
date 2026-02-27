'use client'
import { Calendar } from 'lucide-react'

import { ButtonShowcase } from '@/admin/ButtonShowcase'
import { TypographyShowcase } from '@/admin/TypographyShowcase'
import { DeleteIcon, EditIcon } from '@/components/shared/Cards'
import Card from '@/components/shared/Cards/Card'
import CardStack from '@/components/shared/Cards/CardStack'
import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

export default function AdminDsPage() {
  const editIcon = <EditIcon onClick={() => console.log('edit')} />
  const deleteIcon = <DeleteIcon onClick={() => console.log('delete')} />

  return (
    <>
      <div className="mb-8 grid gap-6 laptop:grid-cols-2">
        <Card type="ghost">
          <ButtonShowcase />
        </Card>
        <Card type="ghost">
          <TypographyShowcase />
        </Card>
      </div>

      <div className="mb-8 grid grid-cols-5 gap-default">
        <Card
          icon={<Calendar size={12} />}
          title="Title 00"
          sup="25.12.2025"
          text="Lorem ipsum"
          remark="default"
          tools={[editIcon, deleteIcon]}
          tags={['tag one', 'tag two']}
        />
        <Card
          type="ghost"
          icon={<Calendar size={12} />}
          title="Title 00"
          sup="25.12.2025"
          text="Lorem ipsum"
          remark="ghost"
          tools={[editIcon, deleteIcon]}
          tags={['tag one', 'tag two']}
        />
        <Card
          type="success"
          icon={<Calendar size={12} />}
          sup="25.12.2025"
          text={
            <>
              Text with link to&nbsp;
              <Link href={Routes.MYDAY} className="whitespace-nowrap underline">
                My day
              </Link>
              . Use it instead of an additional link.
            </>
          }
          remark="success"
          tools={[editIcon, deleteIcon]}
        />
        <Card
          type="success"
          icon={<Calendar size={12} />}
          sup="25.12.2025"
          title={
            <Link href={Routes.MYDAY} className="whitespace-nowrap underline">
              Title 01
            </Link>
          }
          text="Lorem ipsum"
          remark={
            <Link href={Routes.MYDAY} className="whitespace-nowrap underline">
              success
            </Link>
          }
          tags={['tag one', 'tag two']}
        />
        <Card type="info" title="Title 02" text="Lorem ipsum" remark="info" tags={['tag one', 'tag two']} />
        <Card type="dark" title="Title 03" text="Lorem ipsum" remark="dark" />
        <Card type="warn" title="Title 04" text="Lorem ipsum" remark="warn" />
        <Card type="accent" title="Title 05" text="Lorem ipsum" remark="accent" />
        <Card type="error" title="Title 06" text="Lorem ipsum" remark="error" />
        <Card type="support" title="Title 07" text="Lorem ipsum" remark="support" />
        <Card title="Title 08" text="Lorem ipsum" remark="accent-foreground" className="bg-accent-foreground" />
        <Card title="Title 09" text="Lorem ipsum" remark="accent-soft" className="bg-accent-soft" />

        <Card type="special" title="Special Card">
          some children here
        </Card>
        <Card type="joy" title="Joy Card" text="Lorem ipsum" remark="joy" />
      </div>

      <CardStack cols={3}>
        <Card
          icon={<Calendar size={12} />}
          title="Title 00"
          sup="25.12.2025"
          text="Lorem ipsum"
          remark="success"
          tools={[editIcon, deleteIcon]}
        />
        <Card
          icon={<Calendar size={12} />}
          title="Title 00"
          sup="25.12.2025"
          text="Lorem ipsum"
          remark="success"
          tools={[editIcon, deleteIcon]}
        />
        <Card
          icon={<Calendar size={12} />}
          title="Title 00"
          sup="25.12.2025"
          text="Lorem ipsum"
          remark="success"
          tools={[editIcon, deleteIcon]}
        />
      </CardStack>
    </>
  )
}
