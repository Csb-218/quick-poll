"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";

interface PollOption {
  id: string;
  pollId: string;
  optionText: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  createdAt: string;
  options: PollOption[];
}

interface PollCardProps {
  poll: Poll;
  onVote: () => void;
}

export default function PollCard({ poll, onVote }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  const handleVote = async () => {
    if (!selectedOption || isVoting) return;

    setIsVoting(true);
    try {
      const { error } = await supabase
        .from("poll_options")
        .update({ votes: poll.options.find(o => o.id === selectedOption)!.votes + 1 })
        .eq("id", selectedOption);

      if (error) throw error;
      onVote();
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setIsVoting(false);
      setSelectedOption(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">{poll.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {poll.options.map((option) => (
          <div key={option.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Button
                variant={selectedOption === option.id ? "default" : "outline"}
                className="w-full text-left justify-start"
                onClick={() => setSelectedOption(option.id)}
              >
                {option.optionText}
              </Button>
            </div>
            <div className="space-y-1">
              <Progress
                value={totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0}
                className="h-2"
              />
              <p className="text-sm text-gray-500 text-right">
                {option.votes} votes ({totalVotes > 0
                  ? Math.round((option.votes / totalVotes) * 100)
                  : 0}
                %)
              </p>
            </div>
          </div>
        ))}
        <Button
          className="w-full mt-4"
          onClick={handleVote}
          disabled={!selectedOption || isVoting}
        >
          Vote
        </Button>
        <p className="text-sm text-gray-500 text-center">
          Total votes: {totalVotes}
        </p>
      </CardContent>
    </Card>
  );
}