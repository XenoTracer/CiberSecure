import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  advancedScanningService,
  ComprehensiveScanResult,
  ScanPhase,
  DetailedVulnerability,
} from "@/services/advancedScanningService";
import DashboardCard from "./DashboardCard";
import CyberButton from "./ui/cyber-button";
import {
  ArrowLeft,
  Play,
  Pause,
  Square,
  Download,
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Target,
  Server,
  Globe,
  FileText,
  Lock,
  Code,
  Database,
  Wifi,
  Eye,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScanningDashboardProps {
  scanId?: string;
  target?: string;
  onClose?: () => void;
}

export default function ScanningDashboard({
  scanId: initialScanId,
  target: initialTarget,
  onClose,
}: ScanningDashboardProps) {
  const navigate = useNavigate();
  const [scan, setScan] = useState<ComprehensiveScanResult | null>(null);
  const [activePhase, setActivePhase] = useState<ScanPhase | null>(null);
  const [selectedVuln, setSelectedVuln] =
    useState<DetailedVulnerability | null>(null);

  useEffect(() => {
    if (initialScanId) {
      const existingScan = advancedScanningService.getScan(initialScanId);
      if (existingScan) {
        setScan(existingScan);
      }
    } else if (initialTarget) {
      // Start new scan
      startNewScan(initialTarget);
    }

    // Subscribe to scan updates
    const unsubscribeScan = advancedScanningService.onScanUpdate(
      (updatedScan) => {
        if (!initialScanId || updatedScan.id === initialScanId) {
          setScan(updatedScan);
        }
      },
    );

    // Subscribe to phase updates
    const unsubscribePhase = advancedScanningService.onPhaseUpdate(
      (scanId, phase) => {
        if (!initialScanId || scanId === initialScanId) {
          setActivePhase(phase);
        }
      },
    );

    return () => {
      unsubscribeScan();
      unsubscribePhase();
    };
  }, [initialScanId, initialTarget]);

  const startNewScan = async (target: string) => {
    try {
      const scanId =
        await advancedScanningService.startComprehensiveScan(target);
      const newScan = advancedScanningService.getScan(scanId);
      if (newScan) {
        setScan(newScan);
      }
    } catch (error) {
      console.error("Failed to start scan:", error);
    }
  };

  const handlePauseScan = () => {
    if (scan) {
      advancedScanningService.pauseScan(scan.id);
    }
  };

  const handleStopScan = () => {
    if (scan) {
      advancedScanningService.stopScan(scan.id);
    }
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

  const getPhaseIcon = (phaseName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      reconnaissance: <Eye className="h-4 w-4" />,
      port_scan: <Server className="h-4 w-4" />,
      subdomain_enum: <Globe className="h-4 w-4" />,
      directory_scan: <FileText className="h-4 w-4" />,
      tech_detection: <Code className="h-4 w-4" />,
      ssl_analysis: <Lock className="h-4 w-4" />,
      sqli_test: <Database className="h-4 w-4" />,
      xss_test: <AlertTriangle className="h-4 w-4" />,
      security_headers: <Shield className="h-4 w-4" />,
    };
    return iconMap[phaseName] || <Activity className="h-4 w-4" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-cyber-red" />;
      case "running":
        return (
          <div className="h-4 w-4 bg-cyber-blue rounded-full animate-pulse" />
        );
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (!scan) {
    return (
      <div className="min-h-screen bg-cyber-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyber-blue border-t-transparent mx-auto mb-4"></div>
          <p className="text-foreground">Initializing scan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark-bg">
      {/* Header */}
      <div className="border-b border-cyber-border-gray bg-cyber-card-bg/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CyberButton
                variant="ghost"
                size="icon"
                onClick={() => (onClose ? onClose() : navigate("/"))}
              >
                <ArrowLeft className="h-4 w-4" />
              </CyberButton>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Advanced Vulnerability Scan
                </h1>
                <p className="text-muted-foreground">
                  Target: <span className="text-cyber-blue">{scan.target}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {scan.status === "scanning" && (
                <CyberButton variant="outline" onClick={handlePauseScan}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </CyberButton>
              )}
              {(scan.status === "scanning" || scan.status === "paused") && (
                <CyberButton variant="destructive" onClick={handleStopScan}>
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </CyberButton>
              )}
              {scan.status === "completed" && (
                <CyberButton>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </CyberButton>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {scan.currentPhase
                  ? `Phase: ${scan.currentPhase.replace(/_/g, " ")}`
                  : "Scan Progress"}
              </span>
              <span className="text-sm text-cyber-blue">{scan.progress}%</span>
            </div>
            <div className="w-full bg-cyber-dark-bg rounded-full h-3">
              <div
                className="bg-gradient-to-r from-cyber-blue to-cyber-blue/80 h-3 rounded-full transition-all duration-500"
                style={{ width: `${scan.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <DashboardCard
              title="Vulnerabilities Found"
              icon={<AlertTriangle className="h-5 w-5" />}
            >
              <div className="text-center">
                <div
                  className={`text-3xl font-bold ${scan.results.vulnerabilities.length > 0 ? "text-cyber-red" : "text-green-500"}`}
                >
                  {scan.results.vulnerabilities.length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {scan.statistics.riskLevel} risk
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Security Score"
              icon={<Shield className="h-5 w-5" />}
            >
              <div className="text-center">
                <div
                  className={`text-3xl font-bold ${
                    scan.statistics.score >= 80
                      ? "text-green-500"
                      : scan.statistics.score >= 60
                        ? "text-yellow-500"
                        : "text-cyber-red"
                  }`}
                >
                  {scan.statistics.score}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  out of 100
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Open Ports"
              icon={<Server className="h-5 w-5" />}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-cyber-blue">
                  {scan.results.openPorts.length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  services detected
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Requests Made"
              icon={<Activity className="h-5 w-5" />}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">
                  {scan.statistics.totalRequests}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  HTTP requests
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Vulnerabilities Section */}
          {scan.results.vulnerabilities.length > 0 && (
            <div className="mb-6">
              <DashboardCard
                title="Vulnerabilities"
                icon={<AlertTriangle className="h-5 w-5" />}
              >
                <div className="space-y-3">
                  {scan.results.vulnerabilities.map((vuln) => (
                    <div
                      key={vuln.id}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-colors",
                        getSeverityColor(vuln.severity),
                        selectedVuln?.id === vuln.id
                          ? "ring-2 ring-cyber-blue"
                          : "",
                      )}
                      onClick={() => setSelectedVuln(vuln)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{vuln.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase">
                            {vuln.severity}
                          </span>
                          {vuln.cvss && (
                            <span className="text-xs bg-muted/30 px-2 py-1 rounded">
                              CVSS: {vuln.cvss}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm opacity-80 mb-2">
                        {vuln.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs opacity-70">
                        <span>Category: {vuln.category}</span>
                        <span>Paths: {vuln.paths.length}</span>
                        <span>Confidence: {vuln.confidence}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            </div>
          )}

          {/* Additional Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Open Ports */}
            {scan.results.openPorts.length > 0 && (
              <DashboardCard
                title="Open Ports"
                icon={<Server className="h-5 w-5" />}
              >
                <div className="space-y-3">
                  {scan.results.openPorts.map((port, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-cyber-dark-bg/50 rounded"
                    >
                      <div>
                        <span className="font-medium text-cyber-blue">
                          {port.port}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          {port.service}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {port.version}
                      </span>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            )}

            {/* Technologies */}
            {scan.results.technologies.length > 0 && (
              <DashboardCard
                title="Technologies"
                icon={<Code className="h-5 w-5" />}
              >
                <div className="space-y-2">
                  {scan.results.technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-cyber-dark-bg/30 rounded"
                    >
                      <span className="text-foreground">{tech.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {tech.version}
                      </span>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            )}
          </div>
        </div>

        {/* Sidebar - Scan Phases */}
        <div className="w-80 border-l border-cyber-border-gray bg-cyber-card-bg/30 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Scan Phases
          </h3>
          <div className="space-y-2">
            {scan.phases.map((phase, index) => (
              <div
                key={phase.name}
                className={cn(
                  "p-3 rounded-lg border transition-colors",
                  phase.status === "running"
                    ? "border-cyber-blue bg-cyber-blue/10"
                    : phase.status === "completed"
                      ? "border-green-500/30 bg-green-500/10"
                      : phase.status === "failed"
                        ? "border-cyber-red/30 bg-cyber-red/10"
                        : "border-cyber-border-gray bg-cyber-dark-bg/30",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {getPhaseIcon(phase.name)}
                    <span className="text-sm font-medium capitalize">
                      {phase.name.replace(/_/g, " ")}
                    </span>
                  </div>
                  {getStatusIcon(phase.status)}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {phase.description}
                </p>
                {phase.status === "running" && (
                  <div className="w-full bg-cyber-dark-bg rounded-full h-1">
                    <div
                      className="bg-cyber-blue h-1 rounded-full transition-all duration-300"
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>
                )}
                {phase.status === "completed" && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Findings: {phase.findings || 0}</span>
                    {phase.duration && (
                      <span>{Math.round(phase.duration / 1000)}s</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vulnerability Detail Modal */}
      {selectedVuln && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-cyber-dark-bg border border-cyber-border-gray rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-cyber-border-gray">
              <h2 className="text-xl font-bold text-foreground">
                {selectedVuln.title}
              </h2>
              <CyberButton
                variant="ghost"
                size="icon"
                onClick={() => setSelectedVuln(null)}
              >
                <XCircle className="h-4 w-4" />
              </CyberButton>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Vulnerability Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Severity
                    </label>
                    <div
                      className={cn(
                        "text-lg font-bold",
                        getSeverityColor(selectedVuln.severity),
                      )}
                    >
                      {selectedVuln.severity.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      CVSS Score
                    </label>
                    <div className="text-lg font-bold text-foreground">
                      {selectedVuln.cvss || "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Category
                    </label>
                    <div className="text-foreground">
                      {selectedVuln.category}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Confidence
                    </label>
                    <div className="text-foreground capitalize">
                      {selectedVuln.confidence}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Description
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedVuln.description}
                  </p>
                </div>

                {/* Affected Paths */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Affected Paths
                  </h3>
                  <div className="space-y-4">
                    {selectedVuln.paths.map((path, index) => (
                      <div
                        key={index}
                        className="border border-cyber-border-gray rounded-lg p-4 bg-cyber-card-bg/30"
                      >
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-cyber-blue font-medium">
                            {path.method}
                          </span>
                          <span className="text-foreground">{path.path}</span>
                        </div>

                        {path.parameters && path.parameters.length > 0 && (
                          <div className="mb-2">
                            <span className="text-sm text-muted-foreground">
                              Parameters:{" "}
                            </span>
                            <span className="text-foreground">
                              {path.parameters.join(", ")}
                            </span>
                          </div>
                        )}

                        {path.evidence && (
                          <div className="mb-2">
                            <span className="text-sm text-muted-foreground">
                              Evidence:{" "}
                            </span>
                            <code className="text-cyber-blue bg-cyber-dark-bg px-2 py-1 rounded text-sm">
                              {path.evidence}
                            </code>
                          </div>
                        )}

                        {path.request && (
                          <div className="mb-2">
                            <span className="text-sm text-muted-foreground">
                              Request:
                            </span>
                            <pre className="text-xs bg-cyber-dark-bg p-2 rounded mt-1 overflow-x-auto">
                              {path.request}
                            </pre>
                          </div>
                        )}

                        {path.response && (
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Response:
                            </span>
                            <pre className="text-xs bg-cyber-dark-bg p-2 rounded mt-1 overflow-x-auto">
                              {path.response}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact & Remediation */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Impact
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedVuln.impact}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Remediation
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedVuln.remediation}
                    </p>
                  </div>
                </div>

                {/* References */}
                {selectedVuln.references.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      References
                    </h3>
                    <ul className="space-y-1">
                      {selectedVuln.references.map((ref, index) => (
                        <li key={index}>
                          <a
                            href={ref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyber-blue hover:underline text-sm"
                          >
                            {ref}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
