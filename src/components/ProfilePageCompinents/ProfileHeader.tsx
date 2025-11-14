import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Edit, MessageCircle, Users } from "lucide-react";

export const ProfileHeader = () => {
  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted/30 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-glow">
            <AvatarImage src={"profileAvatar"} alt="Profile" />
            <AvatarFallback className="bg-gradient-primary text-2xl font-bold text-primary-foreground">
              AK
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">Alex Kim</h1>
                <Badge className="bg-gradient-success text-accent-foreground border-0">
                  Level 12
                </Badge>
              </div>
              <p className="text-muted-foreground mb-3 max-w-2xl">
                Full-stack developer passionate about algorithms and competitive programming. 
                Love solving complex problems and sharing knowledge with the community.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>San Francisco, USA</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Joined March 2023</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span>2.4K followers</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-md">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button size="sm" variant="outline" className="border-border hover:bg-muted">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="px-3 py-1">JavaScript</Badge>
            <Badge variant="secondary" className="px-3 py-1">Python</Badge>
            <Badge variant="secondary" className="px-3 py-1">React</Badge>
            <Badge variant="secondary" className="px-3 py-1">Algorithms</Badge>
            <Badge variant="secondary" className="px-3 py-1">System Design</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};
