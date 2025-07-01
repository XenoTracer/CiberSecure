export interface CVEData {
  id: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  cvssScore: number;
  cvssVector: string;
  publishedDate: string;
  lastModifiedDate: string;
  references: string[];
  cpe: string[];
  weaknesses: string[];
  configurations: any[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: any;
}

class CVEService {
  private notifications: NotificationItem[] = [];
  private listeners = new Set<(notifications: NotificationItem[]) => void>();

  // Subscribe to notification updates
  onNotificationUpdate(callback: (notifications: NotificationItem[]) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Real CVE lookup using NVD API simulation
  async lookupCVE(cveId: string): Promise<CVEData | null> {
    try {
      // Simulate real CVE lookup - in production, this would call NVD API
      await this.delay(500);

      const mockCVEDatabase = this.getMockCVEDatabase();
      const cve = mockCVEDatabase.find((c) => c.id === cveId);

      if (cve) {
        this.addNotification({
          title: "CVE Found",
          message: `Found CVE ${cveId} with severity ${cve.severity}`,
          type:
            cve.severity === "CRITICAL" || cve.severity === "HIGH"
              ? "error"
              : "warning",
          metadata: { cveId, severity: cve.severity },
        });
      }

      return cve || null;
    } catch (error) {
      this.addNotification({
        title: "CVE Lookup Failed",
        message: `Failed to lookup CVE ${cveId}`,
        type: "error",
      });
      return null;
    }
  }

  // Search CVEs by keyword or product
  async searchCVEs(query: string, limit: number = 20): Promise<CVEData[]> {
    try {
      await this.delay(800);

      const mockCVEDatabase = this.getMockCVEDatabase();
      const results = mockCVEDatabase
        .filter(
          (cve) =>
            cve.description.toLowerCase().includes(query.toLowerCase()) ||
            cve.cpe.some((cpe) =>
              cpe.toLowerCase().includes(query.toLowerCase()),
            ),
        )
        .slice(0, limit);

      if (results.length > 0) {
        this.addNotification({
          title: "CVE Search Results",
          message: `Found ${results.length} CVEs matching "${query}"`,
          type: "info",
          metadata: { query, count: results.length },
        });
      }

      return results;
    } catch (error) {
      this.addNotification({
        title: "CVE Search Failed",
        message: `Failed to search CVEs for "${query}"`,
        type: "error",
      });
      return [];
    }
  }

  // Get recent CVEs
  async getRecentCVEs(days: number = 7): Promise<CVEData[]> {
    try {
      await this.delay(600);

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const mockCVEDatabase = this.getMockCVEDatabase();
      const recent = mockCVEDatabase
        .filter((cve) => new Date(cve.publishedDate) > cutoffDate)
        .sort(
          (a, b) =>
            new Date(b.publishedDate).getTime() -
            new Date(a.publishedDate).getTime(),
        )
        .slice(0, 10);

      this.addNotification({
        title: "Recent CVEs Updated",
        message: `Found ${recent.length} CVEs published in the last ${days} days`,
        type: "info",
        metadata: { days, count: recent.length },
      });

      return recent;
    } catch (error) {
      return [];
    }
  }

  // Add notification
  addNotification(
    notification: Omit<NotificationItem, "id" | "timestamp" | "read">,
  ) {
    const newNotification: NotificationItem = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    this.notifications.unshift(newNotification);

    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.notifyListeners();
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(
      (n) => n.id === notificationId,
    );
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  // Mark all as read
  markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.notifyListeners();
  }

  // Clear all notifications
  clearAllNotifications() {
    this.notifications = [];
    this.notifyListeners();
  }

  // Get notifications
  getNotifications(): NotificationItem[] {
    return [...this.notifications];
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener([...this.notifications]));
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Mock CVE database - in production this would be fetched from NVD
  private getMockCVEDatabase(): CVEData[] {
    return [
      {
        id: "CVE-2024-50623",
        description:
          "A SQL injection vulnerability in web application login forms allows remote attackers to execute arbitrary SQL commands via the username parameter.",
        severity: "HIGH",
        cvssScore: 8.1,
        cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N",
        publishedDate: "2024-12-15T10:00:00Z",
        lastModifiedDate: "2024-12-16T14:30:00Z",
        references: [
          "https://example.com/security-advisory",
          "https://nvd.nist.gov/vuln/detail/CVE-2024-50623",
        ],
        cpe: ["cpe:2.3:a:example:webapp:*:*:*:*:*:*:*:*"],
        weaknesses: ["CWE-89"],
        configurations: [],
      },
      {
        id: "CVE-2024-50624",
        description:
          "Cross-site scripting (XSS) vulnerability in search functionality allows attackers to inject malicious scripts.",
        severity: "MEDIUM",
        cvssScore: 6.1,
        cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N",
        publishedDate: "2024-12-14T15:30:00Z",
        lastModifiedDate: "2024-12-15T09:45:00Z",
        references: [
          "https://example.com/xss-disclosure",
          "https://nvd.nist.gov/vuln/detail/CVE-2024-50624",
        ],
        cpe: ["cpe:2.3:a:example:search:*:*:*:*:*:*:*:*"],
        weaknesses: ["CWE-79"],
        configurations: [],
      },
      {
        id: "CVE-2024-50625",
        description:
          "Remote code execution vulnerability in file upload functionality due to insufficient input validation.",
        severity: "CRITICAL",
        cvssScore: 9.8,
        cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
        publishedDate: "2024-12-13T08:15:00Z",
        lastModifiedDate: "2024-12-14T16:20:00Z",
        references: [
          "https://example.com/rce-advisory",
          "https://nvd.nist.gov/vuln/detail/CVE-2024-50625",
        ],
        cpe: ["cpe:2.3:a:example:fileupload:*:*:*:*:*:*:*:*"],
        weaknesses: ["CWE-434", "CWE-78"],
        configurations: [],
      },
      {
        id: "CVE-2024-50626",
        description:
          "Information disclosure vulnerability in error handling exposes sensitive system information.",
        severity: "LOW",
        cvssScore: 3.7,
        cvssVector: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N",
        publishedDate: "2024-12-12T12:00:00Z",
        lastModifiedDate: "2024-12-13T10:30:00Z",
        references: [
          "https://example.com/info-disclosure",
          "https://nvd.nist.gov/vuln/detail/CVE-2024-50626",
        ],
        cpe: ["cpe:2.3:a:example:errorhandler:*:*:*:*:*:*:*:*"],
        weaknesses: ["CWE-200"],
        configurations: [],
      },
      {
        id: "CVE-2024-50627",
        description:
          "Authentication bypass vulnerability allows unauthorized access to admin panel.",
        severity: "HIGH",
        cvssScore: 7.5,
        cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N",
        publishedDate: "2024-12-11T14:45:00Z",
        lastModifiedDate: "2024-12-12T11:15:00Z",
        references: [
          "https://example.com/auth-bypass",
          "https://nvd.nist.gov/vuln/detail/CVE-2024-50627",
        ],
        cpe: ["cpe:2.3:a:example:admin:*:*:*:*:*:*:*:*"],
        weaknesses: ["CWE-287"],
        configurations: [],
      },
      {
        id: "CVE-2024-50628",
        description:
          "Server-side request forgery (SSRF) in webhook functionality allows access to internal services.",
        severity: "HIGH",
        cvssScore: 7.7,
        cvssVector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:N/A:N",
        publishedDate: "2024-12-10T09:30:00Z",
        lastModifiedDate: "2024-12-11T13:45:00Z",
        references: [
          "https://example.com/ssrf-disclosure",
          "https://nvd.nist.gov/vuln/detail/CVE-2024-50628",
        ],
        cpe: ["cpe:2.3:a:example:webhook:*:*:*:*:*:*:*:*"],
        weaknesses: ["CWE-918"],
        configurations: [],
      },
    ];
  }
}

export const cveService = new CVEService();
