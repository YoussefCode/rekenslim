import React from "react";
import { CheckCircle, XCircle, Clock, Trophy, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DomainResultCardProps {
  resultData: Record<string, any>;
  submittedAt: string;
}

const DomainResultCard: React.FC<DomainResultCardProps> = ({ resultData, submittedAt }) => {
  const score = resultData.score ?? null;
  const total = resultData.total ?? null;
  const percentage = resultData.percentage ?? (score !== null && total ? Math.round((score / total) * 100) : null);
  const details = Array.isArray(resultData.details) ? resultData.details : [];

  const answeredCount = details.filter((d: any) => d !== null && d !== undefined).length;
  const correctCount = details.filter((d: any) => d && d.correct === true).length;
  const incorrectCount = details.filter((d: any) => d && d.correct === false).length;
  const skippedCount = total ? total - answeredCount : 0;

  const hasScoreData = score !== null && total !== null;

  const getScoreColor = (pct: number) => {
    if (pct >= 70) return "text-green-600";
    if (pct >= 50) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 70) return "bg-green-500";
    if (pct >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-card border rounded-lg p-3 space-y-3">
      {/* Header with date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {new Date(submittedAt).toLocaleString("nl-NL", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        {hasScoreData && percentage !== null && (
          <span className={`text-lg font-bold ${getScoreColor(percentage)}`}>
            {percentage}%
          </span>
        )}
      </div>

      {hasScoreData ? (
        <>
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getProgressColor(percentage ?? 0)}`}
                style={{ width: `${percentage ?? 0}%` }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-50 dark:bg-green-950/30 rounded-md p-2">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">{correctCount}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Goed</p>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 rounded-md p-2">
              <div className="flex items-center justify-center gap-1">
                <XCircle className="h-3.5 w-3.5 text-red-600" />
                <span className="text-sm font-semibold text-red-700 dark:text-red-400">{incorrectCount}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Fout</p>
            </div>
            <div className="bg-muted/50 rounded-md p-2">
              <div className="flex items-center justify-center gap-1">
                <Target className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">{score}/{total}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Score</p>
            </div>
          </div>

          {/* Skipped indicator */}
          {skippedCount > 0 && (
            <p className="text-[10px] text-muted-foreground text-center">
              {skippedCount} vraag/vragen overgeslagen
            </p>
          )}
        </>
      ) : (
        /* Fallback for unknown data format */
        <pre className="whitespace-pre-wrap break-words text-xs text-foreground bg-muted rounded-md p-2">
          {JSON.stringify(resultData, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default DomainResultCard;
