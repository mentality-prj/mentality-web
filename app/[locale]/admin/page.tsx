'use client'
import { Calendar } from 'lucide-react'

import { DeleteIcon, EditIcon } from '@/components/Cards'
import Card from '@/components/Cards/Card'
import CustomCard from '@/ds/components/CustomCard'
import { CloudIcon } from '@/ds/icons/summary/cloud'

export default function AdminPage() {
  const editIcon = <EditIcon onClick={() => console.log('edit')} />
  const deleteIcon = <DeleteIcon onClick={() => console.log('delete')} />

  return (
    <div className="mb-8 grid grid-cols-5 gap-6">
      <Card
        icon={<Calendar size={12} />}
        title="Title 00"
        sup="25.12.2025"
        text="Lorem ipsum"
        remark="success"
        tools={[editIcon, deleteIcon]}
      />
      <Card
        type="success"
        icon={<Calendar size={12} />}
        sup="25.12.2025"
        text="Lorem ipsum"
        remark="success"
        tools={[editIcon, deleteIcon]}
      />
      <Card
        type="success"
        icon={<Calendar size={12} />}
        sup="25.12.2025"
        title="Title 01"
        text="Lorem ipsum"
        remark="success"
        tags={['tag one', 'tag two']}
      />
      <Card type="info" title="Title 02" text="Lorem ipsum" remark="info" tags={['tag one', 'tag two']} />
      <Card type="dark" title="Title 03" text="Lorem ipsum" remark="dark" />
      <Card type="warn" title="Title 04" text="Lorem ipsum" remark="warn" />
      <Card type="accent" title="Title 05" text="Lorem ipsum" remark="accent" />
      <Card type="error" title="Title 06" text="Lorem ipsum" remark="error" />
      <Card title="Title 07" text="Lorem ipsum" remark="accent-soft" className="bg-accent-soft" />
      <Card title="Title 08" text="Lorem ipsum" remark="accent-foreground" className="bg-accent-foreground" />

      <CustomCard
        icon={<CloudIcon />}
        title="custom card"
        text="custom card"
        textLink="click"
        hrefLink="/"
        variant="daily"
        date="2024-06-01"
        badge="affirmation"
        tagList={['one', 'two']}
      />
      <Card type="special" title="Special Card">
        some children here
      </Card>
    </div>
  )
}
