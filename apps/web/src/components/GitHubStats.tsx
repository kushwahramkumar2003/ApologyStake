import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaGithub } from "react-icons/fa6";

interface GitHubStats {
  stars: number;
  forks: number;
}

export default function GitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const REPO_URL = "https://github.com/kushwahramkumar2003/ApologyStake";
  const API_URL =
    "https://api.github.com/repos/kushwahramkumar2003/ApologyStake";

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setStats({
          stars: data.stargazers_count,
          forks: data.forks_count,
        });
        setError(false);
      } catch (err) {
        console.error("Error fetching GitHub stats:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (error) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2 px-3 hover:bg-primary/10 transition-colors"
              asChild
            >
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                {loading ? (
                  <Skeleton className="h-4 w-16" />
                ) : (
                  <>
                    <FaGithub className="h-4 w-4" />
                    <span className="font-medium">
                      {formatNumber(stats?.stars ?? 0)}
                    </span>
                  </>
                )}
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Star us on GitHub</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
