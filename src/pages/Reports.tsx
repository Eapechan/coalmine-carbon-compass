
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  });

  const reportTypes = [
    {
      id: "esg-annual",
      title: "ESG Annual Report",
      description: "Comprehensive environmental, social, and governance report",
      format: ["PDF", "Excel"],
      compliance: "ESG Framework",
      lastGenerated: "2024-01-01",
      status: "Current"
    },
    {
      id: "cdp-climate",
      title: "CDP Climate Change Report",
      description: "Carbon Disclosure Project climate change questionnaire",
      format: ["PDF", "Excel"],
      compliance: "CDP Standards",
      lastGenerated: "2023-12-15",
      status: "Due Soon"
    },
    {
      id: "ghg-inventory",
      title: "GHG Inventory Report",
      description: "Detailed greenhouse gas emissions inventory",
      format: ["PDF", "Excel", "XML"],
      compliance: "ISO 14064",
      lastGenerated: "2024-01-10",
      status: "Current"
    },
    {
      id: "monthly-summary",
      title: "Monthly Emission Summary",
      description: "Monthly carbon footprint summary and trends",
      format: ["PDF", "Excel"],
      compliance: "Internal",
      lastGenerated: "2024-01-31",
      status: "Current"
    },
    {
      id: "regulatory-compliance",
      title: "Regulatory Compliance Report",
      description: "Government compliance and environmental clearance status",
      format: ["PDF"],
      compliance: "MoEF&CC",
      lastGenerated: "2024-01-20",
      status: "Current"
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: "January 2024 Carbon Report",
      type: "Monthly Summary",
      generated: "2024-02-01",
      size: "2.3 MB",
      downloads: 12
    },
    {
      id: 2,
      name: "Q4 2023 ESG Report",
      type: "ESG Annual",
      generated: "2024-01-15",
      size: "5.7 MB",
      downloads: 28
    },
    {
      id: 3,
      name: "GHG Inventory 2023",
      type: "GHG Inventory",
      generated: "2024-01-10",
      size: "3.1 MB",
      downloads: 15
    }
  ];

  const handleGenerateReport = (reportId: string, format: string) => {
    toast({
      title: "Report Generation Started",
      description: `Your ${format} report is being generated and will be ready shortly.`,
    });
    console.log(`Generating report: ${reportId} in ${format} format`);
  };

  const handleDownloadReport = (reportId: number) => {
    toast({
      title: "Download Started",
      description: "Your report download will begin shortly.",
    });
    console.log(`Downloading report: ${reportId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Current": return "bg-green-100 text-green-800";
      case "Due Soon": return "bg-yellow-100 text-yellow-800";
      case "Overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Report Generator</h1>
          <p className="text-gray-600 mt-1">Generate compliance reports and carbon footprint documentation</p>
        </div>
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-60">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Select date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button className="sustainability-gradient text-white">
            📧 Schedule Reports
          </Button>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Dashboard</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportTypes.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {report.description}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Compliance:</span>
                        <div className="font-medium">{report.compliance}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Generated:</span>
                        <div className="font-medium">{report.lastGenerated}</div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="text-sm text-gray-600 mb-3">Available Formats:</div>
                      <div className="flex flex-wrap gap-2">
                        {report.format.map((format) => (
                          <Button
                            key={format}
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateReport(report.id, format)}
                            className="text-xs"
                          >
                            📄 {format}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                Your recently generated reports and downloads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-medium">{report.name}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span>Type: {report.type}</span>
                        <span>Generated: {report.generated}</span>
                        <span>Size: {report.size}</span>
                        <span>Downloads: {report.downloads}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadReport(report.id)}
                      >
                        📥 Download
                      </Button>
                      <Button size="sm" variant="ghost">
                        👁️ Preview
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compliance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">94%</div>
                  <div className="text-sm text-gray-600 mt-1">Overall Compliance</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reports Due</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">2</div>
                  <div className="text-sm text-gray-600 mt-1">Within 30 Days</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Auto Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-gray-600 mt-1">Scheduled Monthly</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Timeline</CardTitle>
              <CardDescription>
                Upcoming reporting deadlines and requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-semibold">CDP Climate Change Report</h3>
                  <p className="text-sm text-gray-600">Due: February 28, 2024</p>
                  <p className="text-xs text-gray-500 mt-1">Annual carbon disclosure reporting</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold">Monthly Emission Summary</h3>
                  <p className="text-sm text-gray-600">Due: March 5, 2024</p>
                  <p className="text-xs text-gray-500 mt-1">Internal reporting - Auto-generated</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold">Environmental Clearance Renewal</h3>
                  <p className="text-sm text-gray-600">Due: April 15, 2024</p>
                  <p className="text-xs text-gray-500 mt-1">Regulatory compliance with MoEF&CC</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Custom Report Builder</CardTitle>
                <CardDescription>
                  Create custom reports with your data selection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    🛠️ Build Custom Report
                  </Button>
                  <div className="text-xs text-gray-500 text-center">
                    Drag & drop components, select data ranges, customize layouts
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Executive Summary</CardTitle>
                <CardDescription>
                  High-level overview for management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    📊 Generate Summary
                  </Button>
                  <div className="text-xs text-gray-500 text-center">
                    Key metrics, trends, and recommendations
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stakeholder Report</CardTitle>
                <CardDescription>
                  External stakeholder communication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    🤝 Create Report
                  </Button>
                  <div className="text-xs text-gray-500 text-center">
                    Investor relations, community updates
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
