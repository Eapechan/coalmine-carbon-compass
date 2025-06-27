
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const EmissionInput = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    activityType: "",
    quantity: "",
    unit: "",
    date: "",
    location: "",
    notes: ""
  });
  
  const [calculatedCO2, setCalculatedCO2] = useState(0);
  
  // Mock recent entries
  const recentEntries = [
    { id: 1, date: "2024-01-15", activity: "Diesel Fuel", quantity: "5000 L", co2e: "13.26 tonnes" },
    { id: 2, date: "2024-01-14", activity: "Electricity", quantity: "8500 kWh", co2e: "6.38 tonnes" },
    { id: 3, date: "2024-01-13", activity: "Transport", quantity: "2500 km", co2e: "4.15 tonnes" },
  ];

  const activityTypes = [
    { value: "diesel", label: "Diesel Fuel", factor: 2.65, unit: "litres" },
    { value: "petrol", label: "Petrol", factor: 2.31, unit: "litres" },
    { value: "electricity", label: "Electricity", factor: 0.82, unit: "kWh" },
    { value: "coal", label: "Coal Combustion", factor: 2.42, unit: "tonnes" },
    { value: "transport", label: "Vehicle Transport", factor: 0.166, unit: "km" },
    { value: "equipment", label: "Heavy Equipment", factor: 3.15, unit: "hours" }
  ];

  const calculateCO2 = () => {
    const activity = activityTypes.find(a => a.value === formData.activityType);
    if (activity && formData.quantity) {
      const co2 = parseFloat(formData.quantity) * activity.factor;
      setCalculatedCO2(co2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateCO2();
    toast({
      title: "Emission Data Saved",
      description: `Successfully logged ${calculatedCO2.toFixed(2)} tonnes CO₂e`,
    });
    console.log("Submitted:", { ...formData, co2e: calculatedCO2 });
  };

  const handleBulkUpload = () => {
    toast({
      title: "Bulk Upload",
      description: "CSV upload feature will be implemented soon",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Emission Data Input</h1>
        <p className="text-gray-600 mt-1">Log your coal mine's carbon emissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Add New Emission Entry</CardTitle>
              <CardDescription>
                Enter emission data for automatic CO₂e calculation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="activityType">Activity Type *</Label>
                    <Select 
                      value={formData.activityType} 
                      onValueChange={(value) => {
                        setFormData({ ...formData, activityType: value });
                        const activity = activityTypes.find(a => a.value === value);
                        if (activity) {
                          setFormData(prev => ({ ...prev, unit: activity.unit }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select emission source" />
                      </SelectTrigger>
                      <SelectContent>
                        {activityTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.01"
                      placeholder="Enter quantity"
                      value={formData.quantity}
                      onChange={(e) => {
                        setFormData({ ...formData, quantity: e.target.value });
                        calculateCO2();
                      }}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location/Mine Section</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Block A, Pit 2, Processing Plant"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional context or details..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Calculated CO2 Display */}
                {calculatedCO2 > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-green-800">Calculated CO₂ Equivalent</h3>
                        <p className="text-sm text-green-600">Based on standard emission factors</p>
                      </div>
                      <Badge className="text-lg px-3 py-1 bg-green-600">
                        {calculatedCO2.toFixed(2)} tonnes CO₂e
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button type="submit" className="sustainability-gradient text-white">
                    Save Emission Data
                  </Button>
                  <Button type="button" variant="outline" onClick={calculateCO2}>
                    Calculate CO₂
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Quick Stats and Bulk Upload */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Entries Logged</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total CO₂e</span>
                <span className="font-semibold">45.8 tonnes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Entry</span>
                <span className="font-semibold">2 hours ago</span>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Bulk Data Upload</CardTitle>
              <CardDescription>
                Upload multiple entries via CSV file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleBulkUpload}
              >
                📄 Upload CSV File
              </Button>
              <div className="text-xs text-gray-500">
                <p>CSV Format: Date, Activity, Quantity, Unit, Location</p>
                <p className="mt-1">Maximum file size: 10MB</p>
              </div>
            </CardContent>
          </Card>

          {/* Emission Factors Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Emission Factors</CardTitle>
              <CardDescription>
                Standard CO₂ conversion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Diesel</span>
                  <span>2.65 kg CO₂/L</span>
                </div>
                <div className="flex justify-between">
                  <span>Electricity</span>
                  <span>0.82 kg CO₂/kWh</span>
                </div>
                <div className="flex justify-between">
                  <span>Coal</span>
                  <span>2.42 kg CO₂/kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport</span>
                  <span>0.166 kg CO₂/km</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>
            Your latest emission data entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Activity Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>CO₂e Generated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.activity}</TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{entry.co2e}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmissionInput;
