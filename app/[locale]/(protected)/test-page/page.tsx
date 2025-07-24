import k10Test from '@/components/TestsQuestionnarie/consts/tests-questionnaire/k10'
// import stressTest from '@/components/TestsQuestionnarie/consts/tests-questionnaire/stress-level'
import TestPageGenerator from '@/components/TestsQuestionnarie/TestPageGenerator'

export default async function testPage() {
  return (
    <div>
      {/* передається конкретний тест */}
      <TestPageGenerator test={k10Test} />
    </div>
  )
}
