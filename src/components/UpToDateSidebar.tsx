'use client';

/**
 * UpToDate sidebar for participants assigned to the CONTROL arm.
 *
 * We do NOT embed UpToDate in an iframe. UpToDate's own content pages now
 * allow framing (CSP `frame-ancestors *`), but participants must first
 * authenticate through the Stanford Lane proxy + WebLogin, and those login
 * pages forbid framing (`lane.stanford.edu` → X-Frame-Options: SAMEORIGIN;
 * `idp.stanford.edu` → X-Frame-Options: DENY / frame-ancestors 'none').
 * Inside an iframe the login step would simply refuse to load. Third-party
 * cookie blocking would also break the proxied session post-login.
 *
 * Instead we open UpToDate in a separate browser window auto-docked to the
 * right of the screen, so it sits beside the study window like a panel while
 * remaining a normal top-level context where SSO works. Repeat clicks reuse
 * (focus) the same window rather than spawning duplicates.
 */

const UPTODATE_PROXY_URL = 'https://www-uptodate-com.laneproxy.stanford.edu';
const UPTODATE_WINDOW_NAME = 'uptodate_panel';

function openUpToDatePanel() {
  if (typeof window === 'undefined') return;

  const scr = window.screen;
  const availW = scr.availWidth || window.innerWidth;
  const availH = scr.availHeight || window.innerHeight;
  // availLeft/availTop are non-standard but help on multi-monitor setups.
  const baseX = (scr as Screen & { availLeft?: number }).availLeft ?? 0;
  const baseY = (scr as Screen & { availTop?: number }).availTop ?? 0;

  const width = Math.max(480, Math.round(availW * 0.46));
  const height = availH;
  const left = baseX + availW - width; // dock to the right edge
  const top = baseY;

  const features = `popup=yes,width=${width},height=${height},left=${left},top=${top}`;
  const win = window.open(UPTODATE_PROXY_URL, UPTODATE_WINDOW_NAME, features);

  if (win) {
    // Some browsers ignore the position/size in `features`; nudge explicitly.
    try {
      win.moveTo(left, top);
      win.resizeTo(width, height);
    } catch {
      // cross-origin / blocked — ignore, the window still opened
    }
    win.focus();
  } else {
    // Popup blocked — fall back to a normal new tab.
    window.open(UPTODATE_PROXY_URL, '_blank', 'noopener,noreferrer');
  }
}

export default function UpToDateSidebar() {
  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-border flex items-center justify-between">
        <div>
          <div className="font-semibold text-sm text-foreground">UpToDate</div>
          <div className="text-xs text-muted">Clinical reference resource</div>
        </div>
        <button
          type="button"
          onClick={openUpToDatePanel}
          className="text-xs text-primary hover:underline"
        >
          Open ↗
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl mb-3">📚</div>
        <p className="text-sm text-foreground font-medium mb-2">
          UpToDate opens in a side window.
        </p>
        <p className="text-xs text-muted mb-5 leading-relaxed max-w-xs">
          Click below to open UpToDate in a window docked to the right of your
          screen, beside this one. Sign in with your Stanford SUNet ID via the
          Lane Library proxy, then use UpToDate freely throughout the case.
        </p>
        <button
          type="button"
          onClick={openUpToDatePanel}
          className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          Open UpToDate ↗
        </button>
        <p className="text-[11px] text-muted mt-5 max-w-xs leading-relaxed">
          Tip: keep this study window on the left and UpToDate on the right so
          you can read both at once. If your browser blocks the pop-up, allow
          pop-ups for this site and click again.
        </p>
        <p className="text-[11px] text-muted mt-3 max-w-xs">
          Note: external resources are{' '}
          <span className="font-semibold">not</span> allowed during the
          knowledge assessment that follows the case.
        </p>
      </div>
    </div>
  );
}
