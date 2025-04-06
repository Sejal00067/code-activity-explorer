
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { fetchUser, fetchUserRepos } from '../services/githubService';
import SearchBar from '../components/SearchBar';
import UserProfile from '../components/UserProfile';
import RepoList from '../components/RepoList';
import CommitChart from '../components/CommitChart';
import { ProfileSkeleton, ReposSkeleton, ChartSkeleton } from '../components/LoadingSkeleton';

const Index = () => {
  const [username, setUsername] = useState('');
  const { toast } = useToast();

  // Fetch user data
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser
  } = useQuery({
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    enabled: !!username,
    retry: false,
  });

  // Fetch repositories
  const {
    data: reposData,
    isLoading: isReposLoading,
    error: reposError
  } = useQuery({
    queryKey: ['repos', username],
    queryFn: () => fetchUserRepos(username),
    enabled: !!userData,
    retry: false,
  });

  const handleSearch = async (searchUsername: string) => {
    setUsername(searchUsername);
    refetchUser();
  };

  // Show error toast if needed
  React.useEffect(() => {
    if (userError) {
      toast({
        title: "Error",
        description: (userError as Error).message,
        variant: "destructive",
      });
    }
  }, [userError, toast]);

  const isLoading = isUserLoading || isReposLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8 px-4 md:px-8 mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">GitHub Profile Analyzer</h1>
          <p className="text-muted-foreground mb-6">Explore GitHub profiles and repository statistics</p>
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </header>

        {/* Initial state */}
        {!username && !isLoading && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">Enter a GitHub username to begin</h2>
            <p className="text-muted-foreground">
              View repositories, commit activity, and more!
            </p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-8">
            <ProfileSkeleton />
            <ReposSkeleton />
            <ChartSkeleton />
          </div>
        )}

        {/* Results */}
        {userData && reposData && (
          <div className="space-y-8">
            <UserProfile user={userData} />
            
            {reposData.length > 0 && (
              <>
                <RepoList repos={reposData} />
                <CommitChart username={username} repos={reposData} />
              </>
            )}
            
            {reposData.length === 0 && (
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold">No public repositories found</h2>
                <p className="text-muted-foreground">This user doesn't have any public repositories yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
