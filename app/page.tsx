"use client";

import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import CreatePollDialog from "@/components/create-poll-dialog";
import PollCard from "@/components/poll-card";

interface Poll {
  id: string;
  question: string;
  createdAt: string;
  options: PollOption[];
}

interface PollOption {
  id: string;
  pollId: string;
  optionText: string;
  votes: number;
}

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPolls = async () => {
    try {
      const { data: pollsData, error: pollsError } = await supabase
        .from("polls")
        .select("*")
        .order("createdAt", { ascending: false });

      if (pollsError) {
        throw pollsError;
      }

      const pollsWithOptions = await Promise.all(
        (pollsData || []).map(async (poll) => {
          const { data: optionsData, error: optionsError } = await supabase
            .from("poll_options")
            .select("*")
            .eq("pollId", poll.id);

          if (optionsError) {
            throw optionsError;
          }

          return {
            ...poll,
            options: optionsData || [],
          };
        })
      );

      setPolls(pollsWithOptions);
      setError(null);
    } catch (err) {
      console.error("Error fetching polls:", err);
      setError("Failed to load polls. Please try again later.");
    }
  };

  useEffect(() => {
    fetchPolls();
    const interval = setInterval(fetchPolls, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePollCreated = () => {
    setIsCreateDialogOpen(false);
    fetchPolls();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Quick Polls</h1>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Poll
          </Button>
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              onVote={fetchPolls}
            />
          ))}
        </div>

        {!error && polls.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-lg text-gray-600">
              No polls yet. Create one to get started!
            </p>
          </Card>
        )}

        <CreatePollDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onPollCreated={handlePollCreated}
        />
      </div>
    </div>
  );
}