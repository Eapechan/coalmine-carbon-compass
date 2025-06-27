import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { getAvailableSinkTypes, calculateCarbonSink, formatCO2Value } from "@/lib/calculations";
import { Loader2, Plus, TreePine, Leaf, MapPin, Upload, Map, Globe, FileText } from "lucide-react";

// Vegetation types with carbon sequestration rates (tonnes CO2e per hectare per year)
const VEGETATION_TYPES = [
  { value: "dense_forest", label: "Dense Forest", rate: 6.5, description: "Mature forest with high canopy density" },
  { value: "mixed_forest", label: "Mixed Forest", rate: 5.2, description: "Mixed species forest" },
  { value: "plantation", label: "Tree Plantation", rate: 4.8, description: "Managed tree plantation" },
  { value: "bamboo", label: "Bamboo Forest", rate: 3.8, description: "Bamboo groves and plantations" },
  { value: "grassland", label: "Grassland/Pasture", rate: 1.2, description: "Natural grasslands and pastures" },
  { value: "wetland", label: "Wetland/Marsh", rate: 2.1, description: "Wetlands and marsh areas" },
  { value: "mangrove", label: "Mangrove Forest", rate: 4.2, description: "Coastal mangrove ecosystems" },
  { value: "agroforestry", label: "Agroforestry", rate: 2.8, description: "Agricultural land with trees" },
  { value: "urban_green", label: "Urban Green Space", rate: 1.5, description: "Urban parks and green areas" },
  { value: "reclamation", label: "Mine Reclamation", rate: 2.3, description: "Reclaimed mining areas" }
];

const CarbonSink = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { carbonSinks, addCarbonSink, deleteCarbonSink, getTotalCarbonSinks } = useData();
  
  const [formData, setFormData] = useState({
    sinkType: "",
    quantity: "",
    unit: "",
    date: "",
    location: "",
    description: ""
  });

  // Advanced calculator state
  const [landArea, setLandArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("hectares");
  const [vegetationType, setVegetationType] = useState("");
  const [projectDuration, setProjectDuration] = useState("25");
  const [mapCoordinates, setMapCoordinates] = useState({ lat: "", lng: "" });
  const [showMap, setShowMap] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [mapsLink, setMapsLink] = useState("");
  
  const [calculatedCO2, setCalculatedCO2] = useState(0);
  const [advancedCalculatedCO2, setAdvancedCalculatedCO2] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const sinkTypes = getAvailableSinkTypes();

  // Set today's date as default
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date: today }));
  }, []);

  const calculateOffset = () => {
    if (formData.sinkType && formData.quantity) {
      try {
        const co2 = calculateCarbonSink(formData.sinkType, parseFloat(formData.quantity));
        setCalculatedCO2(co2);
      } catch (error) {
        setCalculatedCO2(0);
        console.error('Calculation error:', error);
      }
    }
  };

  const calculateAdvancedOffset = () => {
    if (landArea && vegetationType && projectDuration) {
      try {
        const area = parseFloat(landArea);
        const duration = parseFloat(projectDuration);
        const vegetation = VEGETATION_TYPES.find(v => v.value === vegetationType);
        
        if (vegetation) {
          // Convert area to hectares if needed
          let areaInHectares = area;
          if (areaUnit === "acres") {
            areaInHectares = area * 0.404686;
          } else if (areaUnit === "sqkm") {
            areaInHectares = area * 100;
          }
          
          const annualSequestration = areaInHectares * vegetation.rate;
          const totalSequestration = annualSequestration * duration;
          
          setAdvancedCalculatedCO2(totalSequestration);
        }
      } catch (error) {
        setAdvancedCalculatedCO2(0);
        console.error('Advanced calculation error:', error);
      }
    }
  };

  useEffect(() => {
    calculateOffset();
  }, [formData.sinkType, formData.quantity]);

  useEffect(() => {
    calculateAdvancedOffset();
  }, [landArea, vegetationType, projectDuration, areaUnit]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
    }
  };

  const handleMapClick = () => {
    setShowMap(!showMap);
    if (!showMap) {
      // Simulate getting coordinates (in real app, this would integrate with Google Maps API)
      setMapCoordinates({ lat: "23.5937", lng: "78.9629" }); // Default to India center
    }
  };

  const parseGoogleMapsLink = (link: string) => {
    try {
      // Handle different Google Maps URL formats
      let coordinates = null;
      
      // Format 1: https://www.google.com/maps/place/.../@lat,lng,zoom
      const placeMatch = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (placeMatch) {
        coordinates = { lat: placeMatch[1], lng: placeMatch[2] };
      }
      
      // Format 2: https://www.google.com/maps?q=lat,lng
      const queryMatch = link.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (queryMatch) {
        coordinates = { lat: queryMatch[1], lng: queryMatch[2] };
      }
      
      // Format 3: https://maps.google.com/?ll=lat,lng
      const llMatch = link.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (llMatch) {
        coordinates = { lat: llMatch[1], lng: llMatch[2] };
      }
      
      // Format 4: https://www.google.com/maps/dir/.../@lat,lng
      const dirMatch = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (dirMatch) {
        coordinates = { lat: dirMatch[1], lng: dirMatch[2] };
      }
      
      // Format 5: Shortened URLs (maps.app.goo.gl) - these need to be expanded first
      if (link.includes('maps.app.goo.gl') || link.includes('goo.gl/maps')) {
        // For shortened URLs, we'll need to handle them differently
        // For now, we'll show a message to the user
        return { error: "shortened_url" };
      }
      
      // Format 6: https://www.google.com/maps?q=place+name+lat,lng
      const placeQueryMatch = link.match(/[?&]q=[^&]*?(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (placeQueryMatch) {
        coordinates = { lat: placeQueryMatch[1], lng: placeQueryMatch[2] };
      }
      
      // Format 7: https://maps.google.com/maps?q=lat,lng
      const mapsQueryMatch = link.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (mapsQueryMatch) {
        coordinates = { lat: mapsQueryMatch[1], lng: mapsQueryMatch[2] };
      }
      
      return coordinates;
    } catch (error) {
      console.error('Error parsing Google Maps link:', error);
      return null;
    }
  };

  const handleMapsLinkPaste = async (link: string) => {
    setMapsLink(link);

    // If it's a shortened URL, expand it via backend
    if (link.includes('maps.app.goo.gl') || link.includes('goo.gl/maps')) {
      try {
        const res = await fetch(`http://localhost:3001/expand?url=${encodeURIComponent(link)}`);
        const data = await res.json();
        if (data.expanded) {
          // Now parse the expanded URL for coordinates
          const coords = parseGoogleMapsLink(data.expanded);
          if (coords && coords.lat && coords.lng) {
            setMapCoordinates(coords);
            toast({
              title: "Location Detected",
              description: `Coordinates extracted: ${coords.lat}, ${coords.lng}`,
            });
          } else {
            toast({
              title: "Invalid Expanded Link",
              description: "Could not extract coordinates from the expanded link.",
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Expansion Failed",
            description: data.error || "Could not expand the shortened URL.",
            variant: "destructive"
          });
        }
      } catch (err) {
        toast({
          title: "Expansion Error",
          description: "Failed to expand the shortened URL.",
          variant: "destructive"
        });
      }
      return;
    }

    // ...existing logic for full URLs...
    const result = parseGoogleMapsLink(link);
    if (result && result.lat && result.lng) {
      setMapCoordinates(result);
      toast({
        title: "Location Detected",
        description: `Coordinates extracted: ${result.lat}, ${result.lng}`,
      });
    } else {
      toast({
        title: "Invalid Link",
        description: "Please paste a valid Google Maps link with coordinates. Try right-clicking on the location in Google Maps and selecting 'Share' → 'Copy link'.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sinkType || !formData.quantity || !formData.date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const sinkType = sinkTypes.find(s => s.value === formData.sinkType);
      
      addCarbonSink({
        date: formData.date,
        sinkType: sinkType?.label || formData.sinkType,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        co2e: calculatedCO2,
        location: formData.location || undefined,
        description: formData.description || undefined,
        userId: user?.id || '',
        mineId: user?.mineId
      });

      // Reset form
      setFormData({
        sinkType: "",
        quantity: "",
        unit: "",
        date: new Date().toISOString().split('T')[0],
        location: "",
        description: ""
      });
      setCalculatedCO2(0);

      toast({
        title: "Carbon Sink Added",
        description: `Successfully added ${formatCO2Value(calculatedCO2)} carbon offset`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add carbon sink. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdvancedSubmit = async () => {
    if (!landArea || !vegetationType || !projectDuration) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields for land area calculation",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const vegetation = VEGETATION_TYPES.find(v => v.value === vegetationType);
      
      addCarbonSink({
        date: new Date().toISOString().split('T')[0],
        sinkType: `Land Area - ${vegetation?.label}`,
        quantity: parseFloat(landArea),
        unit: areaUnit,
        co2e: advancedCalculatedCO2,
        location: mapCoordinates.lat && mapCoordinates.lng 
          ? `${mapCoordinates.lat}, ${mapCoordinates.lng}` 
          : undefined,
        description: `Land area project: ${landArea} ${areaUnit} of ${vegetation?.label}. Project duration: ${projectDuration} years.`,
        userId: user?.id || '',
        mineId: user?.mineId
      });

      // Reset advanced form
      setLandArea("");
      setVegetationType("");
      setProjectDuration("25");
      setMapCoordinates({ lat: "", lng: "" });
      setAdvancedCalculatedCO2(0);

      toast({
        title: "Land Area Project Added",
        description: `Successfully added ${formatCO2Value(advancedCalculatedCO2)} carbon offset`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add land area project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteCarbonSink(id);
    toast({
      title: "Carbon Sink Deleted",
      description: "Carbon sink entry has been removed",
    });
  };

  const totalCarbonSinks = getTotalCarbonSinks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Carbon Sink Management</h1>
        <p className="text-gray-600 mt-1">Track and manage carbon offset projects and initiatives</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Carbon Offsets
            </CardTitle>
            <TreePine className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCO2Value(totalCarbonSinks)}
            </div>
            <p className="text-xs text-gray-500">
              Total carbon sequestration achieved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Projects
            </CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {carbonSinks.length}
            </div>
            <p className="text-xs text-gray-500">
              Carbon sink initiatives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Offset
            </CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {carbonSinks.length > 0 ? formatCO2Value(totalCarbonSinks / carbonSinks.length) : '0 kg CO₂e'}
            </div>
            <p className="text-xs text-gray-500">
              Per project average
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="add" className="space-y-6">
        <TabsList>
          <TabsTrigger value="add">Add New Sink</TabsTrigger>
          <TabsTrigger value="land-calculator">Land Area Calculator</TabsTrigger>
          <TabsTrigger value="projects">All Projects</TabsTrigger>
          <TabsTrigger value="calculator">Advanced Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Carbon Sink</CardTitle>
                  <CardDescription>
                    Log carbon offset activities and projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sinkType">Sink Type *</Label>
                        <Select 
                          value={formData.sinkType} 
                          onValueChange={(value) => {
                            setFormData({ ...formData, sinkType: value });
                            const sink = sinkTypes.find(s => s.value === value);
                            if (sink) {
                              setFormData(prev => ({ ...prev, unit: sink.unit }));
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select sink type" />
                          </SelectTrigger>
                          <SelectContent>
                            {sinkTypes.map((type) => (
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
                      <Label htmlFor="location">Location/Project Site</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Mine Reclamation Area, Block A"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Project Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the carbon sink project or activity..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    {/* Calculated CO2 Display */}
                    {calculatedCO2 > 0 && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-green-800">Calculated Carbon Offset</h3>
                            <p className="text-sm text-green-600">Based on standard sequestration factors</p>
                          </div>
                          <Badge className="text-lg px-3 py-1 bg-green-600">
                            {formatCO2Value(calculatedCO2)}
                          </Badge>
                        </div>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="sustainability-gradient text-white"
                      disabled={isSubmitting || calculatedCO2 === 0}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Carbon Sink
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>
                    Latest carbon sink initiatives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {carbonSinks.slice(0, 5).map((sink) => (
                      <div key={sink.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{sink.sinkType}</div>
                          <div className="text-xs text-gray-500">
                            {sink.date} • {sink.quantity} {sink.unit}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-sm text-green-600">
                            {formatCO2Value(sink.co2e)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(sink.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    {carbonSinks.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        No carbon sink projects yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="land-calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Land Area Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Land Area Carbon Calculator</CardTitle>
                <CardDescription>
                  Calculate carbon offset potential based on land area and vegetation type
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="landArea">Land Area *</Label>
                    <Input
                      id="landArea"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 100"
                      value={landArea}
                      onChange={(e) => setLandArea(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="areaUnit">Area Unit</Label>
                    <Select value={areaUnit} onValueChange={setAreaUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hectares">Hectares</SelectItem>
                        <SelectItem value="acres">Acres</SelectItem>
                        <SelectItem value="sqkm">Square Kilometers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vegetationType">Vegetation Type *</Label>
                  <Select value={vegetationType} onValueChange={setVegetationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vegetation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {VEGETATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex flex-col">
                            <span>{type.label}</span>
                            <span className="text-xs text-gray-500">{type.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectDuration">Project Duration (Years) *</Label>
                  <Input
                    id="projectDuration"
                    type="number"
                    min="1"
                    max="100"
                    value={projectDuration}
                    onChange={(e) => setProjectDuration(e.target.value)}
                  />
                </div>

                {/* Map Integration */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Location Mapping</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleMapClick}
                      className="flex items-center gap-2"
                    >
                      <Map className="h-4 w-4" />
                      {showMap ? "Hide Map" : "Show Map"}
                    </Button>
                  </div>

                  {/* Google Maps Link Input */}
                  <div className="space-y-2">
                    <Label>Paste Google Maps Link</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Paste Google Maps URL here..."
                        value={mapsLink}
                        onChange={(e) => setMapsLink(e.target.value)}
                        onPaste={(e) => {
                          const pastedText = e.clipboardData.getData('text');
                          if (pastedText.includes('google.com/maps') || pastedText.includes('maps.google.com')) {
                            setTimeout(() => handleMapsLinkPaste(pastedText), 100);
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleMapsLinkPaste(mapsLink)}
                        disabled={!mapsLink.trim()}
                      >
                        Extract
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Supports Google Maps place, directions, and coordinate links. Auto-detects when you paste a link!
                      <br />
                      <strong>Tip:</strong> Right-click on a location in Google Maps → "Share" → "Copy link" for the best results.
                    </p>
                  </div>
                  
                  {showMap && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Latitude</Label>
                          <Input
                            placeholder="e.g., 23.5937"
                            value={mapCoordinates.lat}
                            onChange={(e) => setMapCoordinates(prev => ({ ...prev, lat: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Longitude</Label>
                          <Input
                            placeholder="e.g., 78.9629"
                            value={mapCoordinates.lng}
                            onChange={(e) => setMapCoordinates(prev => ({ ...prev, lng: e.target.value }))}
                          />
                        </div>
                      </div>

                      {/* Google Maps Preview */}
                      {mapCoordinates.lat && mapCoordinates.lng && (
                        <div className="rounded-lg overflow-hidden border mt-2">
                          <iframe
                            width="100%"
                            height="200"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://www.google.com/maps?q=${mapCoordinates.lat},${mapCoordinates.lng}&z=16&output=embed`}
                            title="Map Preview"
                          />
                        </div>
                      )}

                      {/* Placeholder for Google Maps integration */}
                      <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <div className="text-center">
                          <Globe className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Google Maps Integration</p>
                          <p className="text-xs text-gray-400">Click to set coordinates</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label>Upload GIS Data (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-2">
                          Upload shapefiles, KML, or CSV files
                        </p>
                        <input
                          type="file"
                          accept=".shp,.kml,.csv,.geojson"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Choose File
                        </label>
                        {uploadedFile && (
                          <p className="text-xs text-green-600 mt-2">
                            ✓ {uploadedFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculated Results */}
                {advancedCalculatedCO2 > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-green-800">Carbon Offset Potential</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Annual Sequestration:</span>
                          <div className="font-medium text-green-600">
                            {formatCO2Value(advancedCalculatedCO2 / parseFloat(projectDuration))}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Project:</span>
                          <div className="font-medium text-green-600">
                            {formatCO2Value(advancedCalculatedCO2)}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-green-600">
                        Based on {vegetationType && VEGETATION_TYPES.find(v => v.value === vegetationType)?.label} 
                        at {landArea} {areaUnit} over {projectDuration} years
                      </p>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleAdvancedSubmit}
                  className="sustainability-gradient text-white w-full"
                  disabled={isSubmitting || advancedCalculatedCO2 === 0}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Project...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Land Area Project
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Vegetation Information */}
            <Card>
              <CardHeader>
                <CardTitle>Vegetation Types & Rates</CardTitle>
                <CardDescription>
                  Carbon sequestration rates per hectare per year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {VEGETATION_TYPES.map((type) => (
                    <div key={type.value} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {type.rate} t CO₂e/ha/yr
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Calculation Method</h4>
                  <p className="text-sm text-blue-700">
                    Carbon sequestration is calculated using IPCC guidelines and regional factors 
                    for Indian conditions. Rates vary based on climate, soil type, and management practices.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Carbon Sink Projects</CardTitle>
              <CardDescription>
                Complete history of carbon offset initiatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Project Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Carbon Offset</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carbonSinks.map((sink) => (
                    <TableRow key={sink.id}>
                      <TableCell>{new Date(sink.date).toLocaleDateString()}</TableCell>
                      <TableCell>{sink.sinkType}</TableCell>
                      <TableCell>{sink.quantity} {sink.unit}</TableCell>
                      <TableCell className="font-medium text-green-600">
                        {formatCO2Value(sink.co2e)}
                      </TableCell>
                      <TableCell>{sink.location || '-'}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(sink.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {carbonSinks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                        No carbon sink projects found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Carbon Sink Calculator</CardTitle>
              <CardDescription>
                Calculate potential carbon offsets for different project types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Tree Plantation Calculator</h3>
                  <div className="space-y-2">
                    <Label>Number of Trees</Label>
                    <Input type="number" placeholder="e.g., 1000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tree Species</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select species" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="native">Native Species</SelectItem>
                        <SelectItem value="eucalyptus">Eucalyptus</SelectItem>
                        <SelectItem value="bamboo">Bamboo</SelectItem>
                        <SelectItem value="teak">Teak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-800">
                      Estimated annual carbon sequestration: <strong>25 tonnes CO₂e</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Renewable Energy Calculator</h3>
                  <div className="space-y-2">
                    <Label>Solar Capacity (kW)</Label>
                    <Input type="number" placeholder="e.g., 500" />
                  </div>
                  <div className="space-y-2">
                    <Label>Annual Generation (kWh)</Label>
                    <Input type="number" placeholder="e.g., 750000" />
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-800">
                      Estimated annual CO₂ avoidance: <strong>615 tonnes CO₂e</strong>
                    </div>
                  </div>
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
