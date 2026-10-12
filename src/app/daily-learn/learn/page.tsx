import DailyLearnPage from "@/pages/DailyLearnPage";
import RequireAuth from "@/components/RequireAuth";

export default function DailyLearn() {
  return <RequireAuth><DailyLearnPage /></RequireAuth>;
}
