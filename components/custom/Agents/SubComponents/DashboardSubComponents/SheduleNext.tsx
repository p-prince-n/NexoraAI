import { CalendarClock } from 'lucide-react'
import moment from 'moment';


type Props={
  agentName:string,
  time:string
}

const SheduleNext = ({agentName, time}:Props) => {
  
  return (
    <div className="flex items-center gap-3">
  <div className="flex items-center justify-center rounded-xl bg-purple-100 p-3 transition-colors duration-300 dark:bg-purple-950/50">
    <CalendarClock className="size-5 text-purple-700 transition-colors duration-300 dark:text-purple-300" />
  </div>

  <div className="flex flex-col items-start justify-center">
    <h1 className="line-clamp-1 font-serif text-base font-semibold text-gray-900 transition-colors duration-300 dark:text-purple-50">
      {agentName}
    </h1>

    <p className="text-sm text-gray-600 transition-colors duration-300 dark:text-purple-200/70">
      {moment(time).calendar()}
    </p>
  </div>
</div>
  )
}

export default SheduleNext