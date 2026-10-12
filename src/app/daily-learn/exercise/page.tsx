import ExercisePage from "@/pages/ExercisePage";
import RequireAuth from "@/components/RequireAuth";

export default function Exercise() {
  return <RequireAuth><ExercisePage /></RequireAuth>;
}
