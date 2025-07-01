import { useParams } from "react-router-dom";
import ScanningDashboard from "@/components/ScanningDashboard";

export default function AdvancedScan() {
  const { scanId } = useParams<{ scanId: string }>();

  return <ScanningDashboard scanId={scanId} />;
}
