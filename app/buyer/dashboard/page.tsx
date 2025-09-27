"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Leaf, 
  ShoppingCart, 
  Award,
  DollarSign,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { mockUser, mockPortfolio, mockNewsUpdates } from '@/data/mockData';
import Link from 'next/link';

export default function BuyerDashboard() {
  const portfolioValue = mockPortfolio.totalValue;
  const carbonFootprintReduction = mockPortfolio.totalRetired * 1.2; // Approximate tons CO2

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary text-primary-foreground rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {mockUser.firstName}!
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              {mockUser.organizationName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-primary-foreground/80">Member since</p>
            <p className="font-semibold">
              {new Date(mockUser.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/buyer/marketplace">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Buy Credits</h3>
              <p className="text-sm text-muted-foreground">Browse marketplace</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/buyer/portfolio">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Leaf className="h-10 w-10 text-success mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Retire Credits</h3>
              <p className="text-sm text-muted-foreground">Offset emissions</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/buyer/transactions">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Award className="h-10 w-10 text-info mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Certificates</h3>
              <p className="text-sm text-muted-foreground">Download certificates</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${portfolioValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Owned</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPortfolio.totalOwned.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockPortfolio.totalRetired} retired
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Offset</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {carbonFootprintReduction.toFixed(1)} tons
            </div>
            <p className="text-xs text-muted-foreground">
              Carbon footprint reduced
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Credit Distribution
              <Link href="/buyer/portfolio">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockPortfolio.credits.slice(0, 3).map((credit) => (
              <div key={credit.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{credit.projectName}</span>
                  <Badge variant={credit.status === 'retired' ? 'secondary' : 'default'}>
                    {credit.amount} credits
                  </Badge>
                </div>
                <Progress 
                  value={(credit.amount / mockPortfolio.totalOwned) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest News & Updates</CardTitle>
            <CardDescription>Stay informed about carbon markets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockNewsUpdates.slice(0, 3).map((news) => (
              <div key={news.id} className="border-l-2 border-primary pl-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold line-clamp-1">
                      {news.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {news.summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground ml-4">
                    <Calendar className="h-3 w-3" />
                    {new Date(news.publishDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All News
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}