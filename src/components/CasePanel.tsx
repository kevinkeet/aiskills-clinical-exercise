'use client';

import { useState } from 'react';
import { caseVignette } from '@/data/case';

export default function CasePanel() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`bg-card border-b border-border transition-all duration-300 ${
        isOpen ? 'max-h-[50vh] overflow-y-auto' : 'max-h-12'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors sticky top-0 z-10"
      >
        <span className="font-semibold text-sm text-foreground">
          Patient Case: Marcus Thompson, 32M &mdash; Suspected Fabry Disease
        </span>
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
