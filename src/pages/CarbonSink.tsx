
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const CarbonSink = () => {
  const { toast } = useToast();
  const [sinkData, setSinkData] = useState({
    landArea: "",
    vegetationType: "",
    plantingDensity: "",
    soilType: "",
    location: "",
    projectDuration: "20"
  });
  
  const [offsetPotential, setOffsetPotential] = useState(0);
  const [annualOffset, setAnnualOffset] = useState(0);

  const vegetationTypes = [
    { value: "mixed-forest", label: "Mixed Forest", factor: 12.5, unit: "tonnes CO₂/hectare/year" },
    { value: "eucalyptus", label: "Eucalyptus Plantation", factor: 15.2, unit: "tonnes CO₂/hectare/year" },
    { value: "bamboo", label: "Bamboo Grove", factor: 18.7, unit: "tonnes CO₂/hectare/year" },
    { value: "teak", label: "Teak Plantation", factor: 11.8, unit: "tonnes CO₂/hectare/year" },
    { value: "mangrove", label: "Mangrove Forest", factor: 22.3, unit: "tonnes CO₂/hectare/year" },
    { value: "grassland", label: "Restored Grassland", factor: 3.2, unit: "tonnes CO₂/hectare/year" }
  ];

  const soilTypes = [
    { value: "clay", label: "Clay Soil", multiplier: 1.1 },
    { value: "loam", label: "Loam Soil", multiplier: 1.0 },
    { value: "sandy", label: "Sandy Soil", multiplier: 0.8 },
    { value: "degraded", label: "Degraded Soil", multiplier: 0.7 }
  ];

  const calculateOffset = () => {
    const vegetation = vegetationTypes.find(v => v.value === sinkData.vegetationType);
    const soil = soilTypes.find(s => s.value === sinkData.soilType);
    
    if (vegetation && soil && sinkData.landArea) {
      const area = parseFloat(sinkData.landArea);
      const annual = area * vegetation.factor * soil.multiplier;
      const total = annual * parseInt(sinkData.projectDuration);
      
      setAnnualOffset(annual);
      setOffsetPotential(total);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateOffset();
    toast({
      title: "Carbon Sink Calculated",
      description: `Potential offset: ${offsetPotential.toFixed(2)} tonnes CO₂ over ${sinkData.projectDuration} years`,
    });
  };

  // Mock existing projects
  const existingProjects = [
    { 
      id: 1, 
      name: "Mine Block A Afforestation", 
      area: "25 hectares", 
      type: "Mixed Forest", 
      status: "Active",
      annualOffset: "312.5 tonnes CO₂/year",
      established: "2022"
    },
    { 
      id: 2, 
      name: "Waste Dump Rehabilitation", 
      area: "15 hectares", 
      type: "Eucalyptus", 
      status: "Planned",
      annualOffset: "228 tonnes CO₂/year",
      established: "2024"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Carbon Sink Calculator</h1>
        <p className="text-gray-600 mt-1">Calculate carbon offset potential from afforestation and land restoration</p>
      </div>

      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calculator">New Project Calculator</TabsTrigger>
          <TabsTrigger value="existing">Existing Projects</TabsTrigger>
          <TabsTrigger value="map">Site Map</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calculator Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Carbon Sink Project Calculator</CardTitle>
                  <CardDescription>
                    Enter project details to estimate carbon offset potential
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="landArea">Land Area (hectares) *</Label>
                        <Input
                          id="landArea"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 10.5"
                          value={sinkData.landArea}
                          onChange={(e) => {
                            setSinkData({ ...sinkData, landArea: e.target.value });
                            calculateOffset();
                          }}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vegetationType">Vegetation Type *</Label>
                        <Select 
                          value={sinkData.vegetationType} 
                          onValueChange={(value) => {
                            setSinkData({ ...sinkData, vegetationType: value });
                            calculateOffset();
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select vegetation type" />
                          </SelectTrigger>
                          <SelectContent>
                            {vegetationTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="soilType">Soil Type</Label>
                        <Select 
                          value={sinkData.soilType} 
                          onValueChange={(value) => {
                            setSinkData({ ...sinkData, soilType: value });
                            calculateOffset();
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select soil type" />
                          </SelectTrigger>
                          <SelectContent>
                            {soilTypes.map((soil) => (
                              <SelectItem key={soil.value} value={soil.value}>
                                {soil.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="projectDuration">Project Duration (years)</Label>
                        <Select 
                          value={sinkData.projectDuration} 
                          onValueChange={(value) => {
                            setSinkData({ ...sinkData, projectDuration: value });
                            calculateOffset();
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10 years</SelectItem>
                            <SelectItem value="15">15 years</SelectItem>
                            <SelectItem value="20">20 years</SelectItem>
                            <SelectItem value="25">25 years</SelectItem>
                            <SelectItem value="30">30 years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Project Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Mine Block A, GPS coordinates, etc."
                        value={sinkData.location}
                        onChange={(e) => setSinkData({ ...sinkData, location: e.target.value })}
                      />
                    </div>

                    {/* Results Display */}
                    {offsetPotential > 0 && (
                      <div className="space-y-4 p-6 bg-green-50 border border-green-200 rounded-lg">
                        <h3 className="font-semibold text-green-800 text-lg">Carbon Offset Potential</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {annualOffset.toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-600">tonnes CO₂/year</div>
                            <div className="text-xs text-gray-500 mt-1">Annual Offset</div>
                          </div>
                          
                          <div className="text-center p-4 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-green-700">
                              {offsetPotential.toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-600">tonnes CO₂ total</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Over {sinkData.projectDuration} years
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                          <div className="text-sm text-blue-800">
                            <strong>Equivalent Impact:</strong> This project could offset approximately{" "}
                            <strong>{Math.round(offsetPotential / 2.3)}</strong> average cars for one year
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <Button type="submit" className="sustainability-gradient text-white">
                        Save Project
                      </Button>
                      <Button type="button" variant="outline" onClick={calculateOffset}>
                        Recalculate
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Information */}
            <div className="space-y-6">
              {/* Carbon Sequestration Rates */}
              <Card>
                <CardHeader>
                  <CardTitle>Sequestration Rates</CardTitle>
                  <CardDescription>
                    CO₂ absorption by vegetation type
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {vegetationTypes.map((type) => (
                    <div key={type.value} className="flex justify-between text-sm">
                      <span className="text-gray-600">{type.label}</span>
                      <span className="font-medium">{type.factor} t/ha/yr</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Best Practices */}
              <Card>
                <CardHeader>
                  <CardTitle>Best Practices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500">🌱</span>
                    <span>Choose native species for better survival rates</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500">💧</span>
                    <span>Ensure adequate water supply during establishment</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500">🔬</span>
                    <span>Conduct soil testing before plantation</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500">📊</span>
                    <span>Monitor growth regularly for accurate offset calculation</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="existing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Existing Carbon Sink Projects</CardTitle>
              <CardDescription>
                Your current afforestation and restoration projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {existingProjects.map((project) => (
                  <div key={project.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <p className="text-sm text-gray-600">
                          {project.area} • {project.type} • Est. {project.established}
                        </p>
                      </div>
                      <Badge variant={project.status === "Active" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="font-semibold text-green-700">{project.annualOffset}</div>
                        <div className="text-xs text-gray-600">Annual Offset</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="font-semibold text-blue-700">85%</div>
                        <div className="text-xs text-gray-600">Survival Rate</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded">
                        <div className="font-semibold text-orange-700">₹2.1L</div>
                        <div className="text-xs text-gray-600">Investment</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Site Mapping</CardTitle>
              <CardDescription>
                Visualize and plan your carbon sink projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-4">🗺️</div>
                  <p className="text-lg font-medium">Interactive Map Coming Soon</p>
                  <p className="text-sm mt-2">
                    Integration with Google Maps and GIS data upload
                  </p>
                  <Button className="mt-4" variant="outline">
                    Upload GIS Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CarbonSink;
