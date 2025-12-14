import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {  Calendar, Edit, Phone } from "lucide-react";
import Link from "next/link";

export const ProfileHeader = ({
  avatar,
  name,
  bio,
  phone,
  createdAt,
  languages,
  userName,
  level,
  userId,
  sessionUserId
}: {
  avatar: { id: string; url: string };
  name: string;
  phone: string;
  bio: string;
  createdAt: string | Date ;
  languages: {
    name: string;
    questionSolved: number;
  }[];
  level: number;
  userName: string;
  userId: string;
  sessionUserId: string;
}) => {

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted/30 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-glow">
            <AvatarImage src={avatar?.url || "profileAvatar"} alt="Profile" />
            <AvatarFallback className="bg-gradient-primary text-3xl font-bold text-blue-500 ">
              {name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{name}</h1>
                <Badge className="bg-green-700 text-accent-foreground border-0">
                  Level {level || 1}
                </Badge>
              </div>
              <p className="text-shadow-muted-foreground mb-3 max-w-2xl">{userName}</p>
              <p className="text-muted-foreground mb-3 max-w-2xl">
                {bio ||
                  `No bio provided yet. ${
                    sessionUserId === userId &&
                    "Edit your profile and add a bio! to tell others about yourself!"
                  }`}
              </p>
             {phone && <div className="flex flex-wrap gap-4 mb-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  <span>{phone }</span>
                </div>
              </div>}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{createdAt.toString().split("T")[0] || ""}</span>
                </div>
              </div>
            </div>

            {sessionUserId === userId && (
              <div className="flex gap-2">
                <Link href={"/profile"} >
                <Button
                  size="sm"
                  variant="outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
           {languages && languages.map((lang) => (<Badge key={lang.name} variant="secondary" className="px-3 py-1">
              {lang.name}
            </Badge>))}
          
          </div>
        </div>
      </div>
    </Card>
  );
};
