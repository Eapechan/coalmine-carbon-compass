import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import React from "react";
import { Search } from "lucide-react";

const Admin = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [reportText, setReportText] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [selectedMine, setSelectedMine] = useState<any | null>(null);
  const [mineModalOpen, setMineModalOpen] = useState(false);

  // Mock data for mines and users
  const mines = [
    {
      id: 1,
      name: "Singareni Collieries Company Ltd",
      location: "Telangana",
      operator: "Rajesh Kumar",
      status: "Active",
      lastReport: "2024-01-25",
      emissions: "45,234 tonnes",
      complianceScore: 94,
      risk: "Low"
    },
    {
      id: 2,
      name: "Coal India Limited - Jharia",
      location: "Jharkhand",
      operator: "Priya Sharma",
      status: "Active",
      lastReport: "2024-01-20",
      emissions: "67,890 tonnes",
      complianceScore: 78,
      risk: "Medium"
    },
    {
      id: 3,
      name: "Neyveli Lignite Corporation",
      location: "Tamil Nadu",
      operator: "Arjun Patel",
      status: "Non-Reporting",
      lastReport: "2023-12-15",
      emissions: "32,156 tonnes",
      complianceScore: 45,
      risk: "High"
    },
    {
      id: 4,
      name: "Mahanadi Coalfields Limited",
      location: "Odisha",
      operator: "Sunita Singh",
      status: "Active",
      lastReport: "2024-01-28",
      emissions: "89,234 tonnes",
      complianceScore: 88,
      risk: "Low"
    }
  ];

  const users = [
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@scl.gov.in",
      role: "Mine Operator",
      organization: "Singareni Collieries",
      lastLogin: "2024-01-30",
      status: "Active"
    },
    {
      id: 2,
      name: "Dr. Meera Gupta",
      email: "meera.gupta@moef.gov.in",
      role: "Regulator",
      organization: "MoEF&CC",
      lastLogin: "2024-01-29",
      status: "Active"
    },
    {
      id: 3,
      name: "Priya Sharma",
      email: "priya.sharma@cil.gov.in",
      role: "Mine Operator",
      organization: "Coal India Ltd",
      lastLogin: "2024-01-28",
      status: "Active"
    }
  ];

  const regionData = [
    { region: "Jharkhand", mines: 45, emissions: "2.3M tonnes", compliance: 82 },
    { region: "Odisha", mines: 38, emissions: "1.9M tonnes", compliance: 85 },
    { region: "Chhattisgarh", mines: 32, emissions: "1.7M tonnes", compliance: 79 },
    { region: "Telangana", mines: 28, emissions: "1.2M tonnes", compliance: 88 },
    { region: "Tamil Nadu", mines: 15, emissions: "0.8M tonnes", compliance: 76 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Non-Reporting": return "bg-red-100 text-red-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "High": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleSendReminder = (mineId: number) => {
    toast({
      title: "Reminder Sent",
      description: "Compliance reminder has been sent to the mine operator.",
    });
  };

  const handleSuspendUser = (userId: number) => {
    toast({
      title: "User Suspended",
      description: "User access has been temporarily suspended.",
    });
  };

  // Helper for formatting numbers
  const fmt = (n: number) => typeof n === 'number' ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : n;

  // Generate Admin Report PDF
  const handleGenerateAdminPDF = async () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 40;

    // Add logo (SVG)
    try {
      const img = await fetch("/placeholder.svg").then(r => r.blob()).then(blob => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      }));
      doc.addImage(img, "SVG", pageWidth / 2 - 40, y, 80, 80);
    } catch {}
    y += 100;

    // Heading
    doc.setFontSize(18);
    doc.setTextColor(34, 139, 34);
    doc.text("CoalMineNetZero: Admin Compliance & Performance Report", pageWidth / 2, y, { align: "center" });
    y += 40;
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);

    // Compose summary text
    const summary =
      `This administrative report provides a comprehensive overview of mine operations, user activity, compliance rates, and regional performance for the Indian coal mining sector.\n\n` +
      `As of today, there are a total of 158 registered mines and 1,247 active users on the platform. The current compliance rate stands at 87%, with 12 mines identified as high risk and requiring immediate attention.\n\n` +
      `Mine Directory: The directory includes key operators such as Singareni Collieries Company Ltd (Telangana), Coal India Limited - Jharia (Jharkhand), Neyveli Lignite Corporation (Tamil Nadu), and Mahanadi Coalfields Limited (Odisha). Compliance scores range from 45% (high risk) to 94% (low risk), with non-reporting mines flagged for follow-up.\n\n` +
      `User Management: The platform supports a diverse user base, including mine operators and regulators. All users are monitored for activity and compliance, with tools available for account management and suspension if necessary.\n\n` +
      `Compliance Tracking: System-wide metrics indicate strong performance in timely reporting (87%), data quality (92%), and regulatory adherence (94%). Non-compliant mines are highlighted for corrective action.\n\n` +
      `Regional Analysis: Jharkhand, Odisha, Chhattisgarh, Telangana, and Tamil Nadu are the leading regions by mine count and emissions. Compliance rates by region range from 76% to 88%.\n\n` +
      `This report is intended for internal governance, compliance monitoring, and strategic planning. For further details, refer to the Admin Panel or contact the compliance team.`;
    doc.text(summary, 50, y, { maxWidth: pageWidth - 100, lineHeightFactor: 1.5 });
    y += 220;

    // Footer
    doc.setFontSize(12);
    doc.setTextColor(120, 120, 120);
    doc.text(
      "Report generated by CoalMineNetZero Admin Panel | Confidential",
      pageWidth / 2,
      820,
      { align: "center" }
    );

    // Add placeholder signature (bottom right)
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text("_________________________", pageWidth - 200, 760, { align: "left" });
    doc.text("Authorized Admin", pageWidth - 200, 780, { align: "left" });
    doc.setFontSize(12);
    doc.setTextColor(120, 120, 120);
    doc.text("(Digitally generated)", pageWidth - 200, 795, { align: "left" });

    // Add placeholder seal (bottom left)
    doc.setDrawColor(34, 139, 34);
    doc.setLineWidth(2);
    doc.circle(100, 770, 40, 'S');
    doc.setFontSize(12);
    doc.setTextColor(34, 139, 34);
    doc.text("COALMINE", 100, 765, { align: "center" });
    doc.text("NETZERO", 100, 780, { align: "center" });
    doc.text("ADMIN", 100, 795, { align: "center" });

    // Save PDF as Blob in memory
    const pdfBlob = doc.output('blob');
    setPdfBlob(pdfBlob);
    setReportText(summary);

    // Download PDF
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "admin_report.pdf";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Admin Report Generated",
      description: "Your admin report PDF has been downloaded.",
    });
  };

  // Stub for sending to Llama 3 (replace with your actual function)
  const sendToLlama3 = async (text: string) => {
    setAiLoading(true);
    setAiResponse("");
    try {
      // Replace this with your actual Llama 3 API call
      await new Promise(res => setTimeout(res, 2000)); // Simulate delay
      setAiResponse("[AI Response: Reframed/Analyzed Admin Report]\n" + text.slice(0, 300) + (text.length > 300 ? "..." : ""));
    } catch (err) {
      setAiResponse("Error contacting AI model.");
    } finally {
      setAiLoading(false);
    }
  };

  // Search and auto-popup logic
  const filteredMines = searchTerm.trim()
    ? mines.filter(m => m.name.toLowerCase().includes(searchTerm.trim().toLowerCase()))
    : mines;

  // Auto-open modal if search matches exactly one mine
  React.useEffect(() => {
    if (searchTerm.trim() && filteredMines.length === 1) {
      setSelectedMine(filteredMines[0]);
      setMineModalOpen(true);
    } else if (!searchTerm.trim()) {
      setMineModalOpen(false);
      setSelectedMine(null);
    }
  }, [searchTerm, filteredMines]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-1">Manage mines, users, and compliance tracking</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Input
              placeholder="Search mines, users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          <Button className="sustainability-gradient text-white" onClick={handleGenerateAdminPDF}>
            📊 Generate Admin Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Mines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">158</div>
            <p className="text-xs text-gray-500">+3 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-gray-500">+18 this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-gray-500">+2% vs last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">High Risk Mines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">12</div>
            <p className="text-xs text-gray-500">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mines" className="space-y-6">
        <TabsList>
          <TabsTrigger value="mines">Mine Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Tracking</TabsTrigger>
          <TabsTrigger value="regions">Regional Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="mines" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mine Directory</CardTitle>
              <CardDescription>
                Overview of all registered coal mines and their compliance status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mine Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Report</TableHead>
                      <TableHead>Compliance</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMines.map((mine) => (
                      <TableRow key={mine.id}>
                        <TableCell className="font-medium">{mine.name}</TableCell>
                        <TableCell>{mine.location}</TableCell>
                        <TableCell>{mine.operator}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(mine.status)}>
                            {mine.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{mine.lastReport}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={mine.complianceScore} className="w-16 h-2" />
                            <span className="text-sm">{mine.complianceScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskColor(mine.risk)}>
                            {mine.risk}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => { setSelectedMine(mine); setMineModalOpen(true); }}>
                              View
                            </Button>
                            {mine.status === "Non-Reporting" && (
                              <Button 
                                size="sm" 
                                variant="secondary"
                                onClick={() => handleSendReminder(mine.id)}
                              >
                                Remind
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>{user.organization}</TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleSuspendUser(user.id)}
                            >
                              Suspend
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Overview</CardTitle>
                <CardDescription>
                  System-wide compliance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Timely Reporting</span>
                      <span>87%</span>
                    </div>
                    <Progress value={87} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Data Quality</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Regulatory Adherence</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Non-Compliant Mines</CardTitle>
                <CardDescription>
                  Mines requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium">Neyveli Lignite Corp</div>
                      <div className="text-sm text-gray-600">45 days overdue</div>
                    </div>
                    <Button size="sm" variant="outline">
                      Contact
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <div className="font-medium">Eastern Coalfields Ltd</div>
                      <div className="text-sm text-gray-600">Incomplete data</div>
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Emission Heatmap</CardTitle>
              <CardDescription>
                State-wise coal mine emissions and compliance overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {regionData.map((region) => (
                  <div key={region.region} className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">{region.region}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Mines</span>
                        <span className="font-medium">{region.mines}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Emissions</span>
                        <span className="font-medium">{region.emissions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Compliance</span>
                        <span className="font-medium">{region.compliance}%</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Progress value={region.compliance} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mine Details Modal */}
      <Dialog open={mineModalOpen} onOpenChange={(open) => {
        setMineModalOpen(open);
        if (!open) {
          setSelectedMine(null);
          setSearchTerm("");
        }
      }}>
        <DialogContent className="max-w-md w-full animate-fade-in-up">
          {selectedMine && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMine.name}</DialogTitle>
                <DialogDescription>
                  Detailed information about this mine and its compliance status.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                <div><span className="font-semibold">Location:</span> {selectedMine.location}</div>
                <div><span className="font-semibold">Operator:</span> {selectedMine.operator}</div>
                <div><span className="font-semibold">Status:</span> <Badge className={getStatusColor(selectedMine.status)}>{selectedMine.status}</Badge></div>
                <div><span className="font-semibold">Last Report:</span> {selectedMine.lastReport}</div>
                <div><span className="font-semibold">Compliance:</span> <span className="text-blue-700 font-semibold">{selectedMine.complianceScore}%</span></div>
                <div><span className="font-semibold">Risk Level:</span> <Badge className={getRiskColor(selectedMine.risk)}>{selectedMine.risk}</Badge></div>
                <div><span className="font-semibold">Emissions:</span> {selectedMine.emissions}</div>
              </div>
              <DialogFooter className="mt-6">
                <Button onClick={() => { setMineModalOpen(false); setSelectedMine(null); setSearchTerm(""); }} className="w-full">Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
