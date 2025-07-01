import { useState, useEffect } from "react";
import {
  scanningService,
  ScanResult,
  ScanProgress,
} from "@/services/scanningService";
import DashboardCard from "./DashboardCard";
import CyberButton from "./ui/cyber-button";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  X,
  Terminal,
  Globe,
  Server,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScanResultsProps {
  onClose: () => void;
}

export default function ScanResults({ onClose }: ScanResultsProps) {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [currentProgress, setCurrentProgress] = useState<ScanProgress | null>(
    null,
  );
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);

  useEffect(() => {
    // Subscribe to scan updates
    const unsubscribeScan = scanningService.onScanUpdate((scan) => {
      setScans((prev) => {
        const index = prev.findIndex((s) => s.id === scan.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = scan;
          return updated;
        }
        return [...prev, scan];
      });
    });

    // Subscribe to progress updates
    const unsubscribeProgress = scanningService.onProgressUpdate((progress) => {
      setCurrentProgress(progress);
    });

    // Load existing scans
    setScans(scanningService.getAllScans());

    return () => {
      unsubscribeScan();
      unsubscribeProgress();
    };
  }, []);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-cyber-red" />;
      case "scanning":
        return <Clock className="h-4 w-4 text-cyber-blue animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRiskLevelColor = (level?: string) => {
    switch (level) {
      case "critical":
        return "bg-cyber-red";
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-cyber-dark-bg border border-cyber-border-gray rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyber-border-gray">
          <div>
            <h2 className="text-xl font-bold text-foreground">Scan Results</h2>
            <p className="text-muted-foreground">
              Real-time vulnerability scanning results
            </p>
          </div>
          <CyberButton variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </CyberButton>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Scan List */}
          <div className="w-1/3 border-r border-cyber-border-gray p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Active Scans
            </h3>

            {/* Current Progress */}
            {currentProgress && (
              <div className="mb-4 p-4 bg-cyber-card-bg/50 rounded-lg border border-cyber-blue/30">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="h-4 w-4 text-cyber-blue" />
                  <span className="text-sm font-medium text-cyber-blue">
                    {currentProgress.phase}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {currentProgress.message}
                </div>
                <div className="w-full bg-cyber-dark-bg rounded-full h-2">
                  <div
                    className="bg-cyber-blue h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentProgress.progress}%` }}
                  />
                </div>
                <div className="text-xs text-right text-muted-foreground mt-1">
                  {currentProgress.progress}%
                </div>
              </div>
            )}

            {/* Scan List */}
            <div className="space-y-2">
              {scans.map((scan) => (
                <div
                  key={scan.id}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-colors",
                    selectedScan?.id === scan.id
                      ? "border-cyber-blue bg-cyber-blue/10"
                      : "border-cyber-border-gray bg-cyber-card-bg/30 hover:bg-cyber-card-bg/50",
                  )}
                  onClick={() => setSelectedScan(scan)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground truncate">
                      {scan.target}
                    </span>
                    {getStatusIcon(scan.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {scan.startTime.toLocaleTimeString()}
                    </span>
                    {scan.status === "scanning" && (
                      <div className="text-xs text-cyber-blue">
                        {scan.progress}%
                      </div>
                    )}
                  </div>
                  {scan.results.riskLevel && (
                    <div className="mt-2">
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          getRiskLevelColor(scan.results.riskLevel),
                          "text-white",
                        )}
                      >
                        {scan.results.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {scans.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No scans yet</p>
                  <p className="text-xs">Start a scan to see results here</p>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Results */}
          <div className="flex-1 p-4 overflow-y-auto">
            {selectedScan ? (
              <div className="space-y-6">
                {/* Scan Overview */}
                <DashboardCard
                  title="Scan Overview"
                  icon={<Eye className="h-5 w-5" />}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground">Target:</span>
                      <p className="font-medium text-foreground">
                        {selectedScan.target}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedScan.status)}
                        <span className="font-medium text-foreground capitalize">
                          {selectedScan.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Started:</span>
                      <p className="font-medium text-foreground">
                        {selectedScan.startTime.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <p className="font-medium text-foreground">
                        {selectedScan.endTime
                          ? Math.round(
                              (selectedScan.endTime.getTime() -
                                selectedScan.startTime.getTime()) /
                                1000,
                            ) + "s"
                          : "Running..."}
                      </p>
                    </div>
                  </div>
                </DashboardCard>

                {/* Open Ports */}
                {selectedScan.results.openPorts &&
                  selectedScan.results.openPorts.length > 0 && (
                    <DashboardCard
                      title="Open Ports"
                      icon={<Server className="h-5 w-5" />}
                    >
                      <div className="flex flex-wrap gap-2">
                        {selectedScan.results.openPorts.map((port) => (
                          <span
                            key={port}
                            className="px-2 py-1 bg-cyber-blue/20 text-cyber-blue rounded text-sm"
                          >
                            {port}
                          </span>
                        ))}
                      </div>
                    </DashboardCard>
                  )}

                {/* Technologies */}
                {selectedScan.results.technologies &&
                  selectedScan.results.technologies.length > 0 && (
                    <DashboardCard
                      title="Technologies"
                      icon={<Terminal className="h-5 w-5" />}
                    >
                      <div className="space-y-2">
                        {selectedScan.results.technologies.map(
                          (tech, index) => (
                            <div
                              key={index}
                              className="px-3 py-2 bg-cyber-card-bg/50 rounded border border-cyber-border-gray"
                            >
                              <span className="text-foreground">{tech}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </DashboardCard>
                  )}

                {/* Vulnerabilities */}
                {selectedScan.results.vulnerabilities &&
                  selectedScan.results.vulnerabilities.length > 0 && (
                    <DashboardCard
                      title="Vulnerabilities"
                      icon={<AlertTriangle className="h-5 w-5" />}
                    >
                      <div className="space-y-3">
                        {selectedScan.results.vulnerabilities.map((vuln) => (
                          <div
                            key={vuln.id}
                            className="p-4 border border-cyber-border-gray rounded-lg bg-cyber-card-bg/30"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-foreground">
                                {vuln.title}
                              </h4>
                              <span
                                className={cn(
                                  "text-xs px-2 py-1 rounded-full",
                                  getSeverityColor(vuln.severity),
                                  "bg-current/20",
                                )}
                              >
                                {vuln.severity.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-sm mb-2">
                              {vuln.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {vuln.cve && <span>CVE: {vuln.cve}</span>}
                              {vuln.port && <span>Port: {vuln.port}</span>}
                              {vuln.service && (
                                <span>Service: {vuln.service}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </DashboardCard>
                  )}

                {/* Subdomains */}
                {selectedScan.results.subdomains &&
                  selectedScan.results.subdomains.length > 0 && (
                    <DashboardCard
                      title="Subdomains"
                      icon={<Globe className="h-5 w-5" />}
                    >
                      <div className="space-y-2">
                        {selectedScan.results.subdomains.map(
                          (subdomain, index) => (
                            <div
                              key={index}
                              className="px-3 py-2 bg-cyber-card-bg/50 rounded border border-cyber-border-gray flex items-center justify-between"
                            >
                              <span className="text-foreground">
                                {subdomain}
                              </span>
                              <CyberButton size="sm" variant="outline">
                                Scan
                              </CyberButton>
                            </div>
                          ),
                        )}
                      </div>
                    </DashboardCard>
                  )}

                {/* Export Options */}
                <div className="flex gap-3">
                  <CyberButton>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </CyberButton>
                  <CyberButton variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </CyberButton>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a scan to view detailed results</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
