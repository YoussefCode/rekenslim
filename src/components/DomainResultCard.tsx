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

  // If details don't carry per-question correctness (e.g. details are booleans or absent)
  // but we do have explicit `score` and `total`, derive counts from those values.
  let derivedCorrect = correctCount;
  let derivedIncorrect = incorrectCount;
  if (hasScoreData) {
    const totalNum = Number(total) || 0;
    const scoreNum = Number(score) || 0;

    const detailsContainCorrectFlag = details.some((d: any) => d && Object.prototype.hasOwnProperty.call(d, "correct"));

    if (!detailsContainCorrectFlag) {
      // Prefer to use `score` as number of correct answers when details lack flags.
      derivedCorrect = Math.max(0, Math.min(totalNum, Math.round(scoreNum)));
      // If skippedCount is available, exclude skipped from incorrect, otherwise compute as total - correct
      const skipped = totalNum - answeredCount > 0 ? totalNum - answeredCount : 0;
      derivedIncorrect = Math.max(0, totalNum - derivedCorrect - skipped);
    }
  }

  // Compute average time per question (in seconds) when available in details
  const timeValues = details
    .map((d: any) => (d && (typeof d.time === "number" || !isNaN(Number(d.time))) ? Number(d.time) : null))
    .filter((t: number | null) => t !== null) as number[];
  const avgTimeSeconds = timeValues.length > 0 ? Math.round(timeValues.reduce((s, v) => s + v, 0) / timeValues.length) : null;

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
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-green-50 dark:bg-green-950/30 rounded-md p-2">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">{derivedCorrect}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Goed</p>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 rounded-md p-2">
              <div className="flex items-center justify-center gap-1">
                <XCircle className="h-3.5 w-3.5 text-red-600" />
                <span className="text-sm font-semibold text-red-700 dark:text-red-400">{derivedIncorrect}</span>
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
            <div className="bg-muted/50 rounded-md p-2">
              <div className="flex items-center justify-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">{avgTimeSeconds !== null ? `${avgTimeSeconds}s` : "Niet bekend"}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Gem. tijd</p>
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
