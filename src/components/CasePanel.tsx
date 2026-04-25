'use client';

import { useEffect, useState } from 'react';
import { caseVignette, getCaseAsText } from '@/data/case';

export default function CasePanel({
  defaultOpen = true,
  additionalFindings,
}: {
  defaultOpen?: boolean;
  /** When provided, rendered as a highlighted "New Findings" section at the
   *  bottom of the panel (used at Task 4). Pass undefined to hide. */
  additionalFindings?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  // When additional findings appear (Task 4), force the panel open so the
  // participant sees the new info even if they had collapsed it.
  useEffect(() => {
    if (additionalFindings) setIsOpen(true);
  }, [additionalFindings]);

  function copyCase(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(getCaseAsText(!!additionalFindings));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={`bg-card border-b border-border transition-all duration-300 ${
        isOpen ? 'max-h-[55vh] overflow-y-auto' : 'max-h-12'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors sticky top-0 z-10"
      >
        <span className="font-semibold text-sm text-foreground flex items-center gap-2">
          Patient Case: Marcus Thompson, 32M &mdash; Suspected Fabry Disease
          {additionalFindings && (
            <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
              Updated
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          {isOpen && (
            <span
              onClick={copyCase}
              className="text-xs text-muted hover:text-foreground cursor-pointer px-1.5 py-0.5 rounded hover:bg-slate-200 transition-colors"
              title="Copy case to clipboard"
            >
              {copied ? 'Copied' : 'Copy'}
            </span>
          )}
          <svg
            className={`w-4 h-4 text-muted transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 py-3 text-sm space-y-3">
          <div>
            <div className="font-semibold text-primary mb-1">
              Chief Complaint
            </div>
            <p className="italic text-foreground">{caseVignette.chiefComplaint}</p>
          </div>

          <div>
            <div className="font-semibold text-primary mb-1">
              History of Present Illness
            </div>
            <p className="text-foreground whitespace-pre-line leading-relaxed">
              {caseVignette.hpi}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InfoBlock label="Past Medical History" value={caseVignette.pmh} />
            <InfoBlock label="Medications" value={caseVignette.medications} />
            <InfoBlock label="Allergies" value={caseVignette.allergies} />
            <InfoBlock
              label="Social History"
              value={caseVignette.socialHistory}
            />
            <InfoBlock
              label="Family History"
              value={caseVignette.familyHistory}
            />
            <InfoBlock label="Review of Systems" value={caseVignette.ros} />
          </div>

          <InfoBlock label="Vital Signs" value={caseVignette.vitals} />

          <div>
            <div className="font-semibold text-primary mb-1">
              Available Labs
            </div>
            <div className="bg-slate-50 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="text-left px-3 py-1.5 font-semibold">
                      Test
                    </th>
                    <th className="text-left px-3 py-1.5 font-semibold">
                      Result
                    </th>
                    <th className="text-left px-3 py-1.5 font-semibold">
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {caseVignette.labs.map((lab, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                    >
                      <td className="px-3 py-1">{lab.test}</td>
                      <td className="px-3 py-1 font-medium">{lab.result}</td>
                      <td className="px-3 py-1 text-muted">{lab.reference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {additionalFindings && (
            <div className="border-l-4 border-amber-400 bg-amber-50/60 rounded-r-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-amber-900">
                  New Findings
                </span>
                <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                  Just in
                </span>
              </div>
              <div className="text-sm text-amber-950 findings-box whitespace-pre-line leading-relaxed">
                {additionalFindings.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    {para.split('**').map((segment, j) =>
                      j % 2 === 1 ? (
                        <strong key={j}>{segment}</strong>
                      ) : (
                        <span key={j}>{segment}</span>
                      )
                    )}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-semibold text-primary text-xs mb-0.5">{label}</div>
      <p className="text-foreground text-xs leading-relaxed">{value}</p>
    </div>
  );
}
