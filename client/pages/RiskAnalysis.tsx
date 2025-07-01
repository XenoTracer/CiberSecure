import Navigation from "@/components/Navigation";
import DashboardCard from "@/components/DashboardCard";
import { AlertTriangle, TrendingUp, Shield, BarChart3 } from "lucide-react";

export default function RiskAnalysis() {
  return (
    <div className="min-h-screen bg-cyber-dark-bg">
      <Navigation />

      <main className="lg:pl-72">
        <div className="px-4 py-8 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Risk Analysis
            </h1>
            <p className="mt-2 text-muted-foreground">
              Comprehensive vulnerability assessment and risk evaluation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard
              title="Critical Risks"
              icon={<AlertTriangle className="h-5 w-5" />}
            >
              <div className="text-center py-8">
                <div className="text-2xl font-bold text-cyber-red mb-2">3</div>
                <div className="text-muted-foreground">
                  Require immediate attention
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Risk Trend"
              icon={<TrendingUp className="h-5 w-5" />}
            >
              <div className="text-center py-8">
                <div className="text-2xl font-bold text-green-500 mb-2">
                  -12%
                </div>
                <div className="text-muted-foreground">
                  Reduction from last month
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Protected Assets"
              icon={<Shield className="h-5 w-5" />}
            >
              <div className="text-center py-8">
                <div className="text-2xl font-bold text-cyber-blue mb-2">
                  847
                </div>
                <div className="text-muted-foreground">
                  Systems under protection
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Risk Score"
              icon={<BarChart3 className="h-5 w-5" />}
            >
              <div className="text-center py-8">
                <div className="text-2xl font-bold text-yellow-500 mb-2">
                  74/100
                </div>
                <div className="text-muted-foreground">
                  Overall security rating
                </div>
              </div>
            </DashboardCard>
          </div>

          <div className="mt-8">
            <DashboardCard title="Risk Assessment Matrix">
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-cyber-blue" />
                <p>
                  Risk analysis charts and vulnerability details will be
                  displayed here.
                </p>
                <p className="text-sm mt-2">
                  This section will include threat modeling, impact assessment,
                  and mitigation strategies.
                </p>
              </div>
            </DashboardCard>
          </div>
        </div>
      </main>
    </div>
  );
}
