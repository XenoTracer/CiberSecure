export interface ReportData {
  id: string;
  title: string;
  target: string;
  generatedAt: Date;
  reportType: "vulnerability" | "subdomain" | "comprehensive" | "executive";
  executiveSummary: ExecutiveSummary;
  scanDetails: ScanDetails;
  vulnerabilities: VulnerabilitySection;
  subdomains: SubdomainSection;
  recommendations: Recommendation[];
  appendices: Appendix[];
}

export interface ExecutiveSummary {
  riskLevel: "low" | "medium" | "high" | "critical";
  score: number;
  totalVulnerabilities: number;
  criticalFindings: number;
  keyFindings: string[];
  businessImpact: string;
  timeToRemediate: string;
}

export interface ScanDetails {
  scope: string[];
  methodology: string[];
  tools: string[];
  duration: string;
  coverage: string;
  limitations: string[];
}

export interface VulnerabilitySection {
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  findings: DetailedFinding[];
  trends: {
    mostCommon: string;
    riskiest: string;
    easiestToFix: string;
  };
}

export interface SubdomainSection {
  total: number;
  active: number;
  inactive: number;
  vulnerableToTakeover: number;
  findings: {
    subdomain: string;
    status: string;
    risks: string[];
    technologies: string[];
  }[];
}

export interface DetailedFinding {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  cvss: number;
  cve?: string;
  description: string;
  technicalDetails: string;
  proofOfConcept: string;
  impact: string;
  remediation: string;
  references: string[];
  affectedAssets: string[];
  timeline: string;
}

export interface Recommendation {
  priority: "immediate" | "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  effort: "low" | "medium" | "high";
  cost: "low" | "medium" | "high";
  timeline: string;
  businessValue: string;
}

export interface Appendix {
  title: string;
  content: string;
  type: "technical" | "evidence" | "methodology" | "tools";
}

class ReportService {
  private reports = new Map<string, ReportData>();

  async generateVulnerabilityReport(
    scanData: any,
    target: string,
  ): Promise<string> {
    const reportId = `vuln_report_${Date.now()}`;

    const report: ReportData = {
      id: reportId,
      title: `Vulnerability Assessment Report - ${target}`,
      target,
      generatedAt: new Date(),
      reportType: "vulnerability",
      executiveSummary: this.generateExecutiveSummary(scanData),
      scanDetails: this.generateScanDetails(scanData),
      vulnerabilities: this.generateVulnerabilitySection(scanData),
      subdomains: this.generateSubdomainSection([]),
      recommendations: this.generateRecommendations(scanData),
      appendices: this.generateAppendices(scanData),
    };

    this.reports.set(reportId, report);
    return reportId;
  }

  async generateSubdomainReport(
    enumerationData: any,
    target: string,
  ): Promise<string> {
    const reportId = `subdomain_report_${Date.now()}`;

    const report: ReportData = {
      id: reportId,
      title: `Subdomain Enumeration Report - ${target}`,
      target,
      generatedAt: new Date(),
      reportType: "subdomain",
      executiveSummary: this.generateSubdomainExecutiveSummary(enumerationData),
      scanDetails: this.generateSubdomainScanDetails(enumerationData),
      vulnerabilities: {
        summary: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
        findings: [],
        trends: { mostCommon: "", riskiest: "", easiestToFix: "" },
      },
      subdomains: this.generateSubdomainSection(enumerationData),
      recommendations: this.generateSubdomainRecommendations(enumerationData),
      appendices: this.generateSubdomainAppendices(enumerationData),
    };

    this.reports.set(reportId, report);
    return reportId;
  }

  async generateComprehensiveReport(
    scanData: any,
    enumerationData: any,
    target: string,
  ): Promise<string> {
    const reportId = `comprehensive_report_${Date.now()}`;

    const report: ReportData = {
      id: reportId,
      title: `Comprehensive Security Assessment - ${target}`,
      target,
      generatedAt: new Date(),
      reportType: "comprehensive",
      executiveSummary: this.generateComprehensiveExecutiveSummary(
        scanData,
        enumerationData,
      ),
      scanDetails: this.generateComprehensiveScanDetails(
        scanData,
        enumerationData,
      ),
      vulnerabilities: this.generateVulnerabilitySection(scanData),
      subdomains: this.generateSubdomainSection(enumerationData),
      recommendations: this.generateComprehensiveRecommendations(
        scanData,
        enumerationData,
      ),
      appendices: this.generateComprehensiveAppendices(
        scanData,
        enumerationData,
      ),
    };

    this.reports.set(reportId, report);
    return reportId;
  }

  async exportToPDF(reportId: string): Promise<Blob> {
    const report = this.reports.get(reportId);
    if (!report) throw new Error("Report not found");

    // Simulate PDF generation
    const pdfContent = this.generatePDFContent(report);
    return new Blob([pdfContent], { type: "application/pdf" });
  }

  async exportToJSON(reportId: string): Promise<Blob> {
    const report = this.reports.get(reportId);
    if (!report) throw new Error("Report not found");

    const jsonContent = JSON.stringify(report, null, 2);
    return new Blob([jsonContent], { type: "application/json" });
  }

  async exportToHTML(reportId: string): Promise<Blob> {
    const report = this.reports.get(reportId);
    if (!report) throw new Error("Report not found");

    const htmlContent = this.generateHTMLReport(report);
    return new Blob([htmlContent], { type: "text/html" });
  }

  getReport(reportId: string): ReportData | undefined {
    return this.reports.get(reportId);
  }

  private generateExecutiveSummary(scanData: any): ExecutiveSummary {
    const vulnerabilities = scanData?.results?.vulnerabilities || [];
    const critical = vulnerabilities.filter(
      (v: any) => v.severity === "critical",
    ).length;
    const high = vulnerabilities.filter(
      (v: any) => v.severity === "high",
    ).length;

    let riskLevel: "low" | "medium" | "high" | "critical" = "low";
    if (critical > 0) riskLevel = "critical";
    else if (high > 0) riskLevel = "high";
    else if (vulnerabilities.length > 5) riskLevel = "medium";

    return {
      riskLevel,
      score: scanData?.statistics?.score || 85,
      totalVulnerabilities: vulnerabilities.length,
      criticalFindings: critical,
      keyFindings: this.extractKeyFindings(vulnerabilities),
      businessImpact: this.assessBusinessImpact(riskLevel, vulnerabilities),
      timeToRemediate: this.estimateRemediationTime(vulnerabilities),
    };
  }

  private generateSubdomainExecutiveSummary(
    enumerationData: any,
  ): ExecutiveSummary {
    const results = enumerationData?.results || [];
    const vulnerable = results.filter(
      (r: any) => r.vulnerabilities?.length > 0,
    ).length;

    return {
      riskLevel: vulnerable > 5 ? "high" : vulnerable > 2 ? "medium" : "low",
      score: Math.max(60, 100 - vulnerable * 10),
      totalVulnerabilities: vulnerable,
      criticalFindings: results.filter((r: any) =>
        r.vulnerabilities?.includes("Subdomain Takeover"),
      ).length,
      keyFindings: [
        `${results.length} subdomains discovered`,
        `${results.filter((r: any) => r.status === "active").length} active subdomains`,
        `${vulnerable} potentially vulnerable subdomains`,
      ],
      businessImpact:
        "Exposed subdomains increase attack surface and may lead to data breaches",
      timeToRemediate: "2-4 weeks",
    };
  }

  private generateComprehensiveExecutiveSummary(
    scanData: any,
    enumerationData: any,
  ): ExecutiveSummary {
    const vulnSummary = this.generateExecutiveSummary(scanData);
    const subdomainSummary =
      this.generateSubdomainExecutiveSummary(enumerationData);

    return {
      riskLevel:
        vulnSummary.riskLevel === "critical" ||
        subdomainSummary.riskLevel === "critical"
          ? "critical"
          : vulnSummary.riskLevel === "high" ||
              subdomainSummary.riskLevel === "high"
            ? "high"
            : "medium",
      score: Math.round((vulnSummary.score + subdomainSummary.score) / 2),
      totalVulnerabilities:
        vulnSummary.totalVulnerabilities +
        subdomainSummary.totalVulnerabilities,
      criticalFindings:
        vulnSummary.criticalFindings + subdomainSummary.criticalFindings,
      keyFindings: [
        ...vulnSummary.keyFindings,
        ...subdomainSummary.keyFindings,
      ],
      businessImpact:
        "Combined vulnerabilities and exposed attack surface create significant security risks",
      timeToRemediate: "4-8 weeks",
    };
  }

  private generateScanDetails(scanData: any): ScanDetails {
    return {
      scope: [scanData?.target || "Unknown target"],
      methodology: [
        "OWASP Testing Guide",
        "NIST Cybersecurity Framework",
        "PTES (Penetration Testing Execution Standard)",
      ],
      tools: [
        "Custom Vulnerability Scanner",
        "Port Scanner",
        "Web Application Scanner",
        "SSL/TLS Analyzer",
      ],
      duration: this.calculateDuration(scanData?.startTime, scanData?.endTime),
      coverage: "Web application, network services, SSL/TLS configuration",
      limitations: [
        "Testing performed from external perspective only",
        "No social engineering testing conducted",
        "Physical security not assessed",
      ],
    };
  }

  private generateSubdomainScanDetails(enumerationData: any): ScanDetails {
    return {
      scope: [enumerationData?.target || "Unknown target"],
      methodology: [
        "Certificate Transparency Logs",
        "DNS Brute Force",
        "Search Engine Reconnaissance",
        "Archive Analysis",
      ],
      tools: [
        "Certificate Transparency Scanner",
        "DNS Enumeration Tools",
        "Subdomain Discovery Engine",
        "Archive Crawler",
      ],
      duration: this.calculateDuration(
        enumerationData?.startTime,
        enumerationData?.endTime,
      ),
      coverage:
        "Public DNS records, certificate logs, search engines, web archives",
      limitations: [
        "Internal DNS records not accessible",
        "Some subdomains may be filtered by CDN",
        "Rate limiting may affect completeness",
      ],
    };
  }

  private generateComprehensiveScanDetails(
    scanData: any,
    enumerationData: any,
  ): ScanDetails {
    return {
      scope: [scanData?.target || enumerationData?.target || "Unknown target"],
      methodology: [
        "OWASP Testing Guide",
        "NIST Cybersecurity Framework",
        "Certificate Transparency Analysis",
        "DNS Reconnaissance",
      ],
      tools: [
        "Vulnerability Scanner",
        "Subdomain Enumeration Suite",
        "Port Scanner",
        "SSL/TLS Analyzer",
        "Web Application Tester",
      ],
      duration: "Combined scan duration",
      coverage: "Complete external attack surface assessment",
      limitations: [
        "External testing perspective only",
        "No authenticated testing performed",
        "Social engineering not included",
      ],
    };
  }

  private generateVulnerabilitySection(scanData: any): VulnerabilitySection {
    const vulnerabilities = scanData?.results?.vulnerabilities || [];

    const summary = {
      critical: vulnerabilities.filter((v: any) => v.severity === "critical")
        .length,
      high: vulnerabilities.filter((v: any) => v.severity === "high").length,
      medium: vulnerabilities.filter((v: any) => v.severity === "medium")
        .length,
      low: vulnerabilities.filter((v: any) => v.severity === "low").length,
      info: vulnerabilities.filter((v: any) => v.severity === "info").length,
    };

    const findings: DetailedFinding[] = vulnerabilities.map((vuln: any) => ({
      id: vuln.id,
      title: vuln.title,
      severity: vuln.severity,
      cvss: vuln.cvss || this.calculateCVSS(vuln.severity),
      cve: vuln.cve,
      description: vuln.description,
      technicalDetails: this.generateTechnicalDetails(vuln),
      proofOfConcept: this.generateProofOfConcept(vuln),
      impact: vuln.impact,
      remediation: vuln.remediation,
      references: vuln.references || [],
      affectedAssets: vuln.paths?.map((p: any) => p.path) || [],
      timeline: "Immediate action required",
    }));

    return {
      summary,
      findings,
      trends: {
        mostCommon: this.findMostCommonVulnerability(vulnerabilities),
        riskiest:
          vulnerabilities.find((v: any) => v.severity === "critical")?.title ||
          "None",
        easiestToFix:
          vulnerabilities.find((v: any) => v.severity === "low")?.title ||
          "None",
      },
    };
  }

  private generateSubdomainSection(enumerationData: any): SubdomainSection {
    const results = enumerationData?.results || [];

    return {
      total: results.length,
      active: results.filter((r: any) => r.status === "active").length,
      inactive: results.filter((r: any) => r.status === "inactive").length,
      vulnerableToTakeover: results.filter((r: any) =>
        r.vulnerabilities?.includes("Potential Subdomain Takeover"),
      ).length,
      findings: results.map((result: any) => ({
        subdomain: result.subdomain,
        status: result.status,
        risks: result.vulnerabilities || [],
        technologies: result.technologies || [],
      })),
    };
  }

  private generateRecommendations(scanData: any): Recommendation[] {
    const vulnerabilities = scanData?.results?.vulnerabilities || [];
    const recommendations: Recommendation[] = [];

    if (vulnerabilities.some((v: any) => v.severity === "critical")) {
      recommendations.push({
        priority: "immediate",
        category: "Security",
        title: "Address Critical Vulnerabilities",
        description:
          "Immediately patch all critical security vulnerabilities to prevent system compromise",
        effort: "high",
        cost: "medium",
        timeline: "1-2 days",
        businessValue: "Prevents potential data breaches and system compromise",
      });
    }

    recommendations.push({
      priority: "high",
      category: "Security Policy",
      title: "Implement Security Headers",
      description:
        "Deploy comprehensive security headers including CSP, HSTS, and X-Frame-Options",
      effort: "low",
      cost: "low",
      timeline: "1 week",
      businessValue: "Improves overall security posture with minimal effort",
    });

    return recommendations;
  }

  private generateSubdomainRecommendations(
    enumerationData: any,
  ): Recommendation[] {
    return [
      {
        priority: "high",
        category: "Asset Management",
        title: "Subdomain Inventory Management",
        description:
          "Maintain an accurate inventory of all subdomains and regularly audit for unauthorized additions",
        effort: "medium",
        cost: "low",
        timeline: "2 weeks",
        businessValue:
          "Reduces attack surface and improves security visibility",
      },
      {
        priority: "medium",
        category: "DNS Security",
        title: "Implement DNS Security Controls",
        description:
          "Configure DNS security controls to prevent subdomain takeover attacks",
        effort: "medium",
        cost: "medium",
        timeline: "3 weeks",
        businessValue: "Prevents potential brand damage and data exposure",
      },
    ];
  }

  private generateComprehensiveRecommendations(
    scanData: any,
    enumerationData: any,
  ): Recommendation[] {
    const vulnRecs = this.generateRecommendations(scanData);
    const subdomainRecs =
      this.generateSubdomainRecommendations(enumerationData);
    return [...vulnRecs, ...subdomainRecs];
  }

  private generateAppendices(scanData: any): Appendix[] {
    return [
      {
        title: "Scan Configuration",
        content: JSON.stringify(scanData?.phases || {}, null, 2),
        type: "technical",
      },
      {
        title: "Tool Versions",
        content: "Scanner v2.1.0\nPort Scanner v1.5.2\nSSL Analyzer v3.0.1",
        type: "tools",
      },
    ];
  }

  private generateSubdomainAppendices(enumerationData: any): Appendix[] {
    return [
      {
        title: "Enumeration Techniques",
        content: (enumerationData?.techniques || []).join("\n"),
        type: "methodology",
      },
      {
        title: "Raw Subdomain Data",
        content: JSON.stringify(enumerationData?.results || [], null, 2),
        type: "evidence",
      },
    ];
  }

  private generateComprehensiveAppendices(
    scanData: any,
    enumerationData: any,
  ): Appendix[] {
    return [
      ...this.generateAppendices(scanData),
      ...this.generateSubdomainAppendices(enumerationData),
    ];
  }

  // Helper methods
  private extractKeyFindings(vulnerabilities: any[]): string[] {
    return vulnerabilities
      .filter((v: any) => v.severity === "critical" || v.severity === "high")
      .slice(0, 3)
      .map((v: any) => v.title);
  }

  private assessBusinessImpact(
    riskLevel: string,
    vulnerabilities: any[],
  ): string {
    switch (riskLevel) {
      case "critical":
        return "Immediate risk of data breach, system compromise, and significant financial/reputational damage";
      case "high":
        return "High risk of unauthorized access and potential data exposure";
      case "medium":
        return "Moderate security risks that could be exploited by determined attackers";
      default:
        return "Low security risks with minimal business impact";
    }
  }

  private estimateRemediationTime(vulnerabilities: any[]): string {
    const critical = vulnerabilities.filter(
      (v: any) => v.severity === "critical",
    ).length;
    const high = vulnerabilities.filter(
      (v: any) => v.severity === "high",
    ).length;

    if (critical > 0) return "1-2 weeks";
    if (high > 0) return "2-4 weeks";
    return "4-8 weeks";
  }

  private calculateDuration(startTime?: Date, endTime?: Date): string {
    if (!startTime || !endTime) return "Unknown";
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    return `${diffHours} hours`;
  }

  private calculateCVSS(severity: string): number {
    switch (severity) {
      case "critical":
        return 9.0 + Math.random();
      case "high":
        return 7.0 + Math.random() * 2;
      case "medium":
        return 4.0 + Math.random() * 3;
      case "low":
        return 1.0 + Math.random() * 3;
      default:
        return 0.1 + Math.random() * 0.9;
    }
  }

  private generateTechnicalDetails(vuln: any): string {
    return (
      `Technical analysis of ${vuln.title}:\n\n` +
      `The vulnerability exists in the ${vuln.category} functionality ` +
      `and can be exploited through ${vuln.paths?.[0]?.path || "multiple vectors"}. ` +
      `This issue allows attackers to ${vuln.impact?.toLowerCase() || "compromise security"}.`
    );
  }

  private generateProofOfConcept(vuln: any): string {
    if (vuln.paths?.[0]?.request) {
      return `Request:\n${vuln.paths[0].request}\n\nResponse:\n${vuln.paths[0].response || "See evidence above"}`;
    }
    return "Proof of concept available upon request due to sensitivity.";
  }

  private findMostCommonVulnerability(vulnerabilities: any[]): string {
    const categories = vulnerabilities.map((v: any) => v.category);
    const counts = categories.reduce((acc: any, cat: string) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    return (
      Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b)) ||
      "None"
    );
  }

  private generatePDFContent(report: ReportData): string {
    // Simulate PDF content - in production, use a proper PDF library
    return `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 4 0 R
>>
>>
/MediaBox [0 0 612 792]
/Contents 5 0 R
>>
endobj

4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Arial
>>
endobj

5 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
100 700 Td
(${report.title}) Tj
0 -20 Td
(Generated: ${report.generatedAt.toLocaleDateString()}) Tj
0 -20 Td
(Target: ${report.target}) Tj
0 -40 Td
(Risk Level: ${report.executiveSummary.riskLevel.toUpperCase()}) Tj
ET
endstream
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000351 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
600
%%EOF`;
  }

  private generateHTMLReport(report: ReportData): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${report.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { background: #1a1d23; color: white; padding: 20px; border-radius: 8px; }
        .section { margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .critical { color: #ff0033; font-weight: bold; }
        .high { color: #ff6b35; font-weight: bold; }
        .medium { color: #f7b731; font-weight: bold; }
        .low { color: #5f27cd; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${report.title}</h1>
        <p>Generated: ${report.generatedAt.toLocaleDateString()}</p>
        <p>Target: ${report.target}</p>
        <p>Risk Level: <span class="${report.executiveSummary.riskLevel}">${report.executiveSummary.riskLevel.toUpperCase()}</span></p>
    </div>

    <div class="section">
        <h2>Executive Summary</h2>
        <p>Security Score: ${report.executiveSummary.score}/100</p>
        <p>Total Vulnerabilities: ${report.executiveSummary.totalVulnerabilities}</p>
        <p>Critical Findings: ${report.executiveSummary.criticalFindings}</p>
        <p>Business Impact: ${report.executiveSummary.businessImpact}</p>
    </div>

    <div class="section">
        <h2>Vulnerability Summary</h2>
        <table>
            <tr>
                <th>Severity</th>
                <th>Count</th>
            </tr>
            <tr>
                <td class="critical">Critical</td>
                <td>${report.vulnerabilities.summary.critical}</td>
            </tr>
            <tr>
                <td class="high">High</td>
                <td>${report.vulnerabilities.summary.high}</td>
            </tr>
            <tr>
                <td class="medium">Medium</td>
                <td>${report.vulnerabilities.summary.medium}</td>
            </tr>
            <tr>
                <td class="low">Low</td>
                <td>${report.vulnerabilities.summary.low}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>Detailed Findings</h2>
        ${report.vulnerabilities.findings
          .map(
            (finding) => `
            <div style="margin: 20px 0; padding: 15px; border-left: 4px solid ${this.getSeverityColor(finding.severity)};">
                <h3 class="${finding.severity}">${finding.title}</h3>
                <p><strong>Severity:</strong> ${finding.severity.toUpperCase()}</p>
                <p><strong>CVSS Score:</strong> ${finding.cvss}</p>
                <p><strong>Description:</strong> ${finding.description}</p>
                <p><strong>Impact:</strong> ${finding.impact}</p>
                <p><strong>Remediation:</strong> ${finding.remediation}</p>
            </div>
        `,
          )
          .join("")}
    </div>

    <div class="section">
        <h2>Recommendations</h2>
        ${report.recommendations
          .map(
            (rec) => `
            <div style="margin: 15px 0; padding: 10px; background: #f9f9f9; border-radius: 4px;">
                <h4>${rec.title} (${rec.priority.toUpperCase()} Priority)</h4>
                <p>${rec.description}</p>
                <p><strong>Timeline:</strong> ${rec.timeline}</p>
                <p><strong>Business Value:</strong> ${rec.businessValue}</p>
            </div>
        `,
          )
          .join("")}
    </div>
</body>
</html>`;
  }

  private getSeverityColor(severity: string): string {
    switch (severity) {
      case "critical":
        return "#ff0033";
      case "high":
        return "#ff6b35";
      case "medium":
        return "#f7b731";
      case "low":
        return "#5f27cd";
      default:
        return "#666";
    }
  }
}

export const reportService = new ReportService();
