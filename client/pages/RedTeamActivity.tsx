import Navigation from "@/components/Navigation";
import DashboardCard from "@/components/DashboardCard";
import { Target, Activity, Clock, Users } from "lucide-react";

export default function RedTeamActivity() {
  return (
    <div className="min-h-screen bg-cyber-dark-bg">
      <Navigation />

      <main className="lg:pl-72">
        <div className="px-4 py-8 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Red Team Activity
            </h1>
            <p className="mt-2 text-muted-foreground">
              Monitor and manage ethical hacking operations and penetration
              testing
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard
              title="Active Operations"
              icon={<Target className="h-5 w-5" />}
            >
              <div className="text-center py-8">
                <div className="text-2xl font-bold text-cyber-blue mb-2">5</div>
                <div className="text-muted-foreground">
                  Currently running penetration tests
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Recent Tests"
              icon={<Activity className="h-5 w-5" />}
            >
              <div className="text-center py-8">
                <div className="text-2xl font-bold text-green-500 mb-2">24</div>
                <div className="text-muted-foreground">
                  Completed this month
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Average Duration"
              icon={<Clock className="h-5 w-5" />}
            >
              <div className="text-center py-8">
                <div className="text-2xl font-bold text-cyber-blue mb-2">
                  4.2h
                </div>
                <div className="text-muted-foreground">
                  Per penetration test
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Team Members"
              icon={<Users className="h-5 w-5" />}
            >
              <div className="text-center py-8">
                <div className="text-2xl font-bold text-foreground mb-2">
                  12
                </div>
                <div className="text-muted-foreground">
                  Active red team analysts
                </div>
              </div>
            </DashboardCard>
          </div>

          <div className="mt-8">
            <DashboardCard title="Detailed Activity Log">
              <div className="text-center py-12 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 text-cyber-blue" />
                <p>Red Team Activity details will be implemented here.</p>
                <p className="text-sm mt-2">
                  This section will show operation logs, test results, and team
                  performance metrics.
                </p>
              </div>
            </DashboardCard>
          </div>
        </div>
      </main>
    </div>
  );
}
