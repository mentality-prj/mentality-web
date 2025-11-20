'use client'

export const FilteredList = () =>
  // { items }: FilteredHistoryProps
  {
    // const { sort: SortOrder } = useContext(SortContext)
    // const { filter } = useContext(FilterContext)
    // const getSortedItems = () => {
    //   if (filter) {
    //     items = items.filter((item) => item.type === filter)
    //   }
    //   return [...items].sort((a, b) => {
    //     const timeA = new Date(a.createdAt).getTime()
    //     const timeB = new Date(b.createdAt).getTime()

    //     return SortOrder === 'newest' ? timeB - timeA : timeA - timeB
    //   })
    // }
    return (
      <div className="flex flex-col gap-6">
        {/*TODO:replace with CustomCard {getSortedItems().map((item) => (
        <DailyCard key={item.id} variant="previous" {...item} />
      ))} */}
      </div>
    )
  }
