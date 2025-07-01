export interface SubdomainResult {
  subdomain: string;
  ip: string[];
  status: "active" | "inactive" | "timeout" | "unknown";
  ports: number[];
  technologies: string[];
  certificates: CertificateInfo[];
  vulnerabilities: string[];
  httpStatus?: number;
  responseTime?: number;
  lastChecked: Date;
}

export interface CertificateInfo {
  issuer: string;
  subject: string;
  validFrom: Date;
  validTo: Date;
  fingerprint: string;
  selfSigned: boolean;
}

export interface SubdomainEnumeration {
  id: string;
  target: string;
  status: "running" | "completed" | "failed" | "paused";
  progress: number;
  startTime: Date;
  endTime?: Date;
  totalFound: number;
  activeSubdomains: number;
  techniques: string[];
  results: SubdomainResult[];
  currentTechnique?: string;
}

class SubdomainService {
  private activeEnumerations = new Map<string, SubdomainEnumeration>();
  private listeners = new Set<(enumeration: SubdomainEnumeration) => void>();

  onEnumerationUpdate(callback: (enumeration: SubdomainEnumeration) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  async startSubdomainEnumeration(target: string): Promise<string> {
    const enumerationId = `subenum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const enumeration: SubdomainEnumeration = {
      id: enumerationId,
      target: this.cleanTarget(target),
      status: "running",
      progress: 0,
      startTime: new Date(),
      totalFound: 0,
      activeSubdomains: 0,
      techniques: [
        "Certificate Transparency",
        "DNS Brute Force",
        "Search Engine Dorking",
        "DNS Zone Transfer",
        "Reverse DNS",
        "Subdomain Takeover Check",
        "Permutation Analysis",
        "Archive Crawling",
      ],
      results: [],
    };

    this.activeEnumerations.set(enumerationId, enumeration);
    this.notifyListeners(enumeration);

    // Start enumeration process
    this.performEnumeration(enumerationId);

    return enumerationId;
  }

  private async performEnumeration(enumerationId: string) {
    const enumeration = this.activeEnumerations.get(enumerationId);
    if (!enumeration) return;

    try {
      const techniques = [
        {
          name: "Certificate Transparency",
          method: this.certificateTransparency,
        },
        { name: "DNS Brute Force", method: this.dnsBruteForce },
        { name: "Search Engine Dorking", method: this.searchEngineDorking },
        { name: "DNS Zone Transfer", method: this.dnsZoneTransfer },
        { name: "Reverse DNS", method: this.reverseDns },
        {
          name: "Subdomain Takeover Check",
          method: this.subdomainTakeoverCheck,
        },
        { name: "Permutation Analysis", method: this.permutationAnalysis },
        { name: "Archive Crawling", method: this.archiveCrawling },
      ];

      for (let i = 0; i < techniques.length; i++) {
        const technique = techniques[i];
        enumeration.currentTechnique = technique.name;
        enumeration.progress = Math.round((i / techniques.length) * 100);
        this.notifyListeners(enumeration);

        // Execute technique
        const newResults = await technique.method.call(
          this,
          enumeration.target,
        );

        // Merge results without duplicates
        newResults.forEach((result) => {
          const existing = enumeration.results.find(
            (r) => r.subdomain === result.subdomain,
          );
          if (!existing) {
            enumeration.results.push(result);
          } else {
            // Merge data from multiple techniques
            existing.ip = [...new Set([...existing.ip, ...result.ip])];
            existing.ports = [...new Set([...existing.ports, ...result.ports])];
            existing.technologies = [
              ...new Set([...existing.technologies, ...result.technologies]),
            ];
            existing.vulnerabilities = [
              ...new Set([
                ...existing.vulnerabilities,
                ...result.vulnerabilities,
              ]),
            ];
          }
        });

        enumeration.totalFound = enumeration.results.length;
        enumeration.activeSubdomains = enumeration.results.filter(
          (r) => r.status === "active",
        ).length;

        this.notifyListeners(enumeration);

        // Delay between techniques
        await this.delay(1000 + Math.random() * 2000);
      }

      // Complete enumeration
      enumeration.status = "completed";
      enumeration.endTime = new Date();
      enumeration.progress = 100;
      enumeration.currentTechnique = undefined;

      // Final validation and deep scan of found subdomains
      await this.performDeepScan(enumeration);

      this.notifyListeners(enumeration);
    } catch (error) {
      enumeration.status = "failed";
      enumeration.endTime = new Date();
      this.notifyListeners(enumeration);
    }
  }

  private async certificateTransparency(
    target: string,
  ): Promise<SubdomainResult[]> {
    await this.delay(2000);

    // Simulate CT log search
    const ctSubdomains = [
      "www",
      "api",
      "mail",
      "ftp",
      "admin",
      "test",
      "staging",
      "dev",
      "app",
      "portal",
      "secure",
      "vpn",
      "cdn",
      "blog",
    ];

    return ctSubdomains
      .filter(() => Math.random() > 0.4)
      .map((sub) => this.createSubdomainResult(`${sub}.${target}`));
  }

  private async dnsBruteForce(target: string): Promise<SubdomainResult[]> {
    await this.delay(3000);

    // Common subdomain wordlist
    const commonSubs = [
      "mail",
      "remote",
      "blog",
      "webmail",
      "server",
      "ns1",
      "ns2",
      "smtp",
      "secure",
      "vpn",
      "m",
      "shop",
      "ftp",
      "cpanel",
      "whm",
    ];

    return commonSubs
      .filter(() => Math.random() > 0.6)
      .map((sub) => this.createSubdomainResult(`${sub}.${target}`));
  }

  private async searchEngineDorking(
    target: string,
  ): Promise<SubdomainResult[]> {
    await this.delay(1500);

    // Simulate search engine results
    const searchResults = [
      "support",
      "help",
      "docs",
      "download",
      "upload",
      "files",
      "images",
      "static",
      "assets",
      "cdn",
    ];

    return searchResults
      .filter(() => Math.random() > 0.7)
      .map((sub) => this.createSubdomainResult(`${sub}.${target}`));
  }

  private async dnsZoneTransfer(target: string): Promise<SubdomainResult[]> {
    await this.delay(1000);

    // Usually fails, but sometimes reveals internal subdomains
    if (Math.random() > 0.9) {
      const internalSubs = ["internal", "intranet", "corp", "lan"];
      return internalSubs.map((sub) =>
        this.createSubdomainResult(`${sub}.${target}`),
      );
    }

    return [];
  }

  private async reverseDns(target: string): Promise<SubdomainResult[]> {
    await this.delay(2500);

    // Simulate reverse DNS enumeration
    const reverseSubs = ["mx", "ns", "gateway", "router", "switch"];

    return reverseSubs
      .filter(() => Math.random() > 0.8)
      .map((sub) => this.createSubdomainResult(`${sub}.${target}`));
  }

  private async subdomainTakeoverCheck(
    target: string,
  ): Promise<SubdomainResult[]> {
    await this.delay(1800);

    // Check for vulnerable subdomains
    const vulnerableSubs = ["old", "legacy", "abandoned", "temp"];

    return vulnerableSubs
      .filter(() => Math.random() > 0.95)
      .map((sub) => {
        const result = this.createSubdomainResult(`${sub}.${target}`);
        result.vulnerabilities.push("Potential Subdomain Takeover");
        result.status = "inactive";
        return result;
      });
  }

  private async permutationAnalysis(
    target: string,
  ): Promise<SubdomainResult[]> {
    await this.delay(2200);

    // Generate permutations based on target
    const baseName = target.split(".")[0];
    const permutations = [
      `${baseName}-dev`,
      `${baseName}-test`,
      `${baseName}-staging`,
      `${baseName}2`,
      `new-${baseName}`,
      `old-${baseName}`,
    ];

    return permutations
      .filter(() => Math.random() > 0.8)
      .map((sub) =>
        this.createSubdomainResult(
          `${sub}.${target.substring(target.indexOf(".") + 1)}`,
        ),
      );
  }

  private async archiveCrawling(target: string): Promise<SubdomainResult[]> {
    await this.delay(1600);

    // Simulate archive.org crawling
    const archiveFinds = ["beta", "preview", "demo", "sandbox", "research"];

    return archiveFinds
      .filter(() => Math.random() > 0.75)
      .map((sub) => this.createSubdomainResult(`${sub}.${target}`));
  }

  private async performDeepScan(enumeration: SubdomainEnumeration) {
    // Perform detailed analysis of found subdomains
    for (const result of enumeration.results) {
      if (result.status === "active") {
        // Simulate port scanning
        result.ports = this.generatePorts();

        // Simulate technology detection
        result.technologies = this.generateTechnologies();

        // Simulate vulnerability scanning
        if (Math.random() > 0.7) {
          result.vulnerabilities.push(...this.generateVulnerabilities());
        }

        // Simulate certificate analysis
        if (result.ports.includes(443)) {
          result.certificates = [this.generateCertificate(result.subdomain)];
        }
      }
    }
  }

  private createSubdomainResult(subdomain: string): SubdomainResult {
    const isActive = Math.random() > 0.2;

    return {
      subdomain,
      ip: isActive ? [this.generateIP()] : [],
      status: isActive ? "active" : "inactive",
      ports: isActive ? this.generatePorts() : [],
      technologies: isActive ? this.generateTechnologies() : [],
      certificates: [],
      vulnerabilities: [],
      httpStatus: isActive ? (Math.random() > 0.1 ? 200 : 404) : undefined,
      responseTime: isActive ? Math.round(50 + Math.random() * 500) : undefined,
      lastChecked: new Date(),
    };
  }

  private generateIP(): string {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  }

  private generatePorts(): number[] {
    const commonPorts = [
      80, 443, 22, 21, 25, 53, 110, 143, 993, 995, 8080, 8443,
    ];
    return commonPorts.filter(() => Math.random() > 0.7);
  }

  private generateTechnologies(): string[] {
    const techs = [
      "nginx",
      "Apache",
      "Cloudflare",
      "jQuery",
      "React",
      "Node.js",
      "PHP",
      "MySQL",
    ];
    return techs.filter(() => Math.random() > 0.6);
  }

  private generateVulnerabilities(): string[] {
    const vulns = [
      "Missing HSTS Header",
      "Weak SSL Configuration",
      "Directory Listing Enabled",
      "Information Disclosure",
      "Outdated Software Version",
    ];
    return vulns.filter(() => Math.random() > 0.5);
  }

  private generateCertificate(subdomain: string): CertificateInfo {
    const now = new Date();
    const validFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const validTo = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    return {
      issuer: "Let's Encrypt Authority X3",
      subject: subdomain,
      validFrom,
      validTo,
      fingerprint: Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join(""),
      selfSigned: Math.random() > 0.9,
    };
  }

  private cleanTarget(target: string): string {
    return target.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private notifyListeners(enumeration: SubdomainEnumeration) {
    this.listeners.forEach((listener) => listener(enumeration));
  }

  getEnumeration(id: string): SubdomainEnumeration | undefined {
    return this.activeEnumerations.get(id);
  }

  getAllEnumerations(): SubdomainEnumeration[] {
    return Array.from(this.activeEnumerations.values());
  }

  pauseEnumeration(id: string): boolean {
    const enumeration = this.activeEnumerations.get(id);
    if (enumeration && enumeration.status === "running") {
      enumeration.status = "paused";
      this.notifyListeners(enumeration);
      return true;
    }
    return false;
  }

  stopEnumeration(id: string): boolean {
    const enumeration = this.activeEnumerations.get(id);
    if (
      enumeration &&
      (enumeration.status === "running" || enumeration.status === "paused")
    ) {
      enumeration.status = "failed";
      enumeration.endTime = new Date();
      this.notifyListeners(enumeration);
      return true;
    }
    return false;
  }
}

export const subdomainService = new SubdomainService();
