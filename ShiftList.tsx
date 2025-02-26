import { useFetch } from "../hooks/useFetch"
import { fetchShifts } from "../utils/api"

export function ShiftList() {
  const { data, isLoading, error } = useFetch("shifts", fetchShifts)

  if (isLoading) {
    return <div className="loading">Loading shifts...</div>
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>
  }

  if (!data || data.shifts.length === 0) {
    return <div className="empty">No shifts available.</div>
  }

  return (
    <ul>
      {data.shifts.map((shift) => (
        <li key={shift.id}>
          {shift.position} at {shift.company}
        </li>
      ))}
    </ul>
  )
}

