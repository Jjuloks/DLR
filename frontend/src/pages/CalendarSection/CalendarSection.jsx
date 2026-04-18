import { useStrapi } from "../../hooks/useStrapi";
import CalendarView from "../Calendar/Calendar"
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

export default function CalendarSection() {
  const { data, loading, error } = useStrapi('tasks');

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const rawData = Array.isArray(data) ? data : data?.data ?? [];

  const events = rawData.map((task) => {
    const dateStr = task.date;
    const dateEndStr = task.dateEnd;


    const start = new Date(`${dateStr}`);
    const end  = new Date(`${dateEndStr}`);

    return {
      id: task.id,
      title: task.title,
      start,
      end,
      priority: task.priority,
      description: task.descirption,
    };
  });



  return <CalendarView events={events} />;
}