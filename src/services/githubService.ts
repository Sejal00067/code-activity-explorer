
import { GitHubRepo, GitHubUser, CommitActivity } from "../types/github";

const API_BASE_URL = "https://api.github.com";

export async function fetchUser(username: string): Promise<GitHubUser> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${username}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`User '${username}' not found`);
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${username}/repos?per_page=100&sort=updated`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching repos:", error);
    throw error;
  }
}

export async function fetchCommitActivity(username: string, repo: string): Promise<CommitActivity[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/repos/${username}/${repo}/stats/commit_activity`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching commit activity:", error);
    throw error;
  }
}
