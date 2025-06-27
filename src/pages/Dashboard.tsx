import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, Sector } from "recharts";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatCO2Value, calculateReductionPercentage, calculateNetEmissions, formatCO2Tonnes } from "@/lib/calculations";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";

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

  const statsData = [
    {
      title: "Total CO₂ Emissions",
      value: formatCO2Tonnes(totalEmissions),
      change: totalEmissions > 0 ? "+" + (totalEmissions * 0.05).toFixed(1) + "%" : "0%",
      trend: "up" as const,
      icon: "📊"
    },
    {
      title: "Carbon Offsets",
      value: formatCO2Tonnes(totalCarbonSinks),
      change: totalCarbonSinks > 0 ? "+" + (totalCarbonSinks * 0.15).toFixed(1) + "%" : "0%",
      trend: "up" as const,
      icon: "🌱"
    },
    {
      title: "Reduction Achieved",
      value: reductionPercentage.toFixed(1),
      unit: "%",
      change: reductionPercentage > 0 ? "+" + (reductionPercentage * 0.1).toFixed(1) + "%" : "0%",
      trend: "up" as const,
      icon: "📉"
    },
    {
      title: "Sustainability Score",
      value: sustainabilityScore.toFixed(1),
      unit: "/10",
      change: sustainabilityScore > 0 ? "+" + (sustainabilityScore * 0.05).toFixed(1) : "0",
      trend: "up" as const,
      icon: "🏆"
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
    color: ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#7c3aed'][index % 6]
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

  // Strategy progress data
  const strategyProgress = strategies.map(strategy => ({
    category: strategy.category,
    savings: strategy.currentReduction,
    roi: strategy.roi,
    status: strategy.status
  }));

  // Net Carbon Balance calculation
  const netCarbonBalance = totalEmissions - totalCarbonSinks;
  const netBalanceColor = netCarbonBalance > 0 ? 'text-red-600' : 'text-green-600';
  const netBalanceLabel = netCarbonBalance > 0 ? 'Surplus' : 'Deficit';

  // Carbon Credit calculation
  const carbonCredit = Math.max(0, totalCarbonSinks - totalEmissions);
  const carbonCreditColor = carbonCredit > 0 ? 'text-green-600' : 'text-gray-500';
  const carbonCreditIcon = carbonCredit > 0 ? '🏅' : '⏸️';

  // Custom label renderer for pie chart
  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.02) return null; // skip labels for <2%
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 24;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="#222"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={14}
        fontWeight={500}
        style={{ pointerEvents: 'none' }}
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Add icon mapping for strategy categories
  const strategyIcons = {
    afforestation: '🌳',
    energy: '⚡',
    transport: '🚚',
    waste: '🗑️',
    efficiency: '💡',
    default: '📈',
  };
  const statusColors = {
    planned: 'bg-gray-200 text-gray-700',
    'in progress': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
  };

  // Add state for modal
  const [selectedStrategy, setSelectedStrategy] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Carbon Emissions Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name}. Monitor and manage your mine's carbon footprint
          </p>
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
                {stat.unit && <span className="text-sm font-normal text-gray-500">{stat.unit}</span>}
              </div>
              <div className="flex items-center mt-2">
                <Badge 
                  variant={stat.trend === "up" ? "default" : "secondary"}
                  className="text-xs"
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

      {/* Net Carbon Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle>Net Carbon Balance</CardTitle>
          <CardDescription>
            Difference between total emissions and carbon sinks. Aim for zero or negative for net-zero.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-4">
            <div className={`text-3xl font-bold ${netBalanceColor}`}>
              {formatCO2Tonnes(netCarbonBalance)}
            </div>
            <div className="text-sm mt-2 text-gray-500">
              {netCarbonBalance > 0 ? 'Net Carbon Surplus' : 'Net Carbon Deficit'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carbon Credits Card */}
      <Card>
        <CardHeader>
          <CardTitle>Carbon Credits</CardTitle>
          <CardDescription>
            Surplus carbon offset available as credits (when sinks exceed emissions)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-4">
            <div className={`text-3xl font-bold ${carbonCreditColor} flex items-center`}>
              <span className="mr-2">{carbonCreditIcon}</span>
              {formatCO2Tonnes(carbonCredit)}
            </div>
            <div className="text-sm mt-2 text-gray-500">
              {carbonCredit > 0 ? 'You have surplus carbon credits!' : 'No surplus credits (yet)'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Net Emissions Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Carbon Neutrality Progress</CardTitle>
          <CardDescription>
            Progress towards achieving net-zero emissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Net Emissions: {formatCO2Tonnes(netEmissions)}</span>
              <span>Target: 0 tonnes CO₂e</span>
            </div>
            <Progress 
              value={Math.min((netEmissions / Math.max(totalEmissions, 1)) * 100, 100)} 
              className="h-3"
            />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600">{formatCO2Tonnes(totalEmissions)}</div>
                <div className="text-sm text-gray-500">Total Emissions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{formatCO2Tonnes(totalCarbonSinks)}</div>
                <div className="text-sm text-gray-500">Carbon Sinks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{formatCO2Tonnes(netEmissions)}</div>
                <div className="text-sm text-gray-500">Net Emissions</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  No emission data available
                </div>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {pieChartData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  <span>{entry.name}</span>
                  <span className="text-gray-500">{((entry.value / pieChartData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(0)}%</span>
                </div>
              ))}
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
              {emissionsOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={emissionsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCO2Value(value as number), 'CO₂e']} />
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
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No time series data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategy Progress */}
      {strategyProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Strategy Progress</CardTitle>
            <CardDescription>
              Current progress on carbon reduction strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {strategies.map((strategy, idx) => {
                const percent = Math.min(100, Math.round((strategy.currentReduction / (strategy.targetReduction || 1)) * 100));
                const icon = strategyIcons[strategy.category?.toLowerCase()] || strategyIcons.default;
                const status = strategy.status?.toLowerCase() || 'planned';
                return (
                  <div key={idx} className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <div className="font-semibold text-lg">{strategy.category}</div>
                        <div className="text-sm text-gray-500">{strategy.description}</div>
                      </div>
                    </div>
                    <div className="flex-1 md:mx-8 mt-4 md:mt-0">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-green-500 transition-all"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{percent}% complete</div>
                    </div>
                    <div className="flex flex-col items-end space-y-1 mt-4 md:mt-0 min-w-[120px]">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status]}`}>{strategy.status}</span>
                      <span className="text-green-700 font-semibold text-sm">{formatCO2Tonnes(strategy.currentReduction)} saved</span>
                      {strategy.roi && (
                        <span className="text-blue-700 text-xs">ROI: {strategy.roi}</span>
                      )}
                      <button
                        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
                        onClick={() => {
                          console.log('View Details clicked', strategy);
                          setSelectedStrategy(strategy);
                          setDetailsOpen(true);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategy Details Panel (Sheet) */}
      <Sheet
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) setSelectedStrategy(null);
        }}
      >
        <SheetContent side="right" className="max-w-md w-full">
          {!!selectedStrategy && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <span className="text-2xl">{strategyIcons[selectedStrategy.category?.toLowerCase()] || strategyIcons.default}</span>
                  <span>{selectedStrategy.category}</span>
                </SheetTitle>
                <SheetDescription>{selectedStrategy.description}</SheetDescription>
              </SheetHeader>
              <Separator className="my-2" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[selectedStrategy.status?.toLowerCase() || 'planned']}`}>{selectedStrategy.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Progress:</span>
                  <span>{Math.min(100, Math.round((selectedStrategy.currentReduction / (selectedStrategy.targetReduction || 1)) * 100))}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>CO₂e Saved:</span>
                  <span>{formatCO2Tonnes(selectedStrategy.currentReduction)}</span>
                </div>
                {selectedStrategy.targetReduction && (
                  <div className="flex justify-between text-sm">
                    <span>Target Reduction:</span>
                    <span>{formatCO2Tonnes(selectedStrategy.targetReduction)}</span>
                  </div>
                )}
                {selectedStrategy.roi && (
                  <div className="flex justify-between text-sm">
                    <span>ROI:</span>
                    <span>{selectedStrategy.roi}</span>
                  </div>
                )}
                {selectedStrategy.implementationTime && (
                  <div className="flex justify-between text-sm">
                    <span>Implementation Time:</span>
                    <span>{selectedStrategy.implementationTime}</span>
                  </div>
                )}
                {selectedStrategy.requiredCost && (
                  <div className="flex justify-between text-sm">
                    <span>Required Cost:</span>
                    <span>₹{selectedStrategy.requiredCost.toLocaleString()}</span>
                  </div>
                )}
                {selectedStrategy.details && (
                  <div className="text-sm text-gray-700 mt-2">
                    <span className="font-medium">Details:</span>
                    <div className="mt-1 whitespace-pre-line">{selectedStrategy.details}</div>
                  </div>
                )}
              </div>
              <SheetFooter className="mt-4">
                <button
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                  onClick={() => setDetailsOpen(false)}
                >
                  Close
                </button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Dashboard;
