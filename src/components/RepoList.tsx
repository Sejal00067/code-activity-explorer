
import React from 'react';
import { GitHubRepo } from '../types/github';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, GitFork, Code, Calendar } from 'lucide-react';

interface RepoListProps {
  repos: GitHubRepo[];
}

const RepoList: React.FC<RepoListProps> = ({ repos }) => {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Generate a color based on the programming language
  const getLanguageColor = (language: string | null) => {
    if (!language) return 'bg-gray-300';
    
    const colors: Record<string, string> = {
      'JavaScript': 'bg-yellow-500',
      'TypeScript': 'bg-blue-500',
      'Python': 'bg-green-500',
      'Java': 'bg-red-500',
      'C#': 'bg-purple-500',
      'C++': 'bg-pink-500',
      'HTML': 'bg-orange-500',
      'CSS': 'bg-teal-500',
      'Ruby': 'bg-red-600',
      'Go': 'bg-cyan-500',
      'PHP': 'bg-indigo-500',
      'Swift': 'bg-orange-600',
    };
    
    return colors[language] || 'bg-gray-500';
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold">Repositories ({repos.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map(repo => (
          <Card key={repo.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg hover:text-primary transition-colors">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 mr-1" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <GitFork className="h-4 w-4 mr-1" />
                    <span>{repo.forks_count}</span>
                  </div>
                </div>
              </div>
              {repo.description && (
                <CardDescription className="line-clamp-2">
                  {repo.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {repo.language && (
                  <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-1 ${getLanguageColor(repo.language)}`}></span>
                    <span>{repo.language}</span>
                  </div>
                )}
                <Badge variant="outline" className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Updated {formatDate(repo.updated_at)}
                </Badge>
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 w-full">
                    {repo.topics.slice(0, 3).map(topic => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {repo.topics.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{repo.topics.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RepoList;
