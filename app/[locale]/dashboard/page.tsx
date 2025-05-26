import { BlogCard } from '@/components/Dashboard/BlogCard'
import { DailyCard } from '@/components/Dashboard/DailyCard'
import { GreetingTitle } from '@/components/Dashboard/GreetingTitle'
import { mockDashboardBlogData, mockDashboardDailyData } from '@/REST/mockApi'

export default async function Dashboard() {
  const dailyData = await mockDashboardDailyData()
  const blogData = await mockDashboardBlogData()
  return (
    <div className="flex max-w-[1096px] flex-col gap-6">
      <div>
        <GreetingTitle />
      </div>
      <div className="flex gap-6">
        {dailyData.map(({ type, textContent }, id) => (
          <DailyCard key={id} textContent={textContent} type={type} />
        ))}
      </div>
      <div className="flex gap-4">
        {blogData.map(({ title, textContent }, id) => (
          <BlogCard key={id} title={title} textContent={textContent} />
        ))}
      </div>
    </div>
  )
}
