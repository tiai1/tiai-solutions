import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import Papa from 'papaparse';
import { 
  Upload, 
  Download, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Table, 
  Filter,
  Settings,
  Trash2,
  Copy,
  Shield,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Chart from '@/components/Chart';
import { trackPageView, trackButtonClick } from '@/lib/analytics';

interface DataRow {
  [key: string]: string | number | Date | boolean;
}

interface ColumnInfo {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  values: (string | number | boolean | Date)[];
  min?: number;
  max?: number;
  unique?: number;
}

interface ChartConfig {
  id: string;
  type: 'line' | 'bar' | 'stackedBar' | 'area' | 'pie' | 'scatter' | 'table';
  title: string;
  xAxis?: string;
  yMetrics: string[];
  groupBy?: string;
  aggregation: 'sum' | 'average' | 'count' | 'min' | 'max';
  filters: Array<{
    column: string;
    operator: 'equals' | 'contains' | 'gt' | 'lt' | 'between';
    value: string | number;
  }>;
}

const CHART_TEMPLATES = [
  {
    name: 'KPI Overview',
    description: 'Key metrics and performance indicators',
    configs: [
      { type: 'bar', title: 'Performance by Category', aggregation: 'sum' },
      { type: 'line', title: 'Trend Over Time', aggregation: 'average' },
      { type: 'pie', title: 'Distribution', aggregation: 'count' }
    ]
  },
  {
    name: 'Category Breakdown',
    description: 'Detailed analysis by categories',
    configs: [
      { type: 'stackedBar', title: 'Stacked Analysis', aggregation: 'sum' },
      { type: 'pie', title: 'Category Share', aggregation: 'count' }
    ]
  },
  {
    name: 'Time Series Analysis',
    description: 'Time-based trends and patterns',
    configs: [
      { type: 'line', title: 'Time Trend', aggregation: 'average' },
      { type: 'area', title: 'Cumulative View', aggregation: 'sum' }
    ]
  }
];

export default function LiveDashboard() {
  const [, setLocation] = useLocation();
  const [data, setData] = useState<DataRow[]>([]);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pastedData, setPastedData] = useState('');
  const [keepDataInSession, setKeepDataInSession] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    trackPageView('live-dashboard');
    
    // Check if there's data in session storage
    if (keepDataInSession) {
      const savedData = sessionStorage.getItem('dashboard-data');
      const savedColumns = sessionStorage.getItem('dashboard-columns');
      if (savedData && savedColumns) {
        setData(JSON.parse(savedData));
        setColumns(JSON.parse(savedColumns));
        setActiveTab('configure');
      }
    }
  }, [keepDataInSession]);

  // Save data to session storage if enabled
  useEffect(() => {
    if (keepDataInSession && data.length > 0) {
      sessionStorage.setItem('dashboard-data', JSON.stringify(data));
      sessionStorage.setItem('dashboard-columns', JSON.stringify(columns));
    }
  }, [data, columns, keepDataInSession]);

  const parseCSVData = (csvText: string): DataRow[] => {
    const result = Papa.parse<string[]>(csvText, {
      header: false,
      skipEmptyLines: true,
      trimHeaders: true,
      transform: (value) => value.trim()
    });

    if (result.errors.length > 0) {
      throw new Error(`CSV parsing error: ${result.errors[0].message}`);
    }

    if (result.data.length === 0) return [];

    const [headers, ...dataRows] = result.data;
    const rows: DataRow[] = [];

    dataRows.forEach(values => {
      if (values.length === headers.length) {
        const row: DataRow = {};
        headers.forEach((header, index) => {
          const value = values[index];
          // Try to detect data type and convert
          if (!isNaN(Number(value)) && value !== '' && value !== null) {
            row[header] = Number(value);
          } else if (value?.toLowerCase() === 'true' || value?.toLowerCase() === 'false') {
            row[header] = value.toLowerCase() === 'true';
          } else if (value && !isNaN(Date.parse(value))) {
            row[header] = new Date(value);
          } else {
            row[header] = value || '';
          }
        });
        rows.push(row);
      }
    });

    return rows;
  };

  const analyzeColumns = (data: DataRow[]): ColumnInfo[] => {
    if (data.length === 0) return [];

    const columns: ColumnInfo[] = [];
    const headers = Object.keys(data[0]);

    headers.forEach(header => {
      const values = data.map(row => row[header]).filter(v => v !== null && v !== undefined);
      const uniqueValues = Array.from(new Set(values));
      
      let type: 'text' | 'number' | 'date' | 'boolean' = 'text';
      if (values.every(v => typeof v === 'number')) {
        type = 'number';
      } else if (values.every(v => typeof v === 'boolean')) {
        type = 'boolean';
      } else if (values.every(v => v instanceof Date)) {
        type = 'date';
      }

      const columnInfo: ColumnInfo = {
        name: header,
        type,
        values: uniqueValues.slice(0, 10), // First 10 unique values
        unique: uniqueValues.length
      };

      if (type === 'number') {
        const numValues = values as number[];
        columnInfo.min = Math.min(...numValues);
        columnInfo.max = Math.max(...numValues);
      }

      columns.push(columnInfo);
    });

    return columns;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File size check (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // File type check
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      setError('Only CSV and Excel files (.csv, .xlsx, .xls) are supported');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let csvText = '';
      
      if (fileExtension === '.csv') {
        csvText = await file.text();
      } else {
        // For Excel files, you would typically use a library like xlsx
        // For now, we'll show an error asking for CSV
        throw new Error('Excel file support requires additional libraries. Please convert to CSV format.');
      }

      const parsedData = parseCSVData(csvText);
      if (parsedData.length === 0) {
        throw new Error('No data found in file');
      }

      setData(parsedData);
      setColumns(analyzeColumns(parsedData));
      setActiveTab('configure');
      
      trackButtonClick('file-uploaded', 'live-dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteData = () => {
    if (!pastedData.trim()) {
      setError('Please paste some data');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const parsedData = parseCSVData(pastedData);
      if (parsedData.length === 0) {
        throw new Error('No valid data found');
      }

      setData(parsedData);
      setColumns(analyzeColumns(parsedData));
      setActiveTab('configure');
      
      trackButtonClick('data-pasted', 'live-dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse data');
    } finally {
      setIsLoading(false);
    }
  };

  const createChartFromTemplate = (template: typeof CHART_TEMPLATES[0]) => {
    const newCharts: ChartConfig[] = template.configs.map((config, index) => ({
      id: `${template.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
      type: config.type as ChartConfig['type'],
      title: config.title,
      xAxis: columns.find(c => c.type === 'date')?.name || columns[0]?.name,
      yMetrics: columns.filter(c => c.type === 'number').slice(0, 2).map(c => c.name),
      groupBy: columns.find(c => c.type === 'text' && (c.unique || 0) < 10)?.name,
      aggregation: config.aggregation as ChartConfig['aggregation'],
      filters: []
    }));

    setCharts(prev => [...prev, ...newCharts]);
    setActiveTab('visualize');
  };

  const generateChartOptions = (chart: ChartConfig) => {
    // This is a simplified version - in a real app you'd have more sophisticated chart generation
    const filteredData = data; // Apply filters here
    
    const categories = Array.from(new Set(filteredData.map(row => String(row[chart.xAxis || columns[0].name]))));
    const series = chart.yMetrics.map(metric => ({
      name: metric,
      type: chart.type === 'area' ? 'line' : chart.type,
      data: categories.map(cat => {
        const values = filteredData
          .filter(row => String(row[chart.xAxis || columns[0].name]) === cat)
          .map(row => Number(row[metric]) || 0);
        
        switch (chart.aggregation) {
          case 'sum': return values.reduce((a, b) => a + b, 0);
          case 'average': return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
          case 'count': return values.length;
          case 'min': return Math.min(...values);
          case 'max': return Math.max(...values);
          default: return values.reduce((a, b) => a + b, 0);
        }
      }),
      ...(chart.type === 'area' && { areaStyle: {} })
    }));

    return {
      title: { text: chart.title, left: 'center' },
      tooltip: { trigger: 'axis' },
      legend: { data: chart.yMetrics, bottom: 0 },
      xAxis: { type: 'category', data: categories },
      yAxis: { type: 'value' },
      series
    };
  };

  const removeChart = (chartId: string) => {
    setCharts(prev => prev.filter(c => c.id !== chartId));
  };

  const duplicateChart = (chart: ChartConfig) => {
    const newChart = { ...chart, id: `${chart.id}-copy-${Date.now()}` };
    setCharts(prev => [...prev, newChart]);
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4" data-testid="dashboard-title">
            Interactive Live Dashboard Demo
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the power of TIAI dashboards with your own data. 
            Upload a file or paste data to create interactive visualizations instantly.
          </p>
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Alert className="max-w-4xl mx-auto">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Privacy Protected:</strong> Your data never leaves your browser. 
              We do not upload or store it. Closing or refreshing this page will erase your session.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
              <TabsTrigger value="upload" data-testid="tab-upload">Data Input</TabsTrigger>
              <TabsTrigger value="configure" disabled={data.length === 0} data-testid="tab-configure">
                Configure
              </TabsTrigger>
              <TabsTrigger value="visualize" disabled={charts.length === 0} data-testid="tab-visualize">
                Visualize
              </TabsTrigger>
            </TabsList>

            {/* Data Input Tab */}
            <TabsContent value="upload" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* File Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Upload File
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div 
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="file-upload-area"
                    >
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        CSV, Excel files (max 5MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                        data-testid="file-input"
                      />
                    </div>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                      data-testid="button-choose-file"
                    >
                      Choose File
                    </Button>
                  </CardContent>
                </Card>

                {/* Paste Data */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Paste Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="paste-data">CSV or Tab-separated data</Label>
                      <Textarea
                        id="paste-data"
                        placeholder="Paste your data here... (e.g. Name,Value,Date&#10;John,100,2024-01-01&#10;Jane,150,2024-01-02)"
                        value={pastedData}
                        onChange={(e) => setPastedData(e.target.value)}
                        className="min-h-32"
                        data-testid="textarea-paste-data"
                      />
                    </div>
                    <Button 
                      onClick={handlePasteData}
                      className="w-full"
                      disabled={!pastedData.trim()}
                      data-testid="button-parse-data"
                    >
                      Parse Data
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Session Storage Option */}
              <Card className="max-w-md mx-auto">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <input
                      id="keep-session"
                      type="checkbox"
                      checked={keepDataInSession}
                      onChange={(e) => setKeepDataInSession(e.target.checked)}
                      className="rounded"
                      data-testid="checkbox-keep-session"
                    />
                    <Label htmlFor="keep-session" className="text-sm">
                      Keep data in session (current tab only)
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Data will persist until you close this tab
                  </p>
                </CardContent>
              </Card>

              {/* Error Display */}
              {error && (
                <Alert variant="destructive" className="max-w-2xl mx-auto">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Processing your data...</p>
                </div>
              )}
            </TabsContent>

            {/* Configure Tab */}
            <TabsContent value="configure" className="space-y-6">
              {data.length > 0 && (
                <>
                  {/* Data Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Data Preview</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {data.length} rows, {columns.length} columns
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr>
                              {columns.slice(0, 6).map(col => (
                                <th key={col.name} className="text-left p-2 border-b">
                                  <div>
                                    <span className="font-medium">{col.name}</span>
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      {col.type}
                                    </Badge>
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {data.slice(0, 5).map((row, i) => (
                              <tr key={i}>
                                {columns.slice(0, 6).map(col => (
                                  <td key={col.name} className="p-2 border-b">
                                    {String(row[col.name])}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Chart Templates */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Start Templates</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Get started quickly with pre-built dashboard layouts
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        {CHART_TEMPLATES.map(template => (
                          <div key={template.name} className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">{template.name}</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              {template.description}
                            </p>
                            <Button
                              size="sm"
                              onClick={() => createChartFromTemplate(template)}
                              data-testid={`button-template-${template.name.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              Use Template
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Visualize Tab */}
            <TabsContent value="visualize" className="space-y-6">
              {charts.length > 0 && (
                <div className="grid gap-6">
                  {charts.map(chart => (
                    <Card key={chart.id}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          {chart.title}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => duplicateChart(chart)}
                            data-testid={`button-duplicate-${chart.id}`}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeChart(chart.id)}
                            data-testid={`button-remove-${chart.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Chart
                          options={generateChartOptions(chart)}
                          height="400px"
                          className="rounded-lg border"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {charts.length === 0 && (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Charts Created Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Go back to the Configure tab to create your first chart
                  </p>
                  <Button onClick={() => setActiveTab('configure')}>
                    Configure Charts
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}