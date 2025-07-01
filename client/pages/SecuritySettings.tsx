import Navigation from "@/components/Navigation";
import DashboardCard from "@/components/DashboardCard";
import CyberButton from "@/components/ui/cyber-button";
import {
  Settings,
  Lock,
  Key,
  UserCheck,
  Shield,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  RefreshCw,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { cveService } from "@/services/cveService";

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: "low" | "medium" | "high" | "critical";
  category: string;
  lastUpdated: Date;
}

interface UserAccount {
  id: string;
  username: string;
  role: "admin" | "user" | "analyst" | "viewer";
  lastLogin: Date;
  status: "active" | "inactive" | "locked";
  permissions: string[];
}

export default function SecuritySettings() {
  const [activeTab, setActiveTab] = useState("policies");
  const [policies, setPolicies] = useState<SecurityPolicy[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [showPasswordPolicy, setShowPasswordPolicy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Security Configuration State
  const [securityConfig, setSecurityConfig] = useState({
    passwordMinLength: 12,
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enableMFA: true,
    enableAuditLogging: true,
    encryptionLevel: "AES-256",
    tlsVersion: "1.3",
  });

  useEffect(() => {
    setTimeout(() => {
      setPolicies(generateMockPolicies());
      setUsers(generateMockUsers());
      setIsLoading(false);
    }, 1000);

    // Simulate real-time security updates
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        cveService.addNotification({
          title: "Security Policy Update",
          message: "System security configuration has been updated",
          type: "info",
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const generateMockPolicies = (): SecurityPolicy[] => [
    {
      id: "pol-001",
      name: "Password Complexity Policy",
      description:
        "Enforces minimum password length, complexity requirements, and rotation schedule",
      enabled: true,
      severity: "high",
      category: "Authentication",
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "pol-002",
      name: "Multi-Factor Authentication",
      description:
        "Requires MFA for all user accounts and administrative access",
      enabled: true,
      severity: "critical",
      category: "Authentication",
      lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: "pol-003",
      name: "Session Management",
      description:
        "Defines session timeout policies and concurrent session limits",
      enabled: true,
      severity: "medium",
      category: "Session",
      lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: "pol-004",
      name: "Data Encryption",
      description:
        "Mandates encryption for data at rest and in transit using AES-256",
      enabled: true,
      severity: "critical",
      category: "Encryption",
      lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
    {
      id: "pol-005",
      name: "Access Control Matrix",
      description:
        "Role-based access control with principle of least privilege",
      enabled: true,
      severity: "high",
      category: "Authorization",
      lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: "pol-006",
      name: "Audit Logging",
      description:
        "Comprehensive logging of all security events and administrative actions",
      enabled: true,
      severity: "medium",
      category: "Monitoring",
      lastUpdated: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
    {
      id: "pol-007",
      name: "Network Security",
      description:
        "Firewall rules, intrusion detection, and network monitoring",
      enabled: false,
      severity: "high",
      category: "Network",
      lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  ];

  const generateMockUsers = (): UserAccount[] => [
    {
      id: "user-001",
      username: "admin@cybersecure.com",
      role: "admin",
      lastLogin: new Date(Date.now() - 30 * 60 * 1000),
      status: "active",
      permissions: ["all"],
    },
    {
      id: "user-002",
      username: "analyst.smith@cybersecure.com",
      role: "analyst",
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "active",
      permissions: ["scan", "report", "view"],
    },
    {
      id: "user-003",
      username: "security.jones@cybersecure.com",
      role: "user",
      lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: "active",
      permissions: ["scan", "view"],
    },
    {
      id: "user-004",
      username: "guest.user@cybersecure.com",
      role: "viewer",
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "inactive",
      permissions: ["view"],
    },
  ];

  const togglePolicy = (policyId: string) => {
    setPolicies((prev) =>
      prev.map((policy) =>
        policy.id === policyId
          ? { ...policy, enabled: !policy.enabled, lastUpdated: new Date() }
          : policy,
      ),
    );

    const policy = policies.find((p) => p.id === policyId);
    if (policy) {
      cveService.addNotification({
        title: "Security Policy Updated",
        message: `${policy.name} has been ${policy.enabled ? "disabled" : "enabled"}`,
        type: policy.enabled ? "warning" : "success",
      });
    }
  };

  const updateUserStatus = (userId: string, status: UserAccount["status"]) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, status } : user)),
    );

    const user = users.find((u) => u.id === userId);
    if (user) {
      cveService.addNotification({
        title: "User Account Updated",
        message: `${user.username} account ${status}`,
        type: status === "locked" ? "warning" : "info",
      });
    }
  };

  const saveSecurityConfig = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      cveService.addNotification({
        title: "Security Configuration Saved",
        message: "All security settings have been updated successfully",
        type: "success",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const exportConfiguration = () => {
    const config = {
      policies: policies,
      users: users.map((u) => ({ ...u, permissions: u.permissions })),
      securityConfig,
      exportDate: new Date(),
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `security-config-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    cveService.addNotification({
      title: "Configuration Exported",
      message: "Security configuration downloaded successfully",
      type: "success",
    });
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500 bg-green-500/20";
      case "inactive":
        return "text-yellow-500 bg-yellow-500/20";
      case "locked":
        return "text-cyber-red bg-cyber-red/20";
      default:
        return "text-muted-foreground bg-muted/20";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-cyber-red bg-cyber-red/20";
      case "analyst":
        return "text-cyber-blue bg-cyber-blue/20";
      case "user":
        return "text-green-500 bg-green-500/20";
      case "viewer":
        return "text-muted-foreground bg-muted/20";
      default:
        return "text-muted-foreground bg-muted/20";
    }
  };

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
                  Security Settings
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Configure and manage system security parameters and policies
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CyberButton variant="outline" onClick={exportConfiguration}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Config
                </CyberButton>
                <CyberButton onClick={saveSecurityConfig} loading={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </CyberButton>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Active Policies"
              icon={<Shield className="h-5 w-5" />}
            >
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-cyber-blue">
                  {policies.filter((p) => p.enabled).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Out of {policies.length}
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Active Users"
              icon={<UserCheck className="h-5 w-5" />}
            >
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-green-500">
                  {users.filter((u) => u.status === "active").length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Authenticated users
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Security Score"
              icon={<Lock className="h-5 w-5" />}
            >
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-cyber-blue">95%</div>
                <div className="text-sm text-muted-foreground">
                  Configuration strength
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Last Audit"
              icon={<Settings className="h-5 w-5" />}
            >
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-foreground">2h</div>
                <div className="text-sm text-muted-foreground">Ago</div>
              </div>
            </DashboardCard>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-cyber-card-bg/30 p-1 rounded-lg">
              {[
                { id: "policies", label: "Security Policies", icon: Shield },
                { id: "users", label: "User Management", icon: UserCheck },
                { id: "config", label: "Configuration", icon: Settings },
                { id: "encryption", label: "Encryption", icon: Key },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                      activeTab === tab.id
                        ? "bg-cyber-blue text-cyber-dark-bg shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-cyber-card-bg/50",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "policies" && (
            <DashboardCard
              title="Security Policies"
              icon={<Shield className="h-5 w-5" />}
            >
              <div className="space-y-4">
                {policies.map((policy) => (
                  <div
                    key={policy.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-cyber-border-gray bg-cyber-card-bg/30"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-foreground">
                          {policy.name}
                        </h4>
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-xs font-medium border",
                            getSeverityColor(policy.severity),
                          )}
                        >
                          {policy.severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {policy.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {policy.description}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Last updated: {policy.lastUpdated.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        {policy.enabled ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        <span
                          className={cn(
                            "ml-2 text-sm",
                            policy.enabled
                              ? "text-green-500"
                              : "text-yellow-500",
                          )}
                        >
                          {policy.enabled ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <CyberButton
                        size="sm"
                        variant={policy.enabled ? "destructive" : "default"}
                        onClick={() => togglePolicy(policy.id)}
                      >
                        {policy.enabled ? "Disable" : "Enable"}
                      </CyberButton>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          )}

          {activeTab === "users" && (
            <DashboardCard
              title="User Management"
              icon={<UserCheck className="h-5 w-5" />}
            >
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-cyber-border-gray bg-cyber-card-bg/30"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-foreground">
                          {user.username}
                        </h4>
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            getRoleColor(user.role),
                          )}
                        >
                          {user.role.toUpperCase()}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            getStatusColor(user.status),
                          )}
                        >
                          {user.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last login: {user.lastLogin.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Permissions: {user.permissions.join(", ")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CyberButton
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateUserStatus(
                            user.id,
                            user.status === "active" ? "inactive" : "active",
                          )
                        }
                      >
                        {user.status === "active" ? "Deactivate" : "Activate"}
                      </CyberButton>
                      <CyberButton
                        size="sm"
                        variant="destructive"
                        onClick={() => updateUserStatus(user.id, "locked")}
                        disabled={user.status === "locked"}
                      >
                        Lock
                      </CyberButton>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          )}

          {activeTab === "config" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardCard
                title="Authentication Settings"
                icon={<Lock className="h-5 w-5" />}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Minimum Password Length
                    </label>
                    <input
                      type="number"
                      value={securityConfig.passwordMinLength}
                      onChange={(e) =>
                        setSecurityConfig((prev) => ({
                          ...prev,
                          passwordMinLength: parseInt(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 bg-cyber-dark-bg border border-cyber-border-gray rounded text-foreground"
                      min="8"
                      max="128"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={securityConfig.sessionTimeout}
                      onChange={(e) =>
                        setSecurityConfig((prev) => ({
                          ...prev,
                          sessionTimeout: parseInt(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 bg-cyber-dark-bg border border-cyber-border-gray rounded text-foreground"
                      min="5"
                      max="480"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      value={securityConfig.maxLoginAttempts}
                      onChange={(e) =>
                        setSecurityConfig((prev) => ({
                          ...prev,
                          maxLoginAttempts: parseInt(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 bg-cyber-dark-bg border border-cyber-border-gray rounded text-foreground"
                      min="3"
                      max="10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securityConfig.enableMFA}
                        onChange={(e) =>
                          setSecurityConfig((prev) => ({
                            ...prev,
                            enableMFA: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-cyber-border-gray bg-cyber-dark-bg checked:bg-cyber-blue"
                      />
                      <span className="text-sm text-foreground">
                        Enable Multi-Factor Authentication
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securityConfig.passwordRequireSpecial}
                        onChange={(e) =>
                          setSecurityConfig((prev) => ({
                            ...prev,
                            passwordRequireSpecial: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-cyber-border-gray bg-cyber-dark-bg checked:bg-cyber-blue"
                      />
                      <span className="text-sm text-foreground">
                        Require Special Characters
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securityConfig.enableAuditLogging}
                        onChange={(e) =>
                          setSecurityConfig((prev) => ({
                            ...prev,
                            enableAuditLogging: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-cyber-border-gray bg-cyber-dark-bg checked:bg-cyber-blue"
                      />
                      <span className="text-sm text-foreground">
                        Enable Audit Logging
                      </span>
                    </label>
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard
                title="Network & Encryption"
                icon={<Key className="h-5 w-5" />}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Encryption Level
                    </label>
                    <select
                      value={securityConfig.encryptionLevel}
                      onChange={(e) =>
                        setSecurityConfig((prev) => ({
                          ...prev,
                          encryptionLevel: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-cyber-dark-bg border border-cyber-border-gray rounded text-foreground"
                    >
                      <option value="AES-128">AES-128</option>
                      <option value="AES-256">AES-256</option>
                      <option value="ChaCha20">ChaCha20</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      TLS Version
                    </label>
                    <select
                      value={securityConfig.tlsVersion}
                      onChange={(e) =>
                        setSecurityConfig((prev) => ({
                          ...prev,
                          tlsVersion: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-cyber-dark-bg border border-cyber-border-gray rounded text-foreground"
                    >
                      <option value="1.2">TLS 1.2</option>
                      <option value="1.3">TLS 1.3</option>
                    </select>
                  </div>

                  <div className="p-4 bg-cyber-blue/10 border border-cyber-blue/30 rounded">
                    <h4 className="font-medium text-cyber-blue mb-2">
                      Security Status
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Firewall:</span>
                        <span className="text-green-500">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IDS/IPS:</span>
                        <span className="text-green-500">Monitoring</span>
                      </div>
                      <div className="flex justify-between">
                        <span>DLP:</span>
                        <span className="text-green-500">Enabled</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SIEM:</span>
                        <span className="text-green-500">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </div>
          )}

          {activeTab === "encryption" && (
            <DashboardCard
              title="Encryption Management"
              icon={<Key className="h-5 w-5" />}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-4">
                    Certificate Information
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-cyber-card-bg/50 rounded border border-cyber-border-gray">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          SSL Certificate
                        </span>
                        <span className="text-green-500 text-xs">Valid</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Issuer: Let's Encrypt Authority X3</div>
                        <div>Expires: March 15, 2025</div>
                        <div>Algorithm: RSA 2048-bit</div>
                      </div>
                    </div>

                    <div className="p-3 bg-cyber-card-bg/50 rounded border border-cyber-border-gray">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Database Encryption
                        </span>
                        <span className="text-green-500 text-xs">AES-256</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Key Rotation: Every 90 days</div>
                        <div>Last Rotated: 23 days ago</div>
                        <div>Encryption: At rest & in transit</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-4">
                    Key Management
                  </h4>
                  <div className="space-y-3">
                    <CyberButton variant="outline" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Rotate Encryption Keys
                    </CyberButton>
                    <CyberButton variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Backup Keys
                    </CyberButton>
                    <CyberButton variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Certificate
                    </CyberButton>
                    <CyberButton variant="destructive" className="w-full">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Revoke Certificate
                    </CyberButton>
                  </div>

                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded">
                    <div className="flex items-center gap-2 text-yellow-500 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Security Warning</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      SSL certificate expires in 89 days. Schedule renewal to
                      avoid service interruption.
                    </p>
                  </div>
                </div>
              </div>
            </DashboardCard>
          )}
        </div>
      </main>
    </div>
  );
}
