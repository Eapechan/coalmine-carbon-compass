import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { getAvailableActivityTypes, calculateCO2Emission, formatCO2Value } from "@/lib/calculations";
import { Loader2, Plus, Upload, Download } from "lucide-react";
import CSVUpload from "@/components/CSVUpload";

const EmissionInput = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { emissions, addEmission, deleteEmission } = useData();
  
  const [formData, setFormData] = useState({
    activityType: "",
    quantity: "",
    unit: "",
    date: "",
    location: "",
    notes: ""
  });
  
  const [calculatedCO2, setCalculatedCO2] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const activityTypes = getAvailableActivityTypes();

  // Set today's date as default
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date: today }));
  }, []);

  const calculateCO2 = () => {
    if (formData.activityType && formData.quantity) {
      try {
        const co2 = calculateCO2Emission(formData.activityType, parseFloat(formData.quantity));
        setCalculatedCO2(co2);
      } catch (error) {
        setCalculatedCO2(0);
        console.error('Calculation error:', error);
      }
    }
  };

  useEffect(() => {
    calculateCO2();
  }, [formData.activityType, formData.quantity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.activityType || !formData.quantity || !formData.date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const activityType = activityTypes.find(a => a.value === formData.activityType);
      
      addEmission({
        date: formData.date,
        activityType: activityType?.label || formData.activityType,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        co2e: calculatedCO2,
        location: formData.location || undefined,
        notes: formData.notes || undefined,
        userId: user?.id || '',
        mineId: user?.mineId
      });

      // Reset form
      setFormData({
        activityType: "",
        quantity: "",
        unit: "",
        date: new Date().toISOString().split('T')[0],
        location: "",
        notes: ""
      });
      setCalculatedCO2(0);

      toast({
        title: "Emission Data Saved",
        description: `Successfully logged ${formatCO2Value(calculatedCO2)}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save emission data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteEmission(id);
    toast({
      title: "Emission Deleted",
      description: "Emission entry has been removed",
    });
  };

  const handleBulkUpload = () => {
    toast({
      title: "Bulk Upload",
      description: "CSV upload feature will be implemented soon",
    });
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Activity Type', 'Quantity', 'Unit', 'CO2e (kg)', 'Location', 'Notes'],
      ...emissions.map(emission => [
        emission.date,
        emission.activityType,
        emission.quantity.toString(),
        emission.unit,
        emission.co2e.toString(),
        emission.location || '',
        emission.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emissions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Emission data exported to CSV",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Emission Data Input</h1>
        <p className="text-gray-600 mt-1">Log your coal mine's carbon emissions</p>
      </div>

      <Tabs defaultValue="manual" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Emission Entry</CardTitle>
                  <CardDescription>
                    Enter emission data for automatic CO₂e calculation using IPCC standards
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
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
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
                            <p className="text-sm text-green-600">Based on IPCC emission factors</p>
                          </div>
                          <Badge className="text-lg px-3 py-1 bg-green-600">
                            {formatCO2Value(calculatedCO2)}
                          </Badge>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <Button 
                        type="submit" 
                        className="sustainability-gradient text-white"
                        disabled={isSubmitting || calculatedCO2 === 0}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Save Emission Data
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Recent Entries */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Entries</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleExport}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    Latest emission data entries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {emissions.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{entry.activityType}</div>
                          <div className="text-xs text-gray-500">
                            {entry.date} • {entry.quantity} {entry.unit}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-sm text-green-600">
                            {formatCO2Value(entry.co2e)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(entry.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    {emissions.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        No emission entries yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <CSVUpload />
        </TabsContent>
      </Tabs>

      {/* All Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Emission Entries</CardTitle>
          <CardDescription>
            Complete history of emission data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>CO₂e</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emissions.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell>{entry.activityType}</TableCell>
                  <TableCell>{entry.quantity} {entry.unit}</TableCell>
                  <TableCell className="font-medium text-green-600">
                    {formatCO2Value(entry.co2e)}
                  </TableCell>
                  <TableCell>{entry.location || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {emissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No emission entries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmissionInput;
