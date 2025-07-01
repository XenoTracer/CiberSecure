import Navigation from "@/components/Navigation";
import DashboardCard from "@/components/DashboardCard";
import { FileText, Download, Calendar, BarChart3 } from "lucide-react";

export default function Reports() {
  return (
    <div className="min-h-screen bg-cyber-dark-bg">
      <Navigation />

      <main className="lg:pl-72">
        <div className="px-4 py-8 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Reports</h1>
            <p className="mt-2 text-muted-foreground">
              Generate and access detailed security reports and analytics
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard
              title="Generated Reports"
              icon={<FileText className="h-5 w-5" />}
            >
              <div className="text-center py-8">
                <div className="text-2xl font-bold text-cyber-blue mb-2">
                  127
                </div>
                <div className="text-muted-foreground">Reports this month</div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Downloads"
              icon={<Download className="h-5 w-5" />}
            >
              <div className="text-center py-8">
                <div className="text-2xl font-bold text-green-500 mb-2">89</div>
                <div className="text-muted-foreground">
                  Successful downloads
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Scheduled Reports"
              icon={<Calendar className="h-5 w-5" />}
            >
              <div className="text-center py-8">
                <div className="text-2xl font-bold text-cyber-blue mb-2">
                  15
                </div>
                <div className="text-muted-foreground">Automated reports</div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Report Types"
              icon={<BarChart3 className="h-5 w-5" />}
            >
              <div className="text-center py-8">
                <div className="text-2xl font-bold text-foreground mb-2">8</div>
                <div className="text-muted-foreground">Available formats</div>
              </div>
            </DashboardCard>
          </div>

          <div className="mt-8">
            <DashboardCard title="Report Generation">
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 text-cyber-blue" />
                <p>
                  Report generation and management tools will be implemented
                  here.
                </p>
                <p className="text-sm mt-2">
                  This section will include custom report builders, scheduling
                  options, and export formats.
                </p>
              </div>
            </DashboardCard>
          </div>
        </div>
      </main>
    </div>
  );
}
