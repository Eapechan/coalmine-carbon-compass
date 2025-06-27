import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatCO2Value, calculateReductionPercentage, calculateNetEmissions, formatCO2Tonnes } from "@/lib/calculations";
import { TrendingUp, TrendingDown, Minus, Leaf, Factory, Target, Award } from "lucide-react";
import jsPDF from "jspdf";

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    emissions, 
    carbonSinks, 
    strategies, 
    getTotalEmissions, 
    getTotalCarbonSinks, 
    getNetEmissions, 
    getReductionPercentage 
  } = useData();

  const [animatedValues, setAnimatedValues] = useState({
    totalEmissions: 0,
    totalCarbonSinks: 0,
    reductionPercentage: 0,
    sustainabilityScore: 0
  });

  // Calculate real statistics
  const totalEmissions = getTotalEmissions();
  const totalCarbonSinks = getTotalCarbonSinks();
  const netEmissions = getNetEmissions();
  const reductionPercentage = getReductionPercentage();
  
  // Calculate sustainability score (0-10)
  const sustainabilityScore = Math.min(10, Math.max(0, 
    (reductionPercentage / 10) + (netEmissions < totalEmissions * 0.5 ? 5 : 0) + 
    (strategies.filter(s => s.status === 'completed').length * 2)
  ));

  // Animate numbers on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedValues({
        totalEmissions: totalEmissions * easeOutQuart,
        totalCarbonSinks: totalCarbonSinks * easeOutQuart,
        reductionPercentage: reductionPercentage * easeOutQuart,
        sustainabilityScore: sustainabilityScore * easeOutQuart
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues({
          totalEmissions,
          totalCarbonSinks,
          reductionPercentage,
          sustainabilityScore
        });
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [totalEmissions, totalCarbonSinks, reductionPercentage, sustainabilityScore]);

  const statsData = [
    {
      title: "Total CO₂ Emissions",
      value: formatCO2Tonnes(animatedValues.totalEmissions),
      change: totalEmissions > 0 ? "+" + (totalEmissions * 0.05).toFixed(1) + "%" : "0%",
      trend: "up" as const,
      icon: Factory,
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700"
    },
    {
      title: "Carbon Offsets",
      value: formatCO2Tonnes(animatedValues.totalCarbonSinks),
      change: totalCarbonSinks > 0 ? "+" + (totalCarbonSinks * 0.15).toFixed(1) + "%" : "0%",
      trend: "up" as const,
      icon: Leaf,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "Reduction Achieved",
      value: animatedValues.reductionPercentage.toFixed(1),
      unit: "%",
      change: reductionPercentage > 0 ? "+" + (reductionPercentage * 0.1).toFixed(1) + "%" : "0%",
      trend: "up" as const,
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Sustainability Score",
      value: animatedValues.sustainabilityScore.toFixed(1),
      unit: "/10",
      change: sustainabilityScore > 0 ? "+" + (sustainabilityScore * 0.05).toFixed(1) : "0",
      trend: "up" as const,
      icon: Award,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    }
  ];

  // Group emissions by activity type for pie chart
  const emissionsByActivity = emissions.reduce((acc, emission) => {
    const activity = emission.activityType;
    if (acc[activity]) {
      acc[activity] += emission.co2e;
    } else {
      acc[activity] = emission.co2e;
    }
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(emissionsByActivity).map(([name, value], index) => ({
    name,
    value,
    color: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'][index % 6]
  }));

  // Prepare time series data for line chart
  const monthlyData = emissions.reduce((acc, emission) => {
    const month = new Date(emission.date).toLocaleDateString('en-US', { month: 'short' });
    if (acc[month]) {
      acc[month].emissions += emission.co2e;
    } else {
      acc[month] = { month, emissions: emission.co2e, target: emission.co2e * 0.9 };
    }
    return acc;
  }, {} as Record<string, { month: string; emissions: number; target: number }>);

  const emissionsOverTime = Object.values(monthlyData).sort((a, b) => 
    new Date(a.month + ' 1, 2024').getTime() - new Date(b.month + ' 1, 2024').getTime()
  );

  const handleExportPDF = async () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 40;

    // Add colored background
    doc.setFillColor(240, 255, 245);
    doc.rect(0, 0, pageWidth, 842, 'F');

    // Heading
    doc.setFontSize(22);
    doc.setTextColor(34, 139, 34);
    doc.text("CoalMineNetZero: Carbon Emissions Dashboard Report", pageWidth / 2, y, { align: "center" });
    y += 100;

    // Stats summary
    const statRows = [
      { label: "Total CO₂ Emissions:", value: `${totalEmissions.toFixed(2)} tonnes`, color: 'red' },
      { label: "Carbon Offsets:", value: `${totalCarbonSinks.toFixed(2)} tonnes`, color: 'green' },
      { label: "Net Carbon Balance:", value: `${netEmissions.toFixed(2)} tonnes`, color: netEmissions < 0 ? 'green' : 'red' },
      { label: "Reduction Achieved:", value: `${reductionPercentage.toFixed(1)}%`, color: 'green' },
      { label: "Sustainability Score:", value: `${sustainabilityScore.toFixed(1)}/10`, color: 'green' },
    ];

    statRows.forEach((row, idx) => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(34, 139, 34);
      doc.text(row.label, 80, y + idx * 24);
      doc.setFont("helvetica", "bold");
      if (row.color === 'green') doc.setTextColor(34, 139, 34);
      else if (row.color === 'red') doc.setTextColor(200, 0, 0);
      else doc.setTextColor(34, 34, 34);
      doc.text(row.value, pageWidth - 80, y + idx * 24, { align: "right" });
    });

    doc.save("dashboard_report.pdf");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 animate-slide-up">
        <div>
          <h1 className="heading-lg text-gray-900 flex items-center">
            <span className="mr-3">🌱</span>
            Carbon Emissions Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Welcome back, <span className="font-semibold text-green-600">{user?.name}</span>. 
            Monitor and manage your mine's carbon footprint
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select defaultValue="last-6-months">
            <SelectTrigger className="w-40 focus-ring">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportPDF} className="ripple focus-ring">
            <span className="mr-2">📊</span>
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={index} className="eco-card animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
                {stat.unit && <span className="text-lg font-normal text-gray-500 ml-1">{stat.unit}</span>}
              </div>
              <div className="flex items-center">
                <Badge 
                  variant={stat.trend === "up" ? "default" : "secondary"}
                  className={`text-xs bg-gradient-to-r ${stat.color} text-white`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : stat.trend === "down" ? (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  ) : (
                    <Minus className="w-3 h-3 mr-1" />
                  )}
                  {stat.change}
                </Badge>
                <span className="text-xs text-gray-500 ml-2">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Carbon Neutrality Progress */}
      <Card className="eco-card animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <span className="mr-2">🎯</span>
            Carbon Neutrality Progress
          </CardTitle>
          <CardDescription>
            Your journey towards achieving net-zero emissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between text-sm">
              <span>Net Emissions: {formatCO2Tonnes(netEmissions)}</span>
              <span>Target: 0 tonnes CO₂e</span>
            </div>
            <div className="relative">
              <Progress 
                value={Math.min((netEmissions / Math.max(totalEmissions, 1)) * 100, 100)} 
                className="h-4 animate-progress"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full opacity-20"></div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-red-50 animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <div className="text-2xl font-bold text-red-600">{formatCO2Tonnes(totalEmissions)}</div>
                <div className="text-sm text-gray-500 flex items-center justify-center">
                  <Factory className="w-4 h-4 mr-1" />
                  Total Emissions
                </div>
              </div>
              <div className="p-4 rounded-lg bg-green-50 animate-scale-in" style={{ animationDelay: '0.4s' }}>
                <div className="text-2xl font-bold text-green-600">{formatCO2Tonnes(totalCarbonSinks)}</div>
                <div className="text-sm text-gray-500 flex items-center justify-center">
                  <Leaf className="w-4 h-4 mr-1" />
                  Carbon Sinks
                </div>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 animate-scale-in" style={{ animationDelay: '0.6s' }}>
                <div className="text-2xl font-bold text-blue-600">{formatCO2Tonnes(netEmissions)}</div>
                <div className="text-sm text-gray-500 flex items-center justify-center">
                  <Target className="w-4 h-4 mr-1" />
                  Net Emissions
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Emissions by Activity - Pie Chart */}
        <Card className="eco-card animate-slide-left">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">📊</span>
              Emissions by Activity
            </CardTitle>
            <CardDescription>
              Breakdown of CO₂ emissions by source
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatCO2Value(value as number), 'CO₂e']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📈</div>
                    <p>No emission data available</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {pieChartData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  <span>{entry.name}</span>
                  <span className="text-gray-500">{((entry.value / pieChartData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emissions Over Time - Line Chart */}
        <Card className="eco-card animate-slide-right">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">📈</span>
              Emissions Over Time
            </CardTitle>
            <CardDescription>
              Monthly CO₂ emissions vs targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {emissionsOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={emissionsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip formatter={(value) => [formatCO2Value(value as number), 'CO₂e']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="emissions" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      name="Actual Emissions"
                      animationDuration={2000}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#22c55e" 
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      name="Target"
                      animationDuration={2000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <p>No time series data available</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategy Progress */}
      {strategies.length > 0 && (
        <Card className="eco-card animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">🚀</span>
              Strategy Progress
            </CardTitle>
            <CardDescription>
              Current progress on carbon reduction strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {strategies.slice(0, 3).map((strategy, idx) => {
                const percent = Math.min(100, Math.round((strategy.currentReduction / (strategy.targetReduction || 1)) * 100));
                const statusColors = {
                  planned: 'bg-gray-100 text-gray-700',
                  'in-progress': 'bg-yellow-100 text-yellow-800',
                  completed: 'bg-green-100 text-green-800',
                };
                
                return (
                  <div key={idx} className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm animate-scale-in" style={{ animationDelay: `${idx * 0.2}s` }}>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <div>
                        <div className="font-semibold text-lg text-gray-900">{strategy.title}</div>
                        <div className="text-sm text-gray-600">{strategy.description}</div>
                      </div>
                    </div>
                    <div className="flex-1 md:mx-8 mt-4 md:mt-0">
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000 ease-out animate-progress"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{percent}% complete</div>
                    </div>
                    <div className="flex flex-col items-end space-y-2 mt-4 md:mt-0 min-w-[120px]">
                      <Badge className={statusColors[strategy.status?.toLowerCase() as keyof typeof statusColors] || statusColors.planned}>
                        {strategy.status}
                      </Badge>
                      <span className="text-green-700 font-semibold text-sm">
                        {formatCO2Tonnes(strategy.currentReduction)} saved
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;