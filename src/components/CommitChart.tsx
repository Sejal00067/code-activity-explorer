
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GitHubRepo, CommitActivity } from '../types/github';
import { fetchCommitActivity } from '../services/githubService';
import { useQuery } from '@tanstack/react-query';

interface CommitChartProps {
  username: string;
  repos: GitHubRepo[];
}

const CommitChart: React.FC<CommitChartProps> = ({ username, repos }) => {
  const [selectedRepo, setSelectedRepo] = useState<string>(
    repos.length > 0 ? repos[0].name : ''
  );

  const { data: commitData, isLoading, error } = useQuery({
    queryKey: ['commitActivity', username, selectedRepo],
    queryFn: () => fetchCommitActivity(username, selectedRepo),
    enabled: !!selectedRepo,
  });

  // Process commit data for the chart
  const formatCommitData = (commitActivity: CommitActivity[] | undefined) => {
    if (!commitActivity) return [];

    // Get data for the last 4 weeks
    const recentWeeks = commitActivity.slice(-4);
    
    // Transform the data for the chart
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return recentWeeks.flatMap((week, weekIndex) => {
      return week.days.map((commits, dayIndex) => ({
        name: `${dayNames[dayIndex]} (W${weekIndex + 1})`,
        commits,
      }));
    });
  };

  const chartData = formatCommitData(commitData);

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle>Commit Activity</CardTitle>
            <CardDescription>Daily commit count over recent weeks</CardDescription>
          </div>
          <Select value={selectedRepo} onValueChange={setSelectedRepo}>
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Select repository" />
            </SelectTrigger>
            <SelectContent>
              {repos.slice(0, 10).map(repo => (
                <SelectItem key={repo.id} value={repo.name}>
                  {repo.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading && (
          <div className="h-full flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        )}
        
        {error && (
          <div className="h-full flex items-center justify-center text-destructive">
            Unable to load commit data. GitHub may have limited API requests or this repository has no commit activity.
          </div>
        )}
        
        {!isLoading && !error && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                interval={3}
              />
              <YAxis allowDecimals={false} />
              <Tooltip 
                formatter={(value) => [`${value} commits`, 'Commits']}
                labelFormatter={(label) => `Day: ${label}`}
              />
              <Bar dataKey="commits" fill="hsl(var(--primary))" barSize={14} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
        
        {!isLoading && !error && chartData.length === 0 && (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No commit data available for this repository
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommitChart;
