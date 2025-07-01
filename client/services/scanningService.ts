export interface ScanResult {
  id: string;
  target: string;
  type: string;
  status: "pending" | "scanning" | "completed" | "failed";
  progress: number;
  startTime: Date;
  endTime?: Date;
  results: {
    openPorts?: number[];
    vulnerabilities?: Vulnerability[];
    subdomains?: string[];
    technologies?: string[];
    riskLevel?: "low" | "medium" | "high" | "critical";
  };
}

export interface Vulnerability {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  cve?: string;
  port?: number;
  service?: string;
}

export interface ScanProgress {
  scanId: string;
  phase: string;
  progress: number;
  message: string;
}

class ScanningService {
  private activeScans = new Map<string, ScanResult>();
  private listeners = new Set<(scan: ScanResult) => void>();
  private progressListeners = new Set<(progress: ScanProgress) => void>();

  // Subscribe to scan updates
  onScanUpdate(callback: (scan: ScanResult) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Subscribe to progress updates
  onProgressUpdate(callback: (progress: ScanProgress) => void) {
    this.progressListeners.add(callback);
    return () => this.progressListeners.delete(callback);
  }

  // Start a comprehensive scan
  async startScan(target: string): Promise<string> {
    const scanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const scan: ScanResult = {
      id: scanId,
      target,
      type: "comprehensive",
      status: "pending",
      progress: 0,
      startTime: new Date(),
      results: {},
    };

    this.activeScans.set(scanId, scan);
    this.notifyListeners(scan);

    // Start the scanning process
    this.performScan(scanId);

    return scanId;
  }

  private async performScan(scanId: string) {
    const scan = this.activeScans.get(scanId);
    if (!scan) return;

    try {
      // Phase 1: Port Scanning
      await this.updateProgress(
        scanId,
        "Port Scanning",
        10,
        "Scanning for open ports...",
      );
      scan.status = "scanning";
      this.notifyListeners(scan);

      await this.delay(2000);
      scan.results.openPorts = this.simulatePortScan(scan.target);

      // Phase 2: Service Detection
      await this.updateProgress(
        scanId,
        "Service Detection",
        30,
        "Detecting services and versions...",
      );
      await this.delay(1500);
      scan.results.technologies = this.simulateServiceDetection();

      // Phase 3: Vulnerability Scanning
      await this.updateProgress(
        scanId,
        "Vulnerability Scanning",
        60,
        "Scanning for vulnerabilities...",
      );
      await this.delay(3000);
      scan.results.vulnerabilities = this.simulateVulnerabilityDetection();

      // Phase 4: Subdomain Enumeration
      await this.updateProgress(
        scanId,
        "Subdomain Enumeration",
        80,
        "Enumerating subdomains...",
      );
      await this.delay(2000);
      scan.results.subdomains = this.simulateSubdomainEnumeration(scan.target);

      // Phase 5: Risk Assessment
      await this.updateProgress(
        scanId,
        "Risk Assessment",
        95,
        "Calculating risk level...",
      );
      await this.delay(1000);
      scan.results.riskLevel = this.calculateRiskLevel(
        scan.results.vulnerabilities || [],
      );

      // Complete scan
      await this.updateProgress(
        scanId,
        "Complete",
        100,
        "Scan completed successfully",
      );
      scan.status = "completed";
      scan.endTime = new Date();
      scan.progress = 100;
    } catch (error) {
      scan.status = "failed";
      await this.updateProgress(scanId, "Failed", 0, "Scan failed");
    }

    this.notifyListeners(scan);
  }

  private async updateProgress(
    scanId: string,
    phase: string,
    progress: number,
    message: string,
  ) {
    const scan = this.activeScans.get(scanId);
    if (scan) {
      scan.progress = progress;
      this.notifyListeners(scan);
    }

    this.progressListeners.forEach((listener) => {
      listener({ scanId, phase, progress, message });
    });
  }

  private simulatePortScan(target: string): number[] {
    const commonPorts = [
      21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 8080, 8443,
    ];
    const openPorts: number[] = [];

    commonPorts.forEach((port) => {
      if (Math.random() > 0.7) {
        // 30% chance port is open
        openPorts.push(port);
      }
    });

    return openPorts.sort((a, b) => a - b);
  }

  private simulateServiceDetection(): string[] {
    const technologies = [
      "nginx/1.18.0",
      "Apache/2.4.41",
      "Node.js",
      "React",
      "PHP/7.4.3",
      "MySQL/8.0",
      "Redis/6.0",
      "SSL/TLS",
    ];

    return technologies.filter(() => Math.random() > 0.6);
  }

  private simulateVulnerabilityDetection(): Vulnerability[] {
    const vulnerabilities: Vulnerability[] = [];

    const vulnPool = [
      {
        severity: "critical" as const,
        title: "SQL Injection in login form",
        description: "The login form is vulnerable to SQL injection attacks",
        cve: "CVE-2023-1234",
        port: 443,
        service: "HTTPS",
      },
      {
        severity: "high" as const,
        title: "Cross-Site Scripting (XSS)",
        description: "Reflected XSS vulnerability in search parameter",
        port: 80,
        service: "HTTP",
      },
      {
        severity: "medium" as const,
        title: "Outdated SSL/TLS Configuration",
        description: "Server supports deprecated TLS versions",
        port: 443,
        service: "HTTPS",
      },
      {
        severity: "low" as const,
        title: "Information Disclosure",
        description: "Server version disclosed in HTTP headers",
        port: 80,
        service: "HTTP",
      },
      {
        severity: "high" as const,
        title: "Directory Traversal",
        description: "Path traversal vulnerability in file upload",
        port: 443,
        service: "HTTPS",
      },
    ];

    vulnPool.forEach((vuln) => {
      if (Math.random() > 0.5) {
        vulnerabilities.push({
          ...vuln,
          id: `vuln_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        });
      }
    });

    return vulnerabilities;
  }

  private simulateSubdomainEnumeration(target: string): string[] {
    const subdomains = [
      "www",
      "api",
      "admin",
      "staging",
      "dev",
      "blog",
      "shop",
      "mail",
    ];
    const domain = target.replace(/^https?:\/\//, "").replace(/\/.*$/, "");

    return subdomains
      .filter(() => Math.random() > 0.6)
      .map((sub) => `${sub}.${domain}`);
  }

  private calculateRiskLevel(
    vulnerabilities: Vulnerability[],
  ): "low" | "medium" | "high" | "critical" {
    if (vulnerabilities.some((v) => v.severity === "critical"))
      return "critical";
    if (vulnerabilities.some((v) => v.severity === "high")) return "high";
    if (vulnerabilities.some((v) => v.severity === "medium")) return "medium";
    return "low";
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private notifyListeners(scan: ScanResult) {
    this.listeners.forEach((listener) => listener(scan));
  }

  // Get scan by ID
  getScan(scanId: string): ScanResult | undefined {
    return this.activeScans.get(scanId);
  }

  // Get all scans
  getAllScans(): ScanResult[] {
    return Array.from(this.activeScans.values());
  }

  // Cancel scan
  cancelScan(scanId: string): boolean {
    const scan = this.activeScans.get(scanId);
    if (scan && scan.status === "scanning") {
      scan.status = "failed";
      scan.endTime = new Date();
      this.notifyListeners(scan);
      return true;
    }
    return false;
  }
}

export const scanningService = new ScanningService();
