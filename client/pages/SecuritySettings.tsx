import Navigation from "@/components/Navigation";
import DashboardCard from "@/components/DashboardCard";
import { Settings, Lock, Key, UserCheck } from "lucide-react";

export default function SecuritySettings() {
  return (
    <div className="min-h-screen bg-cyber-dark-bg">
      <Navigation />

      <main className="lg:pl-72">
        <div className="px-4 py-8 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Security Settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure and manage system security parameters
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard
              title="Access Control"
              icon={<Lock className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Multi-Factor Authentication</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Role-Based Access</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Session Timeout</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Encryption"
              icon={<Key className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Data at Rest</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Data in Transit</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Key Rotation</span>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="User Management"
              icon={<UserCheck className="h-5 w-5" />}
            >
              <div className="text-center py-8">
                <div className="text-2xl font-bold text-cyber-blue mb-2">
                  45
                </div>
                <div className="text-muted-foreground">Active users</div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="System Policies"
              icon={<Settings className="h-5 w-5" />}
            >
              <div className="text-center py-8">
                <div className="text-2xl font-bold text-green-500 mb-2">12</div>
                <div className="text-muted-foreground">Active policies</div>
              </div>
            </DashboardCard>
          </div>

          <div className="mt-8">
            <DashboardCard title="Security Configuration">
              <div className="text-center py-12 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 text-cyber-blue" />
                <p>
                  Detailed security configuration options will be available
                  here.
                </p>
                <p className="text-sm mt-2">
                  This section will include firewall rules, access policies, and
                  system hardening settings.
                </p>
              </div>
            </DashboardCard>
          </div>
        </div>
      </main>
    </div>
  );
}
