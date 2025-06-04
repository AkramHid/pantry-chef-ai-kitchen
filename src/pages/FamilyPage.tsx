
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, UserPlus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const FamilyPage = () => {
  const navigate = useNavigate();

  // Mock family data - in real app this would come from a hook
  const familyMembers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'accepted' },
    { id: '2', name: 'Jane Doe', email: 'jane@example.com', role: 'member', status: 'accepted' },
    { id: '3', name: 'Bob Smith', email: 'bob@example.com', role: 'member', status: 'pending' },
  ];

  return (
    <div className="min-h-screen bg-kitchen-cream kitchen-texture flex flex-col">
      <Header title="Family Sharing" />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold font-heading text-kitchen-dark">Family Members</h1>
              <p className="text-muted-foreground">Share your kitchen data with family</p>
            </div>
            <Button className="bg-kitchen-green hover:bg-kitchen-green/90">
              <UserPlus size={18} className="mr-1" />
              Invite Member
            </Button>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Current Members ({familyMembers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {familyMembers.map((member, index) => (
                  <div key={member.id}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={member.status === 'accepted' ? 'default' : 'secondary'}
                        >
                          {member.status}
                        </Badge>
                        <Badge variant="outline">{member.role}</Badge>
                        <Button variant="ghost" size="icon">
                          <Settings size={16} />
                        </Button>
                      </div>
                    </div>
                    {index < familyMembers.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardHeader>
              <CardTitle>Shared Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-kitchen-cream rounded-lg">
                  <h3 className="font-medium mb-2">Pantry Items</h3>
                  <p className="text-sm text-muted-foreground">All family members can view and manage pantry items</p>
                </div>
                <div className="p-4 bg-kitchen-cream rounded-lg">
                  <h3 className="font-medium mb-2">Shopping Lists</h3>
                  <p className="text-sm text-muted-foreground">Collaborate on shopping lists together</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FamilyPage;
