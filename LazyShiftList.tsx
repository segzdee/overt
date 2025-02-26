import dynamic from "next/dynamic"
import { Suspense } from "react"

const ShiftList = dynamic(() => import("./ShiftList"), {
  loading: () => <p>Loading shifts...</p>,
  ssr: false,
})

export function LazyShiftList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShiftList />
    </Suspense>
  )
}

