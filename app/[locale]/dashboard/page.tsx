import { BlogCard } from '@/components/Dashboard/BlogCard'
import { DailyCard } from '@/components/Dashboard/DailyCard'
import { mockDashboardBlogData, mockDashboardDailyData } from '@/REST/mockApi'

export default async function Dashboard() {
  const dailyData = await mockDashboardDailyData()
  const blogData = await mockDashboardBlogData()
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-6">
        {dailyData.map(({ type, textContent }, id) => (
          <DailyCard key={id} textContent={textContent} type={type} />
        ))}
      </div>
      <div className="flex gap-4">
        {blogData.map(({ title, textContent, image }, id) => (
          <BlogCard key={id} title={title} image={image} textContent={textContent} />
        ))}
      </div>
    </div>
  )
}
