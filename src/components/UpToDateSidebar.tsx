'use client';

/**
 * UpToDate sidebar for participants assigned to the CONTROL arm.
 *
 * We do NOT embed UpToDate in an iframe — UpToDate (and the Stanford
 * Lane Library proxy in front of it) sets X-Frame-Options/CSP headers
 * that block iframe embedding, and the SSO redirect chain breaks in a
 * sandboxed iframe even when X-Frame-Options is missing. The sidebar
 * is a launcher panel: click "Open UpToDate" to open the proxy in a
 * new tab, sign in with your SUNet ID, and search there.
 */

const UPTODATE_PROXY_URL =
  'https://www-uptodate-com.laneproxy.stanford.edu';

export default function UpToDateSidebar() {
  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-border flex items-center justify-between">
        <div>
          <div className="font-semibold text-sm text-foreground">UpToDate</div>
          <div className="text-xs text-muted">Clinical reference resource</div>
        </div>
        <a
          href={UPTODATE_PROXY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline"
        >
          Open ↗
        </a>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl mb-3">📚</div>
        <p className="text-sm text-foreground font-medium mb-2">
          UpToDate opens in a new tab.
        </p>
        <p className="text-xs text-muted mb-5 leading-relaxed max-w-xs">
          Sign in with your Stanford SUNet ID via the Lane Library
          proxy. Use UpToDate freely throughout the case. Return to this
          tab to continue answering the task questions.
        </p>
        <a
          href={UPTODATE_PROXY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          Open UpToDate ↗
        </a>
        <p className="text-[11px] text-muted mt-5 max-w-xs">
          Note: external resources are <span className="font-semibold">not</span> allowed during the
          knowledge assessment that follows the case.
        </p>
      </div>
    </div>
  );
}
