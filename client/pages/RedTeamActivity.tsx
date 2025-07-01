import Navigation from "@/components/Navigation";
import DashboardCard from "@/components/DashboardCard";
import CyberButton from "@/components/ui/cyber-button";
import {
  Target,
  Activity,
  Clock,
  Users,
  PlayCircle,
  Pause,
  Square,
  Calendar,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  FileText,
  Settings,
  Filter,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface RedTeamOperation {
  id: string;
  name: string;
  target: string;
  type:
    | "penetration_test"
    | "social_engineering"
    | "physical_security"
    | "wireless_assessment"
    | "web_application";
  status: "planned" | "active" | "completed" | "paused" | "failed";
  progress: number;
  startTime: Date;
  endTime?: Date;
  team: string[];
  findings: number;
  severity: "low" | "medium" | "high" | "critical";
  phase: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialization: string[];
  activeOperations: number;
  successRate: number;
  status: "available" | "busy" | "offline";
}

export default function RedTeamActivity() {
  const [operations, setOperations] = useState<RedTeamOperation[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedOperation, setSelectedOperation] =
    useState<RedTeamOperation | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setOperations(generateMockOperations());
      setTeamMembers(generateMockTeamMembers());
      setIsLoading(false);
    }, 1000);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setOperations((prev) =>
        prev.map((op) => {
          if (op.status === "active" && op.progress < 100) {
            return {
              ...op,
              progress: Math.min(100, op.progress + Math.random() * 5),
              findings: op.findings + (Math.random() > 0.8 ? 1 : 0),
            };
          }
          return op;
        }),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const generateMockOperations = (): RedTeamOperation[] => [
    {
      id: "op-001",
      name: "Corporate Infrastructure Assessment",
      target: "TechCorp Inc. (192.168.1.0/24)",
      type: "penetration_test",
      status: "active",
      progress: 65,
      startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
      team: ["alice_cyber", "bob_security", "charlie_hacker"],
      findings: 12,
      severity: "high",
      phase: "Privilege Escalation",
    },
    {
      id: "op-002",
      name: "Web Application Security Review",
      target: "webapp.example.com",
      type: "web_application",
      status: "active",
      progress: 30,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      team: ["diana_web", "eve_exploit"],
      findings: 8,
      severity: "medium",
      phase: "Vulnerability Discovery",
    },
    {
      id: "op-003",
      name: "Wireless Network Penetration",
      target: "Corporate WiFi Network",
      type: "wireless_assessment",
      status: "completed",
      progress: 100,
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      team: ["frank_wireless", "grace_rf"],
      findings: 15,
      severity: "critical",
      phase: "Report Generation",
    },
    {
      id: "op-004",
      name: "Social Engineering Campaign",
      target: "Employee Awareness Test",
      type: "social_engineering",
      status: "planned",
      progress: 0,
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      team: ["henry_social", "ivy_psych"],
      findings: 0,
      severity: "medium",
      phase: "Planning",
    },
    {
      id: "op-005",
      name: "Physical Security Assessment",
      target: "Main Office Building",
      type: "physical_security",
      status: "paused",
      progress: 45,
      startTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
      team: ["jack_physical", "kelly_lock"],
      findings: 6,
      severity: "medium",
      phase: "Access Control Testing",
    },
  ];

  const generateMockTeamMembers = (): TeamMember[] => [
    {
      id: "alice_cyber",
      name: "Alice Chen",
      role: "Senior Penetration Tester",
      specialization: ["Network Security", "Linux Systems", "Web Applications"],
      activeOperations: 2,
      successRate: 94,
      status: "busy",
    },
    {
      id: "bob_security",
      name: "Bob Rodriguez",
      role: "Security Analyst",
      specialization: [
        "Windows Systems",
        "Active Directory",
        "Malware Analysis",
      ],
      activeOperations: 1,
      successRate: 88,
      status: "busy",
    },
    {
      id: "charlie_hacker",
      name: "Charlie Kim",
      role: "Exploit Developer",
      specialization: [
        "Binary Exploitation",
        "Reverse Engineering",
        "Zero-Day Research",
      ],
      activeOperations: 1,
      successRate: 96,
      status: "busy",
    },
    {
      id: "diana_web",
      name: "Diana Foster",
      role: "Web Application Specialist",
      specialization: ["OWASP Top 10", "API Security", "Mobile Apps"],
      activeOperations: 1,
      successRate: 92,
      status: "busy",
    },
    {
      id: "eve_exploit",
      name: "Eve Thompson",
      role: "Junior Penetration Tester",
      specialization: ["SQL Injection", "XSS", "CSRF"],
      activeOperations: 1,
      successRate: 85,
      status: "busy",
    },
    {
      id: "frank_wireless",
      name: "Frank Wilson",
      role: "Wireless Security Expert",
      specialization: ["WiFi Security", "Bluetooth", "RF Analysis"],
      activeOperations: 0,
      successRate: 90,
      status: "available",
    },
    {
      id: "grace_rf",
      name: "Grace Lee",
      role: "RF Engineer",
      specialization: ["Radio Frequency", "Signal Analysis", "IoT Security"],
      activeOperations: 0,
      successRate: 87,
      status: "available",
    },
    {
      id: "henry_social",
      name: "Henry Davis",
      role: "Social Engineering Specialist",
      specialization: ["Phishing", "Vishing", "Physical Intrusion"],
      activeOperations: 0,
      successRate: 93,
      status: "available",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-cyber-blue bg-cyber-blue/20";
      case "completed":
        return "text-green-500 bg-green-500/20";
      case "failed":
        return "text-cyber-red bg-cyber-red/20";
      case "paused":
        return "text-yellow-500 bg-yellow-500/20";
      default:
        return "text-muted-foreground bg-muted/20";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-cyber-red";
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "penetration_test":
        return <Target className="h-4 w-4" />;
      case "web_application":
        return <Activity className="h-4 w-4" />;
      case "wireless_assessment":
        return <Activity className="h-4 w-4" />;
      case "social_engineering":
        return <Users className="h-4 w-4" />;
      case "physical_security":
        return <Shield className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const filteredOperations = operations.filter(
    (op) => filterStatus === "all" || op.status === filterStatus,
  );

  const activeOperations = operations.filter(
    (op) => op.status === "active",
  ).length;
  const totalFindings = operations.reduce((sum, op) => sum + op.findings, 0);
  const avgSuccessRate =
    teamMembers.reduce((sum, member) => sum + member.successRate, 0) /
    teamMembers.length;

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
                  Red Team Operations
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Advanced persistent threat simulation and security assessment
                  operations
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CyberButton variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </CyberButton>
                <CyberButton>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  New Operation
                </CyberButton>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Active Operations"
              icon={<Activity className="h-5 w-5" />}
            >
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-cyber-blue">
                  {activeOperations}
                </div>
                <div className="text-sm text-muted-foreground">
                  Currently running
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Total Findings"
              icon={<AlertTriangle className="h-5 w-5" />}
            >
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-cyber-red">
                  {totalFindings}
                </div>
                <div className="text-sm text-muted-foreground">
                  Vulnerabilities found
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Team Success Rate"
              icon={<TrendingUp className="h-5 w-5" />}
            >
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-green-500">
                  {avgSuccessRate.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Average performance
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Available Team Members"
              icon={<Users className="h-5 w-5" />}
            >
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-foreground">
                  {teamMembers.filter((m) => m.status === "available").length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Ready for deployment
                </div>
              </div>
            </DashboardCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Operations List */}
            <div className="lg:col-span-2">
              <DashboardCard
                title="Active Operations"
                icon={<Target className="h-5 w-5" />}
              >
                {/* Filter Tabs */}
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  {["all", "active", "completed", "planned", "paused"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={cn(
                          "px-3 py-1 rounded text-sm font-medium transition-colors",
                          filterStatus === status
                            ? "bg-cyber-blue text-cyber-dark-bg"
                            : "bg-cyber-card-bg text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ),
                  )}
                </div>

                <div className="space-y-4">
                  {filteredOperations.map((operation) => (
                    <div
                      key={operation.id}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-all duration-200",
                        "border-cyber-border-gray bg-cyber-card-bg/30 hover:bg-cyber-card-bg/50",
                        selectedOperation?.id === operation.id &&
                          "ring-2 ring-cyber-blue",
                      )}
                      onClick={() => setSelectedOperation(operation)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(operation.type)}
                          <div>
                            <h4 className="font-medium text-foreground">
                              {operation.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {operation.target}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "px-2 py-1 rounded text-xs font-medium",
                              getStatusColor(operation.status),
                            )}
                          >
                            {operation.status.toUpperCase()}
                          </span>
                          <span
                            className={cn(
                              "text-sm font-medium",
                              getSeverityColor(operation.severity),
                            )}
                          >
                            {operation.findings} findings
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Phase: {operation.phase}
                        </span>
                        <span className="text-sm text-cyber-blue">
                          {operation.progress}%
                        </span>
                      </div>

                      <div className="w-full bg-cyber-dark-bg rounded-full h-2 mb-3">
                        <div
                          className="bg-cyber-blue h-2 rounded-full transition-all duration-300"
                          style={{ width: `${operation.progress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Team: {operation.team.length} members</span>
                        <span>
                          Started: {operation.startTime.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            </div>

            {/* Team Members */}
            <div>
              <DashboardCard
                title="Red Team Members"
                icon={<Users className="h-5 w-5" />}
              >
                <div className="space-y-3">
                  {teamMembers.slice(0, 6).map((member) => (
                    <div
                      key={member.id}
                      className="p-3 rounded-lg bg-cyber-card-bg/30 border border-cyber-border-gray"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h5 className="font-medium text-foreground">
                            {member.name}
                          </h5>
                          <p className="text-xs text-muted-foreground">
                            {member.role}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            member.status === "available"
                              ? "bg-green-500"
                              : member.status === "busy"
                                ? "bg-yellow-500"
                                : "bg-muted",
                          )}
                        />
                      </div>

                      <div className="text-xs text-muted-foreground mb-2">
                        Specializations:{" "}
                        {member.specialization.slice(0, 2).join(", ")}
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Success Rate:{" "}
                          <span className="text-green-500">
                            {member.successRate}%
                          </span>
                        </span>
                        <span className="text-muted-foreground">
                          Active:{" "}
                          <span className="text-cyber-blue">
                            {member.activeOperations}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>

              {/* Quick Actions */}
              <div className="mt-6">
                <DashboardCard
                  title="Quick Actions"
                  icon={<Settings className="h-5 w-5" />}
                >
                  <div className="space-y-3">
                    <CyberButton className="w-full" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </CyberButton>
                    <CyberButton className="w-full" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Assessment
                    </CyberButton>
                    <CyberButton className="w-full" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Team Management
                    </CyberButton>
                  </div>
                </DashboardCard>
              </div>
            </div>
          </div>

          {/* Operation Details Modal */}
          {selectedOperation && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-cyber-dark-bg border border-cyber-border-gray rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-cyber-border-gray">
                  <h2 className="text-xl font-bold text-foreground">
                    {selectedOperation.name}
                  </h2>
                  <CyberButton
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedOperation(null)}
                  >
                    ×
                  </CyberButton>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Operation Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Target:
                          </span>
                          <p className="text-foreground font-medium">
                            {selectedOperation.target}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Type:
                          </span>
                          <p className="text-foreground font-medium capitalize">
                            {selectedOperation.type.replace(/_/g, " ")}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Current Phase:
                          </span>
                          <p className="text-foreground font-medium">
                            {selectedOperation.phase}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Progress:
                          </span>
                          <div className="mt-2">
                            <div className="w-full bg-cyber-dark-bg rounded-full h-3">
                              <div
                                className="bg-cyber-blue h-3 rounded-full"
                                style={{
                                  width: `${selectedOperation.progress}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-cyber-blue">
                              {selectedOperation.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Findings & Team
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Findings:
                          </span>
                          <p
                            className={cn(
                              "text-2xl font-bold",
                              getSeverityColor(selectedOperation.severity),
                            )}
                          >
                            {selectedOperation.findings}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Severity Level:
                          </span>
                          <p
                            className={cn(
                              "font-medium capitalize",
                              getSeverityColor(selectedOperation.severity),
                            )}
                          >
                            {selectedOperation.severity}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Team Members:
                          </span>
                          <div className="mt-2 space-y-1">
                            {selectedOperation.team.map((memberId) => {
                              const member = teamMembers.find(
                                (m) => m.id === memberId,
                              );
                              return member ? (
                                <div
                                  key={memberId}
                                  className="flex items-center gap-2"
                                >
                                  <div className="w-2 h-2 bg-cyber-blue rounded-full" />
                                  <span className="text-foreground">
                                    {member.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    ({member.role})
                                  </span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    {selectedOperation.status === "active" && (
                      <>
                        <CyberButton variant="outline">
                          <Pause className="h-4 w-4 mr-2" />
                          Pause Operation
                        </CyberButton>
                        <CyberButton variant="destructive">
                          <Square className="h-4 w-4 mr-2" />
                          Stop Operation
                        </CyberButton>
                      </>
                    )}
                    <CyberButton>
                      <FileText className="h-4 w-4 mr-2" />
                      View Report
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
