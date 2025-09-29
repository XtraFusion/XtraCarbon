"use client"
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Award,
  ShoppingCart,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { mockCarbonCredits } from '@/data/mockData';
import { CarbonCredit } from '@/types/carbon-credit';

export default function Marketplace() {
  const [credits] = useState<CarbonCredit[]>(mockCarbonCredits);
  const [selectedCredit, setSelectedCredit] = useState<CarbonCredit | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<'details' | 'confirmation' | 'success'>('details');

  const filteredCredits = credits.filter(credit => {
    const matchesSearch = credit.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || credit.region === selectedRegion;
    const matchesType = selectedType === 'all' || credit.projectType === selectedType;
    return matchesSearch && matchesRegion && matchesType;
  });

  const getProjectTypeLabel = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getCertificationLabel = (cert: string) => {
    return cert.toUpperCase().replace('-', ' ');
  };

  const handlePurchase = (credit: CarbonCredit) => {
    setSelectedCredit(credit);
    setPurchaseStep('details');
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = () => {
    if (purchaseStep === 'details') {
      setPurchaseStep('confirmation');
    } else if (purchaseStep === 'confirmation') {
      // TODO: Implement actual purchase logic
      console.log('Purchase confirmed:', {
        creditId: selectedCredit?.id,
        amount: purchaseAmount,
        totalCost: selectedCredit ? parseFloat(purchaseAmount) * selectedCredit.pricePerCredit : 0
      });
      setPurchaseStep('success');
    } else {
      setShowPurchaseModal(false);
      setPurchaseStep('details');
      setPurchaseAmount('');
      setSelectedCredit(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 bg-clip-text text-transparent">Carbon Credit Marketplace</h1>
        <p className="text-muted-foreground mt-2">
          Browse and purchase verified carbon credits from sustainable projects worldwide
        </p>
      </div>

      {/* Filters */}
      <Card className="border-none bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="North America">North America</SelectItem>
                <SelectItem value="South America">South America</SelectItem>
                <SelectItem value="Europe">Europe</SelectItem>
                <SelectItem value="Asia">Asia</SelectItem>
                <SelectItem value="Africa">Africa</SelectItem>
                <SelectItem value="Oceania">Oceania</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Project Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="forestry">Forestry</SelectItem>
                <SelectItem value="renewable-energy">Renewable Energy</SelectItem>
                <SelectItem value="waste-management">Waste Management</SelectItem>
                <SelectItem value="agriculture">Agriculture</SelectItem>
                <SelectItem value="industrial-processes">Industrial Processes</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2 bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:from-sky-600 hover:to-indigo-600 border-0">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-900/20 dark:to-indigo-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Average Price</p>
                <p className="text-lg font-bold">$21.75</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Award className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium">Available Credits</p>
                <p className="text-lg font-bold">{credits.reduce((sum, credit) => sum + credit.availableCredits, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/10 rounded-lg">
                <MapPin className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-sm font-medium">Active Projects</p>
                <p className="text-lg font-bold">{credits.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credit Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCredits.map((credit) => {
          const availabilityPercentage = (credit.availableCredits / credit.totalCredits) * 100;
          
          return (
            <Card key={credit.id} className="overflow-hidden hover:shadow-lg transition-shadow border-none">
              <div className="h-40 bg-gradient-card bg-cover bg-center relative">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">
                    {getCertificationLabel(credit.certification)}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-foreground">
                    {credit.vintage}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">
                      {credit.projectName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {credit.country}, {credit.region}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {getProjectTypeLabel(credit.projectType)}
                  </Badge>
                  <Badge variant={credit.status === 'active' ? 'default' : 'secondary'}>
                    {credit.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {credit.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Available Credits</span>
                    <span>{credit.availableCredits.toLocaleString()} / {credit.totalCredits.toLocaleString()}</span>
                  </div>
                  <Progress value={availabilityPercentage} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-2xl font-bold">
                      ${credit.pricePerCredit}
                    </p>
                    <p className="text-xs text-muted-foreground">per credit</p>
                  </div>
                  
                  <Button 
                    onClick={() => handlePurchase(credit)}
                    disabled={credit.availableCredits === 0}
                    className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Buy Credits
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Purchase Modal */}
      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {purchaseStep === 'details' && 'Purchase Carbon Credits'}
              {purchaseStep === 'confirmation' && 'Confirm Purchase'}
              {purchaseStep === 'success' && 'Purchase Successful'}
            </DialogTitle>
            <DialogDescription>
              {purchaseStep === 'details' && `Purchase credits from ${selectedCredit?.projectName}`}
              {purchaseStep === 'confirmation' && 'Review your purchase details'}
              {purchaseStep === 'success' && 'Your carbon credits have been purchased successfully'}
            </DialogDescription>
          </DialogHeader>
          
          {purchaseStep === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Number of Credits</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  max={selectedCredit?.availableCredits || 0}
                  min="1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Max available: {selectedCredit?.availableCredits.toLocaleString()}
                </p>
              </div>
              
              {purchaseAmount && selectedCredit && (
                <div className="bg-muted p-3 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Credits:</span>
                    <span>{purchaseAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Price per credit:</span>
                    <span>${selectedCredit.pricePerCredit}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total:</span>
                    <span>${(parseFloat(purchaseAmount) * selectedCredit.pricePerCredit).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {purchaseStep === 'confirmation' && selectedCredit && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Project:</span>
                  <span>{selectedCredit.projectName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Credits:</span>
                  <span>{purchaseAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Price per credit:</span>
                  <span>${selectedCredit.pricePerCredit}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total Amount:</span>
                  <span>${(parseFloat(purchaseAmount) * selectedCredit.pricePerCredit).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          
          {purchaseStep === 'success' && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <div>
                <p className="font-medium">Purchase completed successfully!</p>
                <p className="text-sm text-muted-foreground">
                  You have purchased {purchaseAmount} carbon credits
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {purchaseStep !== 'success' && (
              <Button variant="outline" onClick={() => setShowPurchaseModal(false)}>
                Cancel
              </Button>
            )}
            <Button 
              onClick={handleConfirmPurchase}
              disabled={purchaseStep === 'details' && (!purchaseAmount || parseFloat(purchaseAmount) <= 0)}
            >
              {purchaseStep === 'details' && 'Continue'}
              {purchaseStep === 'confirmation' && 'Confirm Purchase'}
              {purchaseStep === 'success' && 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}