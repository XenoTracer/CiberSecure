export interface VulnerabilityPath {
  path: string;
  method: string;
  parameters?: string[];
  evidence?: string;
  request?: string;
  response?: string;
}

export interface DetailedVulnerability {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  category: string;
  cve?: string;
  cvss?: number;
  paths: VulnerabilityPath[];
  remediation: string;
  references: string[];
  impact: string;
  likelihood: "low" | "medium" | "high";
  confidence: "tentative" | "firm" | "certain";
}

export interface ScanPhase {
  name: string;
  description: string;
  progress: number;
  status: "pending" | "running" | "completed" | "failed";
  duration?: number;
  findings?: number;
}

export interface ComprehensiveScanResult {
  id: string;
  target: string;
  startTime: Date;
  endTime?: Date;
  status: "pending" | "scanning" | "completed" | "failed" | "paused";
  progress: number;
  currentPhase?: string;
  phases: ScanPhase[];
  results: {
    vulnerabilities: DetailedVulnerability[];
    openPorts: Array<{
      port: number;
      service: string;
      version?: string;
      banner?: string;
    }>;
    subdomains: Array<{ domain: string; ip?: string; status: string }>;
    technologies: Array<{
      name: string;
      version?: string;
      categories: string[];
    }>;
    directories: Array<{ path: string; status: number; size?: number }>;
    forms: Array<{ action: string; method: string; inputs: string[] }>;
    headers: Record<string, string>;
    cookies: Array<{
      name: string;
      secure: boolean;
      httpOnly: boolean;
      sameSite?: string;
    }>;
    ssl: {
      enabled: boolean;
      version?: string;
      cipher?: string;
      certificate?: {
        issuer: string;
        subject: string;
        expires: Date;
        selfSigned: boolean;
      };
    };
  };
  statistics: {
    totalRequests: number;
    totalFindings: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    score: number;
  };
}

class AdvancedScanningService {
  private activeScans = new Map<string, ComprehensiveScanResult>();
  private listeners = new Set<(scan: ComprehensiveScanResult) => void>();
  private phaseListeners = new Set<
    (scanId: string, phase: ScanPhase) => void
  >();

  onScanUpdate(callback: (scan: ComprehensiveScanResult) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  onPhaseUpdate(callback: (scanId: string, phase: ScanPhase) => void) {
    this.phaseListeners.add(callback);
    return () => this.phaseListeners.delete(callback);
  }

  async startComprehensiveScan(target: string): Promise<string> {
    const scanId = `adv_scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const scan: ComprehensiveScanResult = {
      id: scanId,
      target,
      startTime: new Date(),
      status: "pending",
      progress: 0,
      phases: this.initializeScanPhases(),
      results: {
        vulnerabilities: [],
        openPorts: [],
        subdomains: [],
        technologies: [],
        directories: [],
        forms: [],
        headers: {},
        cookies: [],
        ssl: { enabled: false },
      },
      statistics: {
        totalRequests: 0,
        totalFindings: 0,
        riskLevel: "low",
        score: 100,
      },
    };

    this.activeScans.set(scanId, scan);
    this.notifyListeners(scan);

    // Start comprehensive scanning
    this.performComprehensiveScan(scanId);

    return scanId;
  }

  private initializeScanPhases(): ScanPhase[] {
    return [
      {
        name: "reconnaissance",
        description: "Target reconnaissance and information gathering",
        progress: 0,
        status: "pending",
      },
      {
        name: "port_scan",
        description: "Port scanning and service discovery",
        progress: 0,
        status: "pending",
      },
      {
        name: "subdomain_enum",
        description: "Subdomain enumeration and DNS analysis",
        progress: 0,
        status: "pending",
      },
      {
        name: "directory_scan",
        description: "Directory and file discovery",
        progress: 0,
        status: "pending",
      },
      {
        name: "tech_detection",
        description: "Technology fingerprinting",
        progress: 0,
        status: "pending",
      },
      {
        name: "ssl_analysis",
        description: "SSL/TLS configuration analysis",
        progress: 0,
        status: "pending",
      },
      {
        name: "form_analysis",
        description: "Form discovery and analysis",
        progress: 0,
        status: "pending",
      },
      {
        name: "sqli_test",
        description: "SQL injection vulnerability testing",
        progress: 0,
        status: "pending",
      },
      {
        name: "xss_test",
        description: "Cross-site scripting (XSS) testing",
        progress: 0,
        status: "pending",
      },
      {
        name: "csrf_test",
        description: "Cross-site request forgery testing",
        progress: 0,
        status: "pending",
      },
      {
        name: "auth_test",
        description: "Authentication and authorization testing",
        progress: 0,
        status: "pending",
      },
      {
        name: "file_inclusion",
        description: "File inclusion vulnerability testing",
        progress: 0,
        status: "pending",
      },
      {
        name: "command_injection",
        description: "Command injection testing",
        progress: 0,
        status: "pending",
      },
      {
        name: "xxe_test",
        description: "XML external entity (XXE) testing",
        progress: 0,
        status: "pending",
      },
      {
        name: "idor_test",
        description: "Insecure direct object reference testing",
        progress: 0,
        status: "pending",
      },
      {
        name: "security_headers",
        description: "Security headers analysis",
        progress: 0,
        status: "pending",
      },
      {
        name: "cookie_analysis",
        description: "Cookie security analysis",
        progress: 0,
        status: "pending",
      },
      {
        name: "rate_limiting",
        description: "Rate limiting and DoS testing",
        progress: 0,
        status: "pending",
      },
      {
        name: "api_testing",
        description: "API security testing",
        progress: 0,
        status: "pending",
      },
      {
        name: "final_analysis",
        description: "Risk assessment and report generation",
        progress: 0,
        status: "pending",
      },
    ];
  }

  private async performComprehensiveScan(scanId: string) {
    const scan = this.activeScans.get(scanId);
    if (!scan) return;

    scan.status = "scanning";
    this.notifyListeners(scan);

    try {
      for (let i = 0; i < scan.phases.length; i++) {
        const phase = scan.phases[i];

        // Update phase status
        phase.status = "running";
        scan.currentPhase = phase.name;
        scan.progress = Math.round((i / scan.phases.length) * 100);
        this.notifyPhaseListeners(scanId, phase);
        this.notifyListeners(scan);

        // Simulate phase execution
        const startTime = Date.now();
        await this.executePhase(scanId, phase);
        phase.duration = Date.now() - startTime;
        phase.status = "completed";
        phase.progress = 100;

        this.notifyPhaseListeners(scanId, phase);
        this.notifyListeners(scan);

        // Small delay between phases
        await this.delay(500);
      }

      // Complete scan
      scan.status = "completed";
      scan.endTime = new Date();
      scan.progress = 100;
      scan.currentPhase = undefined;

      // Calculate final statistics
      this.calculateFinalStatistics(scan);
      this.notifyListeners(scan);
    } catch (error) {
      scan.status = "failed";
      this.notifyListeners(scan);
    }
  }

  private async executePhase(scanId: string, phase: ScanPhase) {
    const scan = this.activeScans.get(scanId);
    if (!scan) return;

    const baseDelay = 1000 + Math.random() * 2000; // 1-3 seconds per phase

    switch (phase.name) {
      case "reconnaissance":
        await this.delay(baseDelay);
        scan.results.headers = this.simulateHeaderAnalysis();
        phase.findings = Object.keys(scan.results.headers).length;
        break;

      case "port_scan":
        await this.delay(baseDelay * 1.5);
        scan.results.openPorts = this.simulatePortScan();
        phase.findings = scan.results.openPorts.length;
        break;

      case "subdomain_enum":
        await this.delay(baseDelay * 2);
        scan.results.subdomains = this.simulateSubdomainEnum(scan.target);
        phase.findings = scan.results.subdomains.length;
        break;

      case "directory_scan":
        await this.delay(baseDelay * 1.8);
        scan.results.directories = this.simulateDirectoryScan();
        phase.findings = scan.results.directories.length;
        break;

      case "tech_detection":
        await this.delay(baseDelay);
        scan.results.technologies = this.simulateTechDetection();
        phase.findings = scan.results.technologies.length;
        break;

      case "ssl_analysis":
        await this.delay(baseDelay);
        scan.results.ssl = this.simulateSSLAnalysis();
        phase.findings = scan.results.ssl.enabled ? 1 : 0;
        break;

      case "form_analysis":
        await this.delay(baseDelay);
        scan.results.forms = this.simulateFormDiscovery();
        phase.findings = scan.results.forms.length;
        break;

      case "sqli_test":
        await this.delay(baseDelay * 2);
        const sqlVulns = this.simulateSQLInjectionTest();
        scan.results.vulnerabilities.push(...sqlVulns);
        phase.findings = sqlVulns.length;
        break;

      case "xss_test":
        await this.delay(baseDelay * 1.5);
        const xssVulns = this.simulateXSSTest();
        scan.results.vulnerabilities.push(...xssVulns);
        phase.findings = xssVulns.length;
        break;

      case "csrf_test":
        await this.delay(baseDelay);
        const csrfVulns = this.simulateCSRFTest();
        scan.results.vulnerabilities.push(...csrfVulns);
        phase.findings = csrfVulns.length;
        break;

      case "auth_test":
        await this.delay(baseDelay * 1.2);
        const authVulns = this.simulateAuthTest();
        scan.results.vulnerabilities.push(...authVulns);
        phase.findings = authVulns.length;
        break;

      case "file_inclusion":
        await this.delay(baseDelay);
        const lfiVulns = this.simulateFileInclusionTest();
        scan.results.vulnerabilities.push(...lfiVulns);
        phase.findings = lfiVulns.length;
        break;

      case "command_injection":
        await this.delay(baseDelay);
        const cmdVulns = this.simulateCommandInjectionTest();
        scan.results.vulnerabilities.push(...cmdVulns);
        phase.findings = cmdVulns.length;
        break;

      case "security_headers":
        await this.delay(baseDelay * 0.5);
        const headerVulns = this.simulateSecurityHeadersTest();
        scan.results.vulnerabilities.push(...headerVulns);
        phase.findings = headerVulns.length;
        break;

      case "cookie_analysis":
        await this.delay(baseDelay * 0.5);
        scan.results.cookies = this.simulateCookieAnalysis();
        const cookieVulns = this.simulateCookieVulnerabilities();
        scan.results.vulnerabilities.push(...cookieVulns);
        phase.findings = cookieVulns.length;
        break;

      default:
        await this.delay(baseDelay);
        phase.findings = Math.floor(Math.random() * 3);
        break;
    }

    scan.statistics.totalFindings += phase.findings || 0;
    scan.statistics.totalRequests += Math.floor(Math.random() * 50) + 10;
  }

  private simulateHeaderAnalysis(): Record<string, string> {
    return {
      Server: "nginx/1.18.0 (Ubuntu)",
      "X-Powered-By": "PHP/7.4.3",
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "no-cache, must-revalidate",
      "Set-Cookie": "PHPSESSID=abc123; path=/",
    };
  }

  private simulatePortScan() {
    const ports = [
      {
        port: 22,
        service: "ssh",
        version: "OpenSSH 8.2p1",
        banner: "SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.5",
      },
      {
        port: 80,
        service: "http",
        version: "nginx 1.18.0",
        banner: "nginx/1.18.0 (Ubuntu)",
      },
      {
        port: 443,
        service: "https",
        version: "nginx 1.18.0",
        banner: "nginx/1.18.0 (Ubuntu)",
      },
      {
        port: 3306,
        service: "mysql",
        version: "MySQL 8.0.28",
        banner: "MySQL 8.0.28-0ubuntu0.20.04.3",
      },
    ];

    return ports.filter(() => Math.random() > 0.3);
  }

  private simulateSubdomainEnum(target: string) {
    const domain = target.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const subdomains = [
      "www",
      "api",
      "admin",
      "staging",
      "dev",
      "blog",
      "mail",
      "ftp",
    ];

    return subdomains
      .filter(() => Math.random() > 0.5)
      .map((sub) => ({
        domain: `${sub}.${domain}`,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        status: Math.random() > 0.8 ? "unreachable" : "active",
      }));
  }

  private simulateDirectoryScan() {
    const directories = [
      { path: "/admin", status: 200, size: 1024 },
      { path: "/wp-admin", status: 403 },
      { path: "/api", status: 200, size: 512 },
      { path: "/backup", status: 403 },
      { path: "/config", status: 404 },
      { path: "/uploads", status: 200, size: 2048 },
      { path: "/.git", status: 403 },
      { path: "/phpmyadmin", status: 200, size: 4096 },
    ];

    return directories.filter(() => Math.random() > 0.4);
  }

  private simulateTechDetection() {
    const technologies = [
      { name: "nginx", version: "1.18.0", categories: ["Web Servers"] },
      { name: "PHP", version: "7.4.3", categories: ["Programming Languages"] },
      { name: "MySQL", version: "8.0.28", categories: ["Databases"] },
      {
        name: "jQuery",
        version: "3.6.0",
        categories: ["JavaScript Libraries"],
      },
      { name: "Bootstrap", version: "4.6.0", categories: ["UI Frameworks"] },
      { name: "WordPress", version: "5.8.1", categories: ["CMS"] },
    ];

    return technologies.filter(() => Math.random() > 0.4);
  }

  private simulateSSLAnalysis() {
    return {
      enabled: true,
      version: "TLSv1.3",
      cipher: "TLS_AES_256_GCM_SHA384",
      certificate: {
        issuer: "Let's Encrypt Authority X3",
        subject: "example.com",
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        selfSigned: false,
      },
    };
  }

  private simulateFormDiscovery() {
    return [
      {
        action: "/login",
        method: "POST",
        inputs: ["username", "password", "csrf_token"],
      },
      {
        action: "/contact",
        method: "POST",
        inputs: ["name", "email", "message"],
      },
      { action: "/search", method: "GET", inputs: ["q"] },
      { action: "/upload", method: "POST", inputs: ["file", "description"] },
    ];
  }

  private simulateSQLInjectionTest(): DetailedVulnerability[] {
    if (Math.random() > 0.7) return [];

    return [
      {
        id: `vuln_sqli_${Date.now()}`,
        severity: "high",
        title: "SQL Injection in Login Form",
        description:
          "The application is vulnerable to SQL injection attacks through the username parameter in the login form.",
        category: "Injection",
        cve: "CWE-89",
        cvss: 8.1,
        paths: [
          {
            path: "/login",
            method: "POST",
            parameters: ["username"],
            evidence: "SQL error: 'You have an error in your SQL syntax'",
            request:
              "POST /login HTTP/1.1\nContent-Type: application/x-www-form-urlencoded\n\nusername=admin'&password=test",
            response:
              "HTTP/1.1 500 Internal Server Error\nSQL error: You have an error in your SQL syntax",
          },
        ],
        remediation:
          "Use parameterized queries or prepared statements to prevent SQL injection.",
        references: ["https://owasp.org/www-community/attacks/SQL_Injection"],
        impact:
          "Attackers could potentially access, modify, or delete database contents.",
        likelihood: "high",
        confidence: "certain",
      },
    ];
  }

  private simulateXSSTest(): DetailedVulnerability[] {
    if (Math.random() > 0.6) return [];

    return [
      {
        id: `vuln_xss_${Date.now()}`,
        severity: "medium",
        title: "Reflected Cross-Site Scripting (XSS)",
        description:
          "The search parameter reflects user input without proper encoding, allowing XSS attacks.",
        category: "Cross-Site Scripting",
        cve: "CWE-79",
        cvss: 6.1,
        paths: [
          {
            path: "/search",
            method: "GET",
            parameters: ["q"],
            evidence:
              "<script>alert('XSS')</script> was reflected in the response",
            request: "GET /search?q=<script>alert('XSS')</script> HTTP/1.1",
            response:
              "HTTP/1.1 200 OK\nResults for: <script>alert('XSS')</script>",
          },
        ],
        remediation: "Implement proper input validation and output encoding.",
        references: ["https://owasp.org/www-community/attacks/xss/"],
        impact:
          "Attackers could execute malicious scripts in victims' browsers.",
        likelihood: "medium",
        confidence: "firm",
      },
    ];
  }

  private simulateCSRFTest(): DetailedVulnerability[] {
    if (Math.random() > 0.5) return [];

    return [
      {
        id: `vuln_csrf_${Date.now()}`,
        severity: "medium",
        title: "Cross-Site Request Forgery (CSRF)",
        description:
          "The application does not implement CSRF protection tokens.",
        category: "Cross-Site Request Forgery",
        cve: "CWE-352",
        cvss: 5.4,
        paths: [
          {
            path: "/profile/update",
            method: "POST",
            parameters: ["email", "name"],
            evidence: "No CSRF token found in form or request headers",
            request:
              "POST /profile/update HTTP/1.1\nContent-Type: application/x-www-form-urlencoded\n\nemail=new@example.com",
            response: "HTTP/1.1 200 OK\nProfile updated successfully",
          },
        ],
        remediation: "Implement CSRF tokens for all state-changing operations.",
        references: ["https://owasp.org/www-community/attacks/csrf"],
        impact:
          "Attackers could perform unauthorized actions on behalf of authenticated users.",
        likelihood: "medium",
        confidence: "firm",
      },
    ];
  }

  private simulateAuthTest(): DetailedVulnerability[] {
    const vulns: DetailedVulnerability[] = [];

    if (Math.random() > 0.8) {
      vulns.push({
        id: `vuln_auth_${Date.now()}`,
        severity: "high",
        title: "Weak Password Policy",
        description:
          "The application accepts weak passwords with insufficient complexity requirements.",
        category: "Authentication",
        cve: "CWE-521",
        cvss: 7.5,
        paths: [
          {
            path: "/register",
            method: "POST",
            parameters: ["password"],
            evidence: "Password '123456' was accepted",
            request:
              "POST /register HTTP/1.1\nContent-Type: application/x-www-form-urlencoded\n\nusername=test&password=123456",
            response: "HTTP/1.1 200 OK\nAccount created successfully",
          },
        ],
        remediation:
          "Implement strong password policies requiring minimum length, complexity, and entropy.",
        references: [
          "https://owasp.org/www-community/controls/Password_Authentication",
        ],
        impact:
          "Accounts could be compromised through brute force or dictionary attacks.",
        likelihood: "high",
        confidence: "certain",
      });
    }

    return vulns;
  }

  private simulateFileInclusionTest(): DetailedVulnerability[] {
    if (Math.random() > 0.9) return [];

    return [
      {
        id: `vuln_lfi_${Date.now()}`,
        severity: "high",
        title: "Local File Inclusion (LFI)",
        description:
          "The file parameter allows reading arbitrary files from the server filesystem.",
        category: "File Inclusion",
        cve: "CWE-22",
        cvss: 7.5,
        paths: [
          {
            path: "/download",
            method: "GET",
            parameters: ["file"],
            evidence: "Contents of /etc/passwd were returned",
            request: "GET /download?file=../../../etc/passwd HTTP/1.1",
            response: "HTTP/1.1 200 OK\nroot:x:0:0:root:/root:/bin/bash\n...",
          },
        ],
        remediation:
          "Implement proper input validation and use whitelisting for allowed files.",
        references: ["https://owasp.org/www-community/attacks/Path_Traversal"],
        impact: "Attackers could read sensitive files from the server.",
        likelihood: "medium",
        confidence: "certain",
      },
    ];
  }

  private simulateCommandInjectionTest(): DetailedVulnerability[] {
    if (Math.random() > 0.95) return [];

    return [
      {
        id: `vuln_cmd_${Date.now()}`,
        severity: "critical",
        title: "OS Command Injection",
        description:
          "The ping functionality allows execution of arbitrary system commands.",
        category: "Command Injection",
        cve: "CWE-78",
        cvss: 9.8,
        paths: [
          {
            path: "/ping",
            method: "POST",
            parameters: ["host"],
            evidence: "System command output was returned",
            request:
              "POST /ping HTTP/1.1\nContent-Type: application/x-www-form-urlencoded\n\nhost=8.8.8.8;cat /etc/passwd",
            response:
              "HTTP/1.1 200 OK\nPING 8.8.8.8\nroot:x:0:0:root:/root:/bin/bash",
          },
        ],
        remediation:
          "Use safe APIs for system operations and validate all user inputs.",
        references: [
          "https://owasp.org/www-community/attacks/Command_Injection",
        ],
        impact: "Attackers could execute arbitrary commands on the server.",
        likelihood: "high",
        confidence: "certain",
      },
    ];
  }

  private simulateSecurityHeadersTest(): DetailedVulnerability[] {
    const vulns: DetailedVulnerability[] = [];

    if (Math.random() > 0.3) {
      vulns.push({
        id: `vuln_headers_${Date.now()}`,
        severity: "low",
        title: "Missing Security Headers",
        description: "The application is missing important security headers.",
        category: "Security Misconfiguration",
        cve: "CWE-16",
        cvss: 3.7,
        paths: [
          {
            path: "/",
            method: "GET",
            parameters: [],
            evidence:
              "Missing headers: X-Content-Type-Options, X-Frame-Options, Content-Security-Policy",
            request: "GET / HTTP/1.1",
            response:
              "HTTP/1.1 200 OK\nContent-Type: text/html\n(missing security headers)",
          },
        ],
        remediation:
          "Implement security headers: X-Content-Type-Options, X-Frame-Options, CSP, etc.",
        references: ["https://owasp.org/www-project-secure-headers/"],
        impact: "Increased risk of various client-side attacks.",
        likelihood: "medium",
        confidence: "certain",
      });
    }

    return vulns;
  }

  private simulateCookieAnalysis() {
    return [
      { name: "PHPSESSID", secure: false, httpOnly: true, sameSite: "Lax" },
      { name: "remember_token", secure: false, httpOnly: false },
      { name: "_analytics", secure: true, httpOnly: false, sameSite: "None" },
    ];
  }

  private simulateCookieVulnerabilities(): DetailedVulnerability[] {
    const vulns: DetailedVulnerability[] = [];

    if (Math.random() > 0.4) {
      vulns.push({
        id: `vuln_cookie_${Date.now()}`,
        severity: "medium",
        title: "Insecure Cookie Configuration",
        description: "Session cookies are not properly secured.",
        category: "Session Management",
        cve: "CWE-614",
        cvss: 5.3,
        paths: [
          {
            path: "/login",
            method: "POST",
            parameters: [],
            evidence: "PHPSESSID cookie missing 'Secure' flag",
            request: "POST /login HTTP/1.1",
            response: "HTTP/1.1 200 OK\nSet-Cookie: PHPSESSID=abc123; HttpOnly",
          },
        ],
        remediation: "Set Secure and SameSite flags on session cookies.",
        references: [
          "https://owasp.org/www-community/controls/SecureCookieAttribute",
        ],
        impact:
          "Session tokens could be intercepted over unencrypted connections.",
        likelihood: "medium",
        confidence: "certain",
      });
    }

    return vulns;
  }

  private calculateFinalStatistics(scan: ComprehensiveScanResult) {
    const criticalCount = scan.results.vulnerabilities.filter(
      (v) => v.severity === "critical",
    ).length;
    const highCount = scan.results.vulnerabilities.filter(
      (v) => v.severity === "high",
    ).length;
    const mediumCount = scan.results.vulnerabilities.filter(
      (v) => v.severity === "medium",
    ).length;
    const lowCount = scan.results.vulnerabilities.filter(
      (v) => v.severity === "low",
    ).length;

    // Calculate risk level
    if (criticalCount > 0) {
      scan.statistics.riskLevel = "critical";
    } else if (highCount > 0) {
      scan.statistics.riskLevel = "high";
    } else if (mediumCount > 0) {
      scan.statistics.riskLevel = "medium";
    } else {
      scan.statistics.riskLevel = "low";
    }

    // Calculate security score
    const penalties =
      criticalCount * 30 + highCount * 15 + mediumCount * 5 + lowCount * 1;
    scan.statistics.score = Math.max(0, 100 - penalties);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private notifyListeners(scan: ComprehensiveScanResult) {
    this.listeners.forEach((listener) => listener(scan));
  }

  private notifyPhaseListeners(scanId: string, phase: ScanPhase) {
    this.phaseListeners.forEach((listener) => listener(scanId, phase));
  }

  getScan(scanId: string): ComprehensiveScanResult | undefined {
    return this.activeScans.get(scanId);
  }

  getAllScans(): ComprehensiveScanResult[] {
    return Array.from(this.activeScans.values());
  }

  pauseScan(scanId: string): boolean {
    const scan = this.activeScans.get(scanId);
    if (scan && scan.status === "scanning") {
      scan.status = "paused";
      this.notifyListeners(scan);
      return true;
    }
    return false;
  }

  stopScan(scanId: string): boolean {
    const scan = this.activeScans.get(scanId);
    if (scan && (scan.status === "scanning" || scan.status === "paused")) {
      scan.status = "failed";
      scan.endTime = new Date();
      this.notifyListeners(scan);
      return true;
    }
    return false;
  }
}

export const advancedScanningService = new AdvancedScanningService();
