'use client';

import { useState } from 'react';

export default function UpToDateSidebar() {
  const [iframeError, setIframeError] = useState(false);

  if (iframeError) {
    return (
      <div className="flex flex-col h-full bg-card border-l border-border">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-border">
          <div className="font-semibold text-sm text-foreground">UpToDate</div>
          <div className="text-xs text-muted">Clinical reference resource</div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-sm text-foreground font-medium mb-2">
            UpToDate cannot be embedded directly.
          </p>
          <p className="text-xs text-muted mb-4">
            Click below to open UpToDate in a new tab. Use your institutional
            login to access articles.
          </p>
          <a
            href="https://www.uptodate.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Open UpToDate ↗
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-border flex items-center justify-between">
        <div>
          <div className="font-semibold text-sm text-foreground">UpToDate</div>
          <div className="text-xs text-muted">
            Clinical reference resource
          </div>
        </div>
        <a
          href="https://www.uptodate.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline"
        >
          Open in new tab ↗
        </a>
      </div>
      <div className="flex-1 relative">
        <iframe
          src="https://www.uptodate.com"
          className="absolute inset-0 w-full h-full"
          title="UpToDate"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          onError={() => setIframeError(true)}
          onLoad={(e) => {
            // Check if iframe loaded properly or was blocked
            try {
              const iframe = e.target as HTMLIFrameElement;
              // If we can't access contentDocument, it loaded (even if cross-origin)
              // The error handler below will catch X-Frame-Options blocks
              if (iframe.contentDocument?.title === '') {
                setIframeError(true);
              }
            } catch {
              // Cross-origin - iframe loaded something, which is fine
            }
          }}
        />
      </div>
    </div>
  );
}
