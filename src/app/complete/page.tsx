'use client';

export default function CompletePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-card rounded-xl shadow-lg border border-border p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Exercise Complete
        </h1>
        <p className="text-sm text-muted mb-4 leading-relaxed">
          Thank you for completing the clinical case exercise and knowledge
          assessment. Your responses have been recorded.
        </p>
        <div className="bg-slate-50 rounded-lg p-4 text-sm text-foreground">
          <p>
            Your participation contributes to research on AI-assisted learning
            in clinical medicine. Results will not be shared with your
            residency program in an identifiable manner.
          </p>
        </div>
        <p className="text-xs text-muted mt-6">
          You may now close this window.
        </p>
      </div>
    </div>
  );
}
