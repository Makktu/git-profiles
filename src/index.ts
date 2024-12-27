import fetch from 'node-fetch';

// * 1. Basic Types

const githubApiBaseUrl: string = 'https://api.github.com';
let rateLimitRemaining: number | null = null;
let rateLimitReset: Date | null = null;
let isFetching: boolean = false;

// 2. Function to fetch user data
async function fetchGitHubUserData(username: string): Promise<any> {
  isFetching = true;
  const url: string = `${githubApiBaseUrl}/users/${username}`;

  try {
    const response = await fetch(url); // * the Node fetch call

    // Update rate limit information
    rateLimitRemaining = Number(response.headers.get('x-ratelimit-remaining'));
    rateLimitReset = response.headers.get('x-ratelimit-reset')
      ? new Date(Number(response.headers.get('x-ratelimit-reset')) * 1000)
      : null;

    if (!response.ok) {
      throw new Error(
        `Github API request failed with status ${response.statusText}`
      );
    }

    const data: any = await response.json(); // will add interfaces later for better typing
    return data;
  } catch (error) {
    console.error('Error fetching GitHub user data:', error);
    return null; // ! handle error better than this
  } finally {
    isFetching = false;
  }
}

// 3. Example usage
async function main() {
  const username: string = 'Makktu'; // ! replace with Github username
  const user: any = await fetchGitHubUserData(username);

  if (user) {
    console.log(`User Data: ${username}: ${user.name}`);
    console.log('Rate Limit Remaining:', rateLimitRemaining);
    console.log('Rate Limit Reset:', rateLimitReset);
  }
}

main();
