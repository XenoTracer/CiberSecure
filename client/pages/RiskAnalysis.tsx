import Navigation from "@/components/Navigation";
import DashboardCard from "@/components/DashboardCard";
import CyberButton from "@/components/ui/cyber-button";
import {
  AlertTriangle,
  TrendingUp,
  Shield,
  BarChart3,
  Download,
  Filter,
  Calendar,
  Eye,
  Target,
  Activity,
  FileText,
  Settings,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface RiskItem {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  category: string;
  probability: number;
  impact: number;
  riskScore: number;
  affectedAssets: string[];
  mitigationStatus: "none" | "planned" | "in_progress" | "completed";
  assignedTo: string;
  dueDate: Date;
  lastAssessed: Date;
}

interface AssetGroup {
  id: string;
  name: string;
  type: string;
  criticalityLevel: "low" | "medium" | "high" | "critical";
  vulnerabilityCount: number;
  riskScore: number;
  lastScan: Date;
}

export default function RiskAnalysis() {
  const [riskItems, setRiskItems] = useState<RiskItem[]>([]);
  const [assetGroups, setAssetGroups] = useState<AssetGroup[]>([]);
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setRiskItems(generateMockRiskItems());
      setAssetGroups(generateMockAssetGroups());
      setIsLoading(false);
    }, 1000);

    // Simulate real-time risk updates
    const interval = setInterval(() => {
      setRiskItems((prev) =>
        prev.map((risk) => ({
          ...risk,
          riskScore: Math.max(
            1,
            Math.min(10, risk.riskScore + (Math.random() - 0.5) * 0.2),
          ),
          lastAssessed: Math.random() > 0.95 ? new Date() : risk.lastAssessed,
        })),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const generateMockRiskItems = (): RiskItem[] => [
    {
      id: "risk-001",
      title: "Unpatched Critical Vulnerabilities",
      description:
        "Multiple systems have unpatched critical security vulnerabilities that could lead to system compromise.",
      severity: "critical",
      category: "Vulnerability Management",
      probability: 0.8,
      impact: 0.9,
      riskScore: 9.2,
      affectedAssets: ["Web Servers", "Database Servers", "Domain Controllers"],
      mitigationStatus: "in_progress",
      assignedTo: "Security Team",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      lastAssessed: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "risk-002",
      title: "Weak Access Controls",
      description:
        "Insufficient access controls on critical systems allowing potential unauthorized access.",
      severity: "high",
      category: "Access Management",
      probability: 0.6,
      impact: 0.8,
      riskScore: 7.8,
      affectedAssets: ["File Servers", "Application Servers"],
      mitigationStatus: "planned",
      assignedTo: "IT Security",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      lastAssessed: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "risk-003",
      title: "Outdated Encryption Protocols",
      description:
        "Legacy systems using deprecated encryption algorithms vulnerable to cryptographic attacks.",
      severity: "medium",
      category: "Cryptography",
      probability: 0.4,
      impact: 0.7,
      riskScore: 5.6,
      affectedAssets: ["Legacy Applications", "VPN Servers"],
      mitigationStatus: "none",
      assignedTo: "Network Team",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      lastAssessed: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
    {
      id: "risk-004",
      title: "Insufficient Backup Security",
      description:
        "Backup systems lack proper encryption and access controls, creating data exposure risks.",
      severity: "medium",
      category: "Data Protection",
      probability: 0.3,
      impact: 0.8,
      riskScore: 5.4,
      affectedAssets: ["Backup Servers", "Cloud Storage"],
      mitigationStatus: "completed",
      assignedTo: "Data Team",
      dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      lastAssessed: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
    {
      id: "risk-005",
      title: "Social Engineering Susceptibility",
      description:
        "Employee awareness training gaps create vulnerability to social engineering attacks.",
      severity: "medium",
      category: "Human Factors",
      probability: 0.5,
      impact: 0.6,
      riskScore: 5.0,
      affectedAssets: ["All Users", "Email Systems"],
      mitigationStatus: "in_progress",
      assignedTo: "HR Security",
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      lastAssessed: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
    {
      id: "risk-006",
      title: "Third-Party Integration Risks",
      description:
        "External integrations lack proper security assessments and monitoring.",
      severity: "high",
      category: "Third-Party Risk",
      probability: 0.5,
      impact: 0.7,
      riskScore: 6.5,
      affectedAssets: ["API Gateway", "External Connectors"],
      mitigationStatus: "planned",
      assignedTo: "Architecture Team",
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      lastAssessed: new Date(Date.now() - 18 * 60 * 60 * 1000),
    },
  ];

  const generateMockAssetGroups = (): AssetGroup[] => [
    {
      id: "asset-001",
      name: "Web Infrastructure",
      type: "Infrastructure",
      criticalityLevel: "critical",
      vulnerabilityCount: 23,
      riskScore: 8.5,
      lastScan: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: "asset-002",
      name: "Database Systems",
      type: "Data",
      criticalityLevel: "critical",
      vulnerabilityCount: 15,
      riskScore: 7.8,
      lastScan: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "asset-003",
      name: "User Workstations",
      type: "Endpoints",
      criticalityLevel: "medium",
      vulnerabilityCount: 45,
      riskScore: 6.2,
      lastScan: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
    {
      id: "asset-004",
      name: "Network Infrastructure",
      type: "Network",
      criticalityLevel: "high",
      vulnerabilityCount: 12,
      riskScore: 5.9,
      lastScan: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
    {
      id: "asset-005",
      name: "Cloud Services",
      type: "Cloud",
      criticalityLevel: "high",
      vulnerabilityCount: 18,
      riskScore: 6.8,
      lastScan: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-cyber-red bg-cyber-red/20 border-cyber-red/30";
      case "high":
        return "text-red-500 bg-red-500/20 border-red-500/30";
      case "medium":
        return "text-yellow-500 bg-yellow-500/20 border-yellow-500/30";
      case "low":
        return "text-green-500 bg-green-500/20 border-green-500/30";
      default:
        return "text-muted-foreground bg-muted/20 border-muted/30";
    }
  };

  const getMitigationStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500 bg-green-500/20";
      case "in_progress":
        return "text-cyber-blue bg-cyber-blue/20";
      case "planned":
        return "text-yellow-500 bg-yellow-500/20";
      default:
        return "text-cyber-red bg-cyber-red/20";
    }
  };

  const filteredRisks = riskItems.filter(
    (risk) => filterSeverity === "all" || risk.severity === filterSeverity,
  );

  const criticalRisks = riskItems.filter(
    (r) => r.severity === "critical",
  ).length;
  const highRisks = riskItems.filter((r) => r.severity === "high").length;
  const averageRiskScore =
    riskItems.reduce((sum, r) => sum + r.riskScore, 0) / riskItems.length;
  const mitigatedRisks = riskItems.filter(
    (r) => r.mitigationStatus === "completed",
  ).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyber-dark-bg">
        <Navigation />
        <main className="lg:pl-72">
          <div className="px-4 py-8 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyber-blue border-t-transparent"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark-bg">
      <Navigation />

      <main className="lg:pl-72">
        <div className="px-4 py-8 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Risk Analysis
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Comprehensive risk assessment and management dashboard
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CyberButton variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Assessment
                </CyberButton>
                <CyberButton>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </CyberButton>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Critical Risks"
              icon={<AlertTriangle className="h-5 w-5" />}
            >
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-cyber-red">
                  {criticalRisks}
                </div>
                <div className="text-sm text-muted-foreground">
                  Require immediate attention
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="High Risks"
              icon={<TrendingUp className="h-5 w-5" />}
            >
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-red-500">
                  {highRisks}
                </div>
                <div className="text-sm text-muted-foreground">
                  Need prompt action
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Average Risk Score"
              icon={<BarChart3 className="h-5 w-5" />}
            >
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-yellow-500">
                  {averageRiskScore.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Out of 10</div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Mitigated Risks"
              icon={<Shield className="h-5 w-5" />}
            >
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-green-500">
                  {mitigatedRisks}
                </div>
                <div className="text-sm text-muted-foreground">
                  Successfully addressed
                </div>
              </div>
            </DashboardCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Registry */}
            <div className="lg:col-span-2">
              <DashboardCard
                title="Risk Registry"
                icon={<AlertTriangle className="h-5 w-5" />}
              >
                {/* Filter Tabs */}
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  {["all", "critical", "high", "medium", "low"].map(
                    (severity) => (
                      <button
                        key={severity}
                        onClick={() => setFilterSeverity(severity)}
                        className={cn(
                          "px-3 py-1 rounded text-sm font-medium transition-colors",
                          filterSeverity === severity
                            ? "bg-cyber-blue text-cyber-dark-bg"
                            : "bg-cyber-card-bg text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </button>
                    ),
                  )}
                </div>

                <div className="space-y-4">
                  {filteredRisks.map((risk) => (
                    <div
                      key={risk.id}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-all duration-200",
                        "border-cyber-border-gray bg-cyber-card-bg/30 hover:bg-cyber-card-bg/50",
                        selectedRisk?.id === risk.id &&
                          "ring-2 ring-cyber-blue",
                      )}
                      onClick={() => setSelectedRisk(risk)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-foreground">
                              {risk.title}
                            </h4>
                            <span
                              className={cn(
                                "px-2 py-1 rounded text-xs font-medium border",
                                getSeverityColor(risk.severity),
                              )}
                            >
                              {risk.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {risk.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Category: {risk.category}</span>
                            <span>
                              Risk Score:{" "}
                              <span className="text-cyber-red font-medium">
                                {risk.riskScore.toFixed(1)}
                              </span>
                            </span>
                            <span>Assets: {risk.affectedAssets.length}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={cn(
                              "px-2 py-1 rounded text-xs font-medium",
                              getMitigationStatusColor(risk.mitigationStatus),
                            )}
                          >
                            {risk.mitigationStatus
                              .replace("_", " ")
                              .toUpperCase()}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Assigned: {risk.assignedTo}</span>
                          <span>Due: {risk.dueDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-muted-foreground">
                            Impact:
                          </div>
                          <div className="w-16 bg-cyber-dark-bg rounded-full h-2">
                            <div
                              className="bg-cyber-red h-2 rounded-full"
                              style={{ width: `${risk.impact * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            </div>

            {/* Asset Risk Overview */}
            <div>
              <DashboardCard
                title="Asset Risk Overview"
                icon={<Shield className="h-5 w-5" />}
              >
                <div className="space-y-4">
                  {assetGroups.map((asset) => (
                    <div
                      key={asset.id}
                      className="p-3 rounded-lg bg-cyber-card-bg/30 border border-cyber-border-gray"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h5 className="font-medium text-foreground">
                            {asset.name}
                          </h5>
                          <p className="text-xs text-muted-foreground">
                            {asset.type}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "w-3 h-3 rounded-full",
                            asset.criticalityLevel === "critical"
                              ? "bg-cyber-red"
                              : asset.criticalityLevel === "high"
                                ? "bg-red-500"
                                : asset.criticalityLevel === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500",
                          )}
                        />
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">
                          Risk Score:
                        </span>
                        <span className="text-sm font-medium text-cyber-red">
                          {asset.riskScore.toFixed(1)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">
                          Vulnerabilities:
                        </span>
                        <span className="text-sm text-foreground">
                          {asset.vulnerabilityCount}
                        </span>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Last Scan: {asset.lastScan.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>

              {/* Risk Trending */}
              <div className="mt-6">
                <DashboardCard
                  title="Risk Trending"
                  icon={<TrendingUp className="h-5 w-5" />}
                >
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <div className="text-2xl font-bold text-green-500">
                        ↓ 15%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Overall risk reduction this month
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Critical</span>
                        <span className="text-cyber-red">-2</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">High</span>
                        <span className="text-red-500">-5</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Medium</span>
                        <span className="text-yellow-500">+3</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Low</span>
                        <span className="text-green-500">+1</span>
                      </div>
                    </div>
                  </div>
                </DashboardCard>
              </div>

              {/* Quick Actions */}
              <div className="mt-6">
                <DashboardCard
                  title="Quick Actions"
                  icon={<Settings className="h-5 w-5" />}
                >
                  <div className="space-y-3">
                    <CyberButton className="w-full" variant="outline">
                      <Target className="h-4 w-4 mr-2" />
                      New Risk Assessment
                    </CyberButton>
                    <CyberButton className="w-full" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Risk Register Report
                    </CyberButton>
                    <CyberButton className="w-full" variant="outline">
                      <Activity className="h-4 w-4 mr-2" />
                      Asset Vulnerability Scan
                    </CyberButton>
                  </div>
                </DashboardCard>
              </div>
            </div>
          </div>

          {/* Risk Details Modal */}
          {selectedRisk && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-cyber-dark-bg border border-cyber-border-gray rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-cyber-border-gray">
                  <h2 className="text-xl font-bold text-foreground">
                    {selectedRisk.title}
                  </h2>
                  <CyberButton
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedRisk(null)}
                  >
                    ×
                  </CyberButton>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Risk Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Description:
                          </span>
                          <p className="text-foreground">
                            {selectedRisk.description}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Category:
                          </span>
                          <p className="text-foreground font-medium">
                            {selectedRisk.category}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Risk Score:
                          </span>
                          <p className="text-2xl font-bold text-cyber-red">
                            {selectedRisk.riskScore.toFixed(1)}/10
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Probability:
                            </span>
                            <p className="text-foreground font-medium">
                              {(selectedRisk.probability * 100).toFixed(0)}%
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Impact:
                            </span>
                            <p className="text-foreground font-medium">
                              {(selectedRisk.impact * 100).toFixed(0)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Mitigation & Assignment
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Status:
                          </span>
                          <span
                            className={cn(
                              "ml-2 px-2 py-1 rounded text-xs font-medium",
                              getMitigationStatusColor(
                                selectedRisk.mitigationStatus,
                              ),
                            )}
                          >
                            {selectedRisk.mitigationStatus
                              .replace("_", " ")
                              .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Assigned To:
                          </span>
                          <p className="text-foreground font-medium">
                            {selectedRisk.assignedTo}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Due Date:
                          </span>
                          <p className="text-foreground font-medium">
                            {selectedRisk.dueDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Last Assessed:
                          </span>
                          <p className="text-foreground">
                            {selectedRisk.lastAssessed.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Affected Assets:
                          </span>
                          <div className="mt-2 space-y-1">
                            {selectedRisk.affectedAssets.map((asset, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <div className="w-2 h-2 bg-cyber-blue rounded-full" />
                                <span className="text-foreground">{asset}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <CyberButton>
                      <Settings className="h-4 w-4 mr-2" />
                      Update Risk
                    </CyberButton>
                    <CyberButton variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </CyberButton>
                    <CyberButton variant="outline">
                      <Activity className="h-4 w-4 mr-2" />
                      Reassess Risk
                    </CyberButton>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
