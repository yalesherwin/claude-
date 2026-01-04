import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!);
const readOnlyClient = client.readOnly;

export async function checkUserFollows(userId: string, targetUserId: string): Promise<boolean> {
  try {
    const response = await readOnlyClient.v2.following(userId, {
      max_results: 1000,
    });

    for await (const user of response) {
      if (user.id === targetUserId) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
}

export async function checkUserRetweeted(userId: string, tweetId: string): Promise<boolean> {
  try {
    const retweets = await readOnlyClient.v2.tweetRetweetedBy(tweetId, {
      max_results: 100,
    });

    for await (const user of retweets) {
      if (user.id === userId) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking retweet status:', error);
    return false;
  }
}

export async function checkUserCommented(userId: string, tweetId: string): Promise<boolean> {
  try {
    // Get user's recent tweets
    const userTweets = await readOnlyClient.v2.userTimeline(userId, {
      max_results: 100,
      'tweet.fields': ['referenced_tweets'],
    });

    for await (const tweet of userTweets) {
      if (tweet.referenced_tweets) {
        for (const ref of tweet.referenced_tweets) {
          if (ref.type === 'replied_to' && ref.id === tweetId) {
            return true;
          }
        }
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking comment status:', error);
    return false;
  }
}

export async function verifyUserActions(
  userId: string,
  targetUserId: string,
  tweetId: string
): Promise<{ hasFollowed: boolean; hasRetweeted: boolean; hasCommented: boolean }> {
  const [hasFollowed, hasRetweeted, hasCommented] = await Promise.all([
    checkUserFollows(userId, targetUserId),
    checkUserRetweeted(userId, tweetId),
    checkUserCommented(userId, tweetId),
  ]);

  return {
    hasFollowed,
    hasRetweeted,
    hasCommented,
  };
}
