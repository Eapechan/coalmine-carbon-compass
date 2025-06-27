
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";

const Dashboard = () => {
  // Mock data for dashboard
  const statsData = [
    {
      title: "Total CO₂ Emissions",
      value: "45,234",
      unit: "tonnes CO₂e",
      change: "+5.2%",
      trend: "up",
      icon: "📊"
    },
    {
      title: "Carbon Offsets",
      value: "12,450",
      unit: "tonnes CO₂e",
      change: "+15.8%",
      trend: "up",
      icon: "🌱"
    },
    {
      title: "Reduction Achieved",
      value: "21.5",
      unit: "%",
      change: "+3.2%",
      trend: "up",
      icon: "📉"
    },
    {
      title: "Sustainability Score",
      value: "7.8",
      unit: "/10",
      change: "+0.5",
      trend: "up",
      icon: "🏆"
    }
  ];

  const emissionsByActivity = [
    { name: "Fuel Combustion", value: 35, color: "#dc2626" },
    { name: "Electricity", value: 28, color: "#ea580c" },
    { name: "Transport", value: 22, color: "#ca8a04" },
    { name: "Equipment", value: 15, color: "#16a34a" }
  ];

  const emissionsOverTime = [
    { month: "Jan", emissions: 4200, target: 4000 },
    { month: "Feb", emissions: 4100, target: 3900 },
    { month: "Mar", emissions: 4300, target: 3800 },
    { month: "Apr", emissions: 3900, target: 3700 },
    { month: "May", emissions: 3800, target: 3600 },
    { month: "Jun", emissions: 3600, target: 3500 }
  ];

  const costSavings = [
    { category: "Energy Efficiency", savings: 450000, roi: 185 },
    { category: "Renewable Energy", savings: 320000, roi: 142 },
    { category: "Waste Reduction", savings: 180000, roi: 95 },
    { category: "Process Optimization", savings: 275000, roi: 167 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Carbon Emissions Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage your mine's carbon footprint</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select defaultValue="last-6-months">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Data</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <span className="text-2xl">{stat.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">
                {stat.unit}
              </div>
              <div className="flex items-center mt-2">
                <Badge 
                  variant={stat.trend === "up" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
                <span className="text-xs text-gray-500 ml-2">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emissions by Activity - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Emissions by Activity</CardTitle>
            <CardDescription>
              Breakdown of CO₂ emissions by source
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emissionsByActivity}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {emissionsByActivity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Emissions Over Time - Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Emissions Over Time</CardTitle>
            <CardDescription>
              Monthly CO₂ emissions vs targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={emissionsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="emissions" 
                    stroke="#dc2626" 
                    strokeWidth={3}
                    name="Actual Emissions"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#16a34a" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    name="Target"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Savings and ROI */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Savings & ROI Analysis</CardTitle>
          <CardDescription>
            Financial benefits from carbon reduction initiatives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costSavings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="savings" 
                  fill="#16a34a" 
                  name="Cost Savings (₹)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  yAxisId="right"
                  dataKey="roi" 
                  fill="#0ea5e9" 
                  name="ROI (%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 sustainability-gradient text-white" size="lg">
              <div className="text-center">
                <div className="text-lg font-semibold">📊 Log Emissions</div>
                <div className="text-xs opacity-90">Add new emission data</div>
              </div>
            </Button>
            <Button variant="outline" className="h-16" size="lg">
              <div className="text-center">
                <div className="text-lg font-semibold">🌱 Calculate Offsets</div>
                <div className="text-xs opacity-70">Carbon sink calculator</div>
              </div>
            </Button>
            <Button variant="outline" className="h-16" size="lg">
              <div className="text-center">
                <div className="text-lg font-semibold">📈 View Strategy</div>
                <div className="text-xs opacity-70">AI recommendations</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Towards Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Towards Net Zero Goals</CardTitle>
          <CardDescription>
            Track your journey to carbon neutrality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>2024 Emission Reduction Target</span>
              <span>67% Complete</span>
            </div>
            <Progress value={67} className="h-3" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Renewable Energy Adoption</span>
              <span>45% Complete</span>
            </div>
            <Progress value={45} className="h-3" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Carbon Offset Procurement</span>
              <span>82% Complete</span>
            </div>
            <Progress value={82} className="h-3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
