import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, Phone, Code2 } from "lucide-react";
import Link from "next/link";
import { ShareLinkDialog } from "../ShareLinkDialog";

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
  createdAt: string | Date;
  languages: { name: string; questionSolved: number }[];
  level: number;
  userName: string;
  userId: string;
  sessionUserId: string;
}) => {
  const isOwner = sessionUserId === userId;
  const dateJoined = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const totalSolved = languages?.reduce((acc, curr) => acc + curr.questionSolved, 0) || 0;

  return (
    <Card className="relative overflow-hidden border-none bg-background/60 shadow-2xl backdrop-blur-md m-4">
      {/* Decorative Background Elements */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative p-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          
          {/* Avatar Section with Level Ring */}
          <div className="relative mx-auto shrink-0 md:mx-0">
            <div className="rounded-full p-1 ring-2 ring-primary/20 transition-all duration-500 hover:ring-primary/50">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={avatar?.url} alt={name} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-3xl font-bold text-white">
                  {name[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-4 border-background bg-primary px-4 py-1 text-xs font-bold shadow-lg">
              LVL {level || 1}
            </Badge>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:items-start md:text-left">
              <div className="space-y-1">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                  {name}
                </h1>
                <p className="text-lg font-medium text-muted-foreground/80">
                  @{userName}
                </p>
              </div>

              {isOwner && (
                <div className="flex gap-3 mt-4 md:mt-0 ">
                <ShareLinkDialog
                      title="Share Profile"
                      description="Anyone with this link can view this profile and their public activity."
                      itemName={name}
                      isPublic={true}
                    />
                <Link href="/profile">
                  <Button variant="outline"  className=" cursor-pointer border-primary/20 bg-background/50 hover:bg-primary transition-all">
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                </Link>
                    </div>
              )}
            </div>

            {/* Bio Section */}
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground/90">
              {bio || (isOwner 
                ? "You haven't added a bio yet. Tell the world about your coding journey!" 
                : "No bio added. This user prefers to keep their story a mystery.")}
            </p>

            {/* Metadata Grid */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-muted-foreground md:justify-start">
              {phone && (
                <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Joined {dateJoined}</span>
              </div>
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                <span>{totalSolved} Challenges Solved</span>
              </div>
            </div>

            {/* Skills/Languages Section */}
            <div className="flex flex-wrap justify-center gap-2 pt-2 md:justify-start">
              {languages?.map((lang) => (
                <Badge 
                  key={lang.name} 
                  variant="secondary" 
                  className="bg-primary/5 hover:bg-primary/10 text-primary border-primary/10 px-4 py-1.5 transition-colors"
                >
                  {lang.name}
                  {/* <span className="ml-2 opacity-60">• {lang.questionSolved}</span> */}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};