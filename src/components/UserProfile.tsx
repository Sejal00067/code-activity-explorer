
import React from 'react';
import { GitHubUser } from '../types/github';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Link, Calendar, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserProfileProps {
  user: GitHubUser;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-20 w-20 border-2 border-primary">
          <AvatarImage src={user.avatar_url} alt={user.login} />
          <AvatarFallback>{user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl">
            {user.name || user.login}
            {user.name && <span className="block text-sm text-muted-foreground">@{user.login}</span>}
          </CardTitle>
          {user.bio && <CardDescription className="mt-2">{user.bio}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {user.location && (
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{user.location}</span>
              </div>
            )}
            {user.blog && (
              <div className="flex items-center text-sm">
                <Link className="h-4 w-4 mr-2 text-muted-foreground" />
                <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-primary hover:underline">
                  {user.blog}
                </a>
              </div>
            )}
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Joined on {formatDate(user.created_at)}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="secondary" className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {user.followers} followers
            </Badge>
            <Badge variant="secondary" className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {user.following} following
            </Badge>
            <Badge variant="outline" className="flex items-center">
              {user.public_repos} repositories
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
