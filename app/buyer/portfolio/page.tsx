"use client"
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  Leaf, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  Award,
  BarChart3
} from 'lucide-react';
import { mockPortfolio } from '@/data/mockData';
import { PortfolioCredit } from '@/types/carbon-credit';

export default function Portfolio() {
  const [selectedCredit, setSelectedCredit] = useState<PortfolioCredit | null>(null);
  const [showRetireModal, setShowRetireModal] = useState(false);
  const [retireAmount, setRetireAmount] = useState('');

  const ownedCredits = mockPortfolio.credits.filter(credit => credit.status === 'owned');
  const retiredCredits = mockPortfolio.credits.filter(credit => credit.status === 'retired');

  const totalCurrentValue = ownedCredits.reduce((sum, credit) => 
    sum + (credit.amount * credit.currentPrice), 0
  );
  
  const totalGainLoss = ownedCredits.reduce((sum, credit) => 
    sum + (credit.amount * (credit.currentPrice - credit.purchasePrice)), 0
  );

  const handleRetireCredits = (credit: PortfolioCredit) => {
    setSelectedCredit(credit);
    setShowRetireModal(true);
  };

  const confirmRetirement = () => {
    if (selectedCredit && retireAmount) {
      // TODO: Implement retirement logic
      console.log('Retiring credits:', {
        creditId: selectedCredit.id,
        amount: retireAmount
      });
      setShowRetireModal(false);
      setRetireAmount('');
      setSelectedCredit(null);
    }
  };

  const downloadCertificate = (credit: PortfolioCredit) => {
    // TODO: Implement certificate download
    console.log('Downloading certificate for:', credit.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Portfolio</h1>
        <p className="text-muted-foreground mt-2">
          Manage your carbon credits and track your environmental impact
        </p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Owned</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPortfolio.totalOwned.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              credits in portfolio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalCurrentValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              portfolio value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gain/Loss</CardTitle>
            {totalGainLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              totalGainLoss >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              ${Math.abs(totalGainLoss).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalGainLoss >= 0 ? 'gain' : 'loss'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retired</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPortfolio.totalRetired.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              credits retired
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Details */}
      <Tabs defaultValue="owned" className="space-y-4">
        <TabsList>
          <TabsTrigger value="owned">Owned Credits ({ownedCredits.length})</TabsTrigger>
          <TabsTrigger value="retired">Retired Credits ({retiredCredits.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="owned" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Holdings</CardTitle>
              <CardDescription>
                Credits you currently own and can retire or transfer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Purchase Price</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Gain/Loss</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ownedCredits.map((credit) => {
                    const currentValue = credit.amount * credit.currentPrice;
                    const purchaseValue = credit.amount * credit.purchasePrice;
                    const gainLoss = currentValue - purchaseValue;
                    
                    return (
                      <TableRow key={credit.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{credit.projectName}</p>
                            <p className="text-sm text-muted-foreground">
                              Purchased {new Date(credit.purchaseDate).toLocaleDateString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{credit.amount.toLocaleString()}</TableCell>
                        <TableCell>${credit.purchasePrice}</TableCell>
                        <TableCell>${credit.currentPrice}</TableCell>
                        <TableCell>${currentValue.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={gainLoss >= 0 ? 'text-success' : 'text-destructive'}>
                            {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleRetireCredits(credit)}
                            className="gap-1"
                          >
                            <Leaf className="h-3 w-3" />
                            Retire
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retired" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Retired Credits</CardTitle>
              <CardDescription>
                Credits you have retired to offset your carbon footprint
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Retirement Date</TableHead>
                    <TableHead>CO₂ Offset</TableHead>
                    <TableHead>Certificate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {retiredCredits.map((credit) => (
                    <TableRow key={credit.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{credit.projectName}</p>
                          <Badge variant="secondary" className="mt-1">Retired</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{credit.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        {credit.retirementDate && 
                          new Date(credit.retirementDate).toLocaleDateString()
                        }
                      </TableCell>
                      <TableCell>{(credit.amount * 1.2).toFixed(1)} tons</TableCell>
                      <TableCell>
                        {credit.certificateUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadCertificate(credit)}
                            className="gap-1"
                          >
                            <Download className="h-3 w-3" />
                            Download
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Portfolio Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ownedCredits.map((credit) => {
                    const percentage = (credit.amount / mockPortfolio.totalOwned) * 100;
                    return (
                      <div key={credit.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{credit.projectName}</span>
                          <span>{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Environmental Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-success rounded-lg text-success-foreground">
                  <p className="text-3xl font-bold">
                    {(mockPortfolio.totalRetired * 1.2).toFixed(1)}
                  </p>
                  <p className="text-sm opacity-80">Tons CO₂ Offset</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Equivalent to:</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>🌳 {Math.round(mockPortfolio.totalRetired * 0.04)} trees planted</p>
                    <p>🚗 {Math.round(mockPortfolio.totalRetired * 0.25)} miles not driven</p>
                    <p>⚡ {Math.round(mockPortfolio.totalRetired * 0.12)} kWh green energy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Retirement Modal */}
      <Dialog open={showRetireModal} onOpenChange={setShowRetireModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Retire Carbon Credits</DialogTitle>
            <DialogDescription>
              Retire credits from {selectedCredit?.projectName} to offset your carbon footprint
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Number of Credits to Retire</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={retireAmount}
                onChange={(e) => setRetireAmount(e.target.value)}
                max={selectedCredit?.amount || 0}
                min="1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Available: {selectedCredit?.amount.toLocaleString()} credits
              </p>
            </div>
            
            {retireAmount && selectedCredit && (
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Credits to retire:</span>
                  <span>{retireAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>CO₂ offset:</span>
                  <span>{(parseFloat(retireAmount) * 1.2).toFixed(1)} tons</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Certificate will be generated</span>
                  <span>✓</span>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRetireModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmRetirement}
              disabled={!retireAmount || parseFloat(retireAmount) <= 0}
              className="gap-2"
            >
              <Leaf className="h-4 w-4" />
              Retire Credits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}