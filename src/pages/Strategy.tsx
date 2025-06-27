
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Strategy = () => {
  const { toast } = useToast();
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  const strategicRecommendations = [
    {
      id: "solar-energy",
      title: "Solar Energy Installation",
      category: "Renewable Energy",
      priority: "High",
      description: "Install 2MW solar panels on mine office buildings and processing facilities",
      co2Reduction: "1,450 tonnes/year",
      costSaving: "₹18.5 lakhs/year",
      investment: "₹2.1 crores",
      roi: "8.7 years",
      implementation: "6-8 months",
      impact: 85,
      feasibility: 92,
      aiConfidence: 94
    },
    {
      id: "led-lighting",
      title: "LED Lighting Upgrade",
      category: "Energy Efficiency",
      priority: "Medium",
      description: "Replace all conventional lighting with LED systems across mining operations",
      co2Reduction: "320 tonnes/year",
      costSaving: "₹4.2 lakhs/year",
      investment: "₹15 lakhs",
      roi: "3.5 years",
      implementation: "2-3 months",
      impact: 45,
      feasibility: 98,
      aiConfidence: 96
    },
    {
      id: "electric-vehicles",
      title: "Electric Vehicle Fleet",
      category: "Transportation",
      priority: "High",
      description: "Transition 60% of light vehicle fleet to electric vehicles",
      co2Reduction: "890 tonnes/year",
      costSaving: "₹12.8 lakhs/year",
      investment: "₹85 lakhs",
      roi: "6.6 years",
      implementation: "12-18 months",
      impact: 70,
      feasibility: 78,
      aiConfidence: 88
    },
    {
      id: "methane-capture",
      title: "Methane Capture System",
      category: "Process Optimization",
      priority: "High",
      description: "Install methane capture and utilization system for mine ventilation",
      co2Reduction: "2,150 tonnes/year",
      costSaving: "₹24.5 lakhs/year",
      investment: "₹3.5 crores",
      roi: "14.3 years",
      implementation: "18-24 months",
      impact: 95,
      feasibility: 65,
      aiConfidence: 82
    },
    {
      id: "afforestation",
      title: "Large Scale Afforestation",
      category: "Carbon Sequestration",
      priority: "Medium",
      description: "Plant 50,000 trees across 200 hectares of mine periphery",
      co2Reduction: "2,500 tonnes/year",
      costSaving: "₹0/year",
      investment: "₹45 lakhs",
      roi: "Carbon credits",
      implementation: "6-12 months",
      impact: 80,
      feasibility: 88,
      aiConfidence: 91
    }
  ];

  const handleApplyStrategy = (strategyId: string) => {
    const strategy = strategicRecommendations.find(s => s.id === strategyId);
    setSelectedStrategy(strategyId);
    toast({
      title: "Strategy Application Initiated",
      description: `${strategy?.title} has been added to your implementation plan`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Renewable Energy": return "☀️";
      case "Energy Efficiency": return "💡";
      case "Transportation": return "🚗";
      case "Process Optimization": return "⚙️";
      case "Carbon Sequestration": return "🌳";
      default: return "📊";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Strategy Recommendations</h1>
          <p className="text-gray-600 mt-1">Personalized carbon reduction strategies for your mine</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select defaultValue="all-categories">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              <SelectItem value="renewable-energy">Renewable Energy</SelectItem>
              <SelectItem value="energy-efficiency">Energy Efficiency</SelectItem>
              <SelectItem value="transportation">Transportation</SelectItem>
              <SelectItem value="process-optimization">Process Optimization</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Generate New Analysis</Button>
        </div>
      </div>

      {/* AI Analysis Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">🤖</span>
            <span>AI Analysis Summary</span>
          </CardTitle>
          <CardDescription>
            Based on your mine's emission profile and industry best practices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-gray-600">Strategies Identified</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">7,310</div>
              <div className="text-sm text-gray-600">Potential CO₂ Reduction (tonnes/year)</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">₹60L</div>
              <div className="text-sm text-gray-600">Annual Cost Savings</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-orange-600">89%</div>
              <div className="text-sm text-gray-600">AI Confidence Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="implementation">Implementation Plan</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {strategicRecommendations.map((strategy) => (
              <Card key={strategy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getCategoryIcon(strategy.category)}</span>
                      <div>
                        <CardTitle className="text-xl">{strategy.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {strategy.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getPriorityColor(strategy.priority)}>
                        {strategy.priority} Priority
                      </Badge>
                      <Badge variant="outline">
                        {strategy.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="font-semibold text-green-700">{strategy.co2Reduction}</div>
                      <div className="text-xs text-gray-600">CO₂ Reduction</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="font-semibold text-blue-700">{strategy.costSaving}</div>
                      <div className="text-xs text-gray-600">Annual Savings</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="font-semibold text-orange-700">{strategy.investment}</div>
                      <div className="text-xs text-gray-600">Investment</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="font-semibold text-purple-700">{strategy.roi}</div>
                      <div className="text-xs text-gray-600">Payback Period</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Environmental Impact</span>
                        <span>{strategy.impact}%</span>
                      </div>
                      <Progress value={strategy.impact} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Implementation Feasibility</span>
                        <span>{strategy.feasibility}%</span>
                      </div>
                      <Progress value={strategy.feasibility} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>AI Confidence</span>
                        <span>{strategy.aiConfidence}%</span>
                      </div>
                      <Progress value={strategy.aiConfidence} className="h-2" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Implementation Time:</span> {strategy.implementation}
                    </div>
                    <div className="space-x-3">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button 
                        onClick={() => handleApplyStrategy(strategy.id)}
                        className="sustainability-gradient text-white"
                        size="sm"
                      >
                        Apply Strategy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Roadmap</CardTitle>
              <CardDescription>
                Phased approach to implementing your carbon reduction strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-lg">Phase 1: Quick Wins (0-6 months)</h3>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    <li>• LED Lighting Upgrade - ₹15L investment, 320 tonnes CO₂ reduction</li>
                    <li>• Energy Audit and Basic Efficiency Measures</li>
                    <li>• Employee Training and Awareness Programs</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-semibold text-lg">Phase 2: Medium-term Projects (6-18 months)</h3>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    <li>• Solar Energy Installation - ₹2.1Cr investment, 1,450 tonnes CO₂ reduction</li>
                    <li>• Electric Vehicle Fleet Transition</li>
                    <li>• Afforestation Program Launch</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-lg">Phase 3: Complex Systems (18+ months)</h3>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    <li>• Methane Capture System - ₹3.5Cr investment, 2,150 tonnes CO₂ reduction</li>
                    <li>• Advanced Process Optimization</li>
                    <li>• Carbon Credit Program Development</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Model Performance</CardTitle>
                <CardDescription>
                  How our recommendation engine analyzed your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Data Quality Score</span>
                  <span className="font-semibold">92%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Model Accuracy</span>
                  <span className="font-semibold">89%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Prediction Confidence</span>
                  <span className="font-semibold">94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Similar Mines Analyzed</span>
                  <span className="font-semibold">247</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Smart Assistant</CardTitle>
                <CardDescription>
                  AI-powered guidance for your carbon journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm">
                      <strong>💡 Smart Tip:</strong> Based on your current emission patterns, 
                      prioritizing renewable energy will yield the highest ROI within 2 years.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm">
                      <strong>🎯 Goal Insight:</strong> You're 67% of the way to your 2024 
                      reduction target. Focus on transportation electrification to close the gap.
                    </p>
                  </div>
                  <Button className="w-full" variant="outline">
                    💬 Chat with AI Assistant
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Strategy;
