'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PAGE_TITLE,
  IRB_LINE,
  ESTIMATED_TIME,
  CONSENT_SECTIONS,
  CONTACT_BLOCK,
  PRINT_REMINDER,
  CONSENT_CHECKBOX_LABEL,
  DEMOGRAPHIC_FIELDS,
  COMFORT_QUESTION_TEXT,
  COMFORT_SCALE_MIN,
  COMFORT_SCALE_MAX,
  COMFORT_SCALE_MIN_LABEL,
  COMFORT_SCALE_MAX_LABEL,
  type DemographicField,
} from '@/data/intakeContent';

type Step = 'consent' | 'enrollment' | 'demographics' | 'fabryPretest';
const STEP_ORDER: Step[] = ['consent', 'enrollment', 'demographics', 'fabryPretest'];
const STEP_LABELS: Record<Step, string> = {
  consent: 'Consent',
  enrollment: 'Enrollment number',
  demographics: 'Background',
  fabryPretest: 'Clinical comfort',
};

interface LookupResult {
  participantId: string;
  pgy: number;
  resumeStep: Step | 'case' | 'assessment' | 'done';
}

export default function IntakePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('consent');

  // Step 1
  const [consented, setConsented] = useState(false);
  const [consentTimestamp, setConsentTimestamp] = useState<string | null>(null);

  // Step 2
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [enrollmentError, setEnrollmentError] = useState('');
  const [lookup, setLookup] = useState<LookupResult | null>(null);
  const [lookingUp, setLookingUp] = useState(false);

  // Step 3
  const currentYear = new Date().getFullYear();
  const demographicFields = useMemo(() => DEMOGRAPHIC_FIELDS(currentYear), [currentYear]);
  const [demographics, setDemographics] = useState<Record<string, string>>({});
  const [demoErrors, setDemoErrors] = useState<Record<string, string>>({});
  const [pgyMismatchAck, setPgyMismatchAck] = useState(false);

  // Step 4 (single 0–10 comfort question)
  const [comfortRating, setComfortRating] = useState<number | null>(null);
  const [pretestErrors, setPretestErrors] = useState<string>('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch existing session on mount; if already partially through, resume.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/session/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.authenticated) return;
        if (data.intakeComplete) {
          router.push('/exercise');
          return;
        }
        if (data.currentStep && STEP_ORDER.includes(data.currentStep)) {
          setStep(data.currentStep);
        } else if (data.currentStep === 'demographics') {
          setStep('demographics');
        }
        // Pre-populate enrollment number from session for display
        if (data.participantId) {
          setEnrollmentNumber(data.participantId);
          setLookup({
            participantId: data.participantId,
            pgy: 0,
            resumeStep: data.currentStep ?? 'demographics',
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [router]);

  function goNext(target: Step) {
    setStep(target);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function goBack() {
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) goNext(STEP_ORDER[idx - 1]);
  }

  // ---------------- Step 1: Consent ----------------
  function handleConsentContinue() {
    if (!consented) return;
    setConsentTimestamp(new Date().toISOString());
    goNext('enrollment');
  }

  // ---------------- Step 2: Enrollment ----------------
  async function handleEnrollmentSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = enrollmentNumber.trim().toUpperCase();
    if (!/^P-\d{1,4}$/.test(normalized)) {
      setEnrollmentError('Enter your enrollment number in the format P-NNN.');
      return;
    }
    setEnrollmentError('');
    setLookingUp(true);
    let lastErr = '';
    let serverResponded = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch('/api/intake/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            enrollmentNumber: normalized,
            consentTimestamp,
          }),
        });
        serverResponded = true;
        if (res.status === 404) {
          setEnrollmentError(
            'We could not find that enrollment number. Please check with the study coordinator.'
          );
          setLookingUp(false);
          return;
        }
        if (res.status === 409) {
          setEnrollmentError(
            'This enrollment number has already been used to complete the study.'
          );
          setLookingUp(false);
          return;
        }
        if (res.status >= 500) {
          // Server reachable but it returned an error — surface it directly,
          // do not retry (config errors won't fix themselves).
          const body = await res.json().catch(() => ({}));
          setEnrollmentError(
            body.error
              ? `Server error: ${body.error}`
              : `Server error (HTTP ${res.status}). Please contact the study coordinator.`
          );
          setLookingUp(false);
          return;
        }
        if (!res.ok) {
          lastErr = (await res.json().catch(() => ({}))).error ?? `HTTP ${res.status}`;
        } else {
          const data = (await res.json()) as LookupResult & { arm?: string };
          setLookup({
            participantId: data.participantId,
            pgy: data.pgy,
            resumeStep: data.resumeStep ?? 'demographics',
          });
          setLookingUp(false);
          // If resumeStep is downstream of demographics, jump there.
          const next = data.resumeStep;
          if (next === 'fabryPretest') goNext('fabryPretest');
          else if (next === 'case') {
            router.push('/exercise');
            return;
          } else goNext('demographics');
          return;
        }
      } catch (err) {
        lastErr = err instanceof Error ? err.message : 'Network error';
      }
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
    if (serverResponded) {
      setEnrollmentError(`Server error: ${lastErr}. Please try again.`);
    } else {
      setEnrollmentError(
        `Could not reach the server. ${lastErr || ''} Please check your connection and try again.`.trim()
      );
    }
    setLookingUp(false);
  }

  // ---------------- Step 3: Demographics ----------------
  function setDemoField(key: string, value: string) {
    setDemographics((prev) => ({ ...prev, [key]: value }));
    if (demoErrors[key]) {
      setDemoErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function validateDemographics(): boolean {
    const errs: Record<string, string> = {};
    for (const f of demographicFields) {
      const v = demographics[f.key];
      if (!v || v.trim() === '') {
        errs[f.key] = 'This field is required.';
        continue;
      }
      if (f.type === 'numberYear') {
        const n = parseInt(v, 10);
        if (isNaN(n) || n < f.min || n > f.max) {
          errs[f.key] = `Enter a year between ${f.min} and ${f.max}.`;
        }
      }
    }
    setDemoErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleDemographicsContinue() {
    if (!validateDemographics()) return;
    // PGY mismatch warning (soft).
    if (lookup && lookup.pgy && demographics.pgy) {
      const enteredPgy = parseInt(demographics.pgy.replace(/[^0-9]/g, ''), 10);
      if (enteredPgy !== lookup.pgy && !pgyMismatchAck) {
        setDemoErrors({
          pgy: 'The PGY year on file does not match your selection. Please confirm by clicking Continue again.',
        });
        setPgyMismatchAck(true);
        return;
      }
    }
    goNext('fabryPretest');
  }

  // ---------------- Step 4: Clinical comfort ----------------
  function setComfort(value: number) {
    setComfortRating(value);
    setPretestErrors('');
  }

  function validatePretest(): boolean {
    if (comfortRating === null) {
      setPretestErrors('Please choose a value on the scale.');
      return false;
    }
    setPretestErrors('');
    return true;
  }

  async function handleFinalSubmit() {
    if (!validatePretest()) return;
    setSubmitting(true);
    setSubmitError('');

    const enteredPgy = demographics.pgy
      ? parseInt(demographics.pgy.replace(/[^0-9]/g, ''), 10)
      : null;
    const mismatchFlags: Record<string, unknown> = {};
    if (lookup && lookup.pgy && enteredPgy && enteredPgy !== lookup.pgy) {
      mismatchFlags.pgy_mismatch = true;
      mismatchFlags.pgy_on_file = lookup.pgy;
      mismatchFlags.pgy_self_reported = enteredPgy;
    }

    const payload = {
      demographics,
      fabryPretest: {
        comfortRating,
      },
      mismatchFlags,
    };

    try {
      const res = await fetch('/api/intake/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setSubmitError(body.error ?? 'Submission failed. Please try again.');
        setSubmitting(false);
        return;
      }
      router.push('/exercise');
    } catch {
      setSubmitError('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  // ---------------- Render ----------------
  const stepIndex = STEP_ORDER.indexOf(step);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug">
            {PAGE_TITLE}
          </h1>
          <p className="text-sm text-muted mt-2">
            Estimated time: {ESTIMATED_TIME}
          </p>
        </header>

        {/* Stepper */}
        <nav aria-label="Progress" className="mb-6">
          <ol className="flex flex-wrap gap-2 text-xs">
            {STEP_ORDER.map((s, i) => {
              const isCurrent = s === step;
              const isDone = i < stepIndex;
              return (
                <li
                  key={s}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                    isCurrent
                      ? 'border-primary bg-blue-50 text-primary font-semibold'
                      : isDone
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-border bg-card text-muted'
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-primary text-white'
                        : isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-muted'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span>{STEP_LABELS[s]}</span>
                </li>
              );
            })}
          </ol>
          <p className="text-xs text-muted mt-2">
            Step {stepIndex + 1} of {STEP_ORDER.length}: {STEP_LABELS[step]}
          </p>
        </nav>

        <div className="bg-card border border-border rounded-xl shadow-sm p-5 sm:p-7">
          {step === 'consent' && (
            <ConsentStep
              consented={consented}
              setConsented={setConsented}
              onContinue={handleConsentContinue}
            />
          )}
          {step === 'enrollment' && (
            <EnrollmentStep
              value={enrollmentNumber}
              onChange={setEnrollmentNumber}
              error={enrollmentError}
              loading={lookingUp}
              onSubmit={handleEnrollmentSubmit}
              onBack={goBack}
            />
          )}
          {step === 'demographics' && (
            <DemographicsStep
              fields={demographicFields}
              values={demographics}
              setValue={setDemoField}
              errors={demoErrors}
              onContinue={handleDemographicsContinue}
              onBack={goBack}
            />
          )}
          {step === 'fabryPretest' && (
            <ComfortStep
              value={comfortRating}
              setValue={setComfort}
              error={pretestErrors}
              submitting={submitting}
              submitError={submitError}
              onSubmit={handleFinalSubmit}
              onBack={goBack}
            />
          )}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          nav[aria-label='Progress'],
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

// =================================================================
// Step 1: Consent
// =================================================================
function ConsentStep({
  consented,
  setConsented,
  onContinue,
}: {
  consented: boolean;
  setConsented: (v: boolean) => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <p className="text-xs text-muted mb-4 uppercase tracking-wide">{IRB_LINE}</p>

      <div className="space-y-4 text-sm leading-relaxed text-foreground">
        {CONSENT_SECTIONS.map((s) => (
          <div key={s.label}>
            <p className="mb-1">
              <span className="font-bold">{s.label}:</span> {s.body}
            </p>
          </div>
        ))}

        <div>
          <p className="font-bold mb-1">CONTACT INFORMATION:</p>
          <p className="mb-2">
            <em className="font-semibold not-italic">{CONTACT_BLOCK.questionsLabel}</em>{' '}
            {CONTACT_BLOCK.questionsBody}
          </p>
          <p>
            <span className="font-bold">{CONTACT_BLOCK.independentLabel}</span>{' '}
            {CONTACT_BLOCK.independentBody}
          </p>
        </div>

        <p className="font-bold">{PRINT_REMINDER}</p>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="text-sm text-primary hover:underline self-start"
        >
          Print / save this page
        </button>
      </div>

      <hr className="my-5 border-border" />

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={consented}
          onChange={(e) => setConsented(e.target.checked)}
          className="mt-1 h-4 w-4 text-primary rounded border-border focus:ring-2 focus:ring-primary/30"
        />
        <span className="text-sm text-foreground">{CONSENT_CHECKBOX_LABEL}</span>
      </label>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          disabled={!consented}
          className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// =================================================================
// Step 2: Enrollment number
// =================================================================
function EnrollmentStep({
  value,
  onChange,
  error,
  loading,
  onSubmit,
  onBack,
}: {
  value: string;
  onChange: (v: string) => void;
  error: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}) {
  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-lg font-bold text-foreground mb-1">Participant Enrollment Number</h2>
      <p className="text-sm text-muted mb-4">
        Enter the enrollment number provided to you by the study coordinator.
      </p>

      <label htmlFor="enrollment" className="block text-sm font-semibold text-foreground mb-1.5">
        Participant Enrollment Number
      </label>
      <input
        id="enrollment"
        type="text"
        inputMode="text"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="P-001"
        aria-invalid={!!error}
        aria-describedby={error ? 'enrollment-error' : undefined}
        className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm uppercase"
      />
      {error && (
        <p id="enrollment-error" role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Looking up…' : 'Continue'}
        </button>
      </div>
    </form>
  );
}

// =================================================================
// Step 3: Demographics
// =================================================================
function DemographicsStep({
  fields,
  values,
  setValue,
  errors,
  onContinue,
  onBack,
}: {
  fields: DemographicField[];
  values: Record<string, string>;
  setValue: (k: string, v: string) => void;
  errors: Record<string, string>;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-1">Background</h2>
      <p className="text-sm text-muted mb-5">
        A brief background survey before you begin the case.
      </p>

      <div className="space-y-6">
        {fields.map((f) => (
          <fieldset key={f.key}>
            <legend className="text-sm font-semibold text-foreground mb-2">
              {f.label}
              <span className="text-red-600 ml-1" aria-hidden>
                *
              </span>
            </legend>

            {f.type === 'radio' && (
              <div className="space-y-2">
                {f.options.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2.5 px-3 py-2 border rounded-lg cursor-pointer text-sm transition-colors ${
                      values[f.key] === opt.value
                        ? 'border-primary bg-blue-50'
                        : 'border-border hover:border-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name={f.key}
                      value={opt.value}
                      checked={values[f.key] === opt.value}
                      onChange={(e) => setValue(f.key, e.target.value)}
                      className="h-4 w-4 text-primary"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            {f.type === 'numberYear' && (
              <input
                type="number"
                inputMode="numeric"
                min={f.min}
                max={f.max}
                value={values[f.key] ?? ''}
                onChange={(e) => setValue(f.key, e.target.value)}
                placeholder="YYYY"
                aria-invalid={!!errors[f.key]}
                aria-describedby={errors[f.key] ? `${f.key}-err` : undefined}
                className="w-32 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
              />
            )}

            {errors[f.key] && (
              <p id={`${f.key}-err`} role="alert" className="mt-1.5 text-sm text-red-700">
                {errors[f.key]}
              </p>
            )}
          </fieldset>
        ))}
      </div>

      <div className="mt-7 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// =================================================================
// Step 4: Clinical comfort (single 0–10 question)
// =================================================================
function ComfortStep({
  value,
  setValue,
  error,
  submitting,
  submitError,
  onSubmit,
  onBack,
}: {
  value: number | null;
  setValue: (v: number) => void;
  error: string;
  submitting: boolean;
  submitError: string;
  onSubmit: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-1">Clinical comfort</h2>
      <p className="text-sm text-muted mb-6">
        One brief question before you begin the case.
      </p>

      <fieldset>
        <legend className="text-sm font-semibold text-foreground mb-3">
          {COMFORT_QUESTION_TEXT}
          <span className="text-red-600 ml-1" aria-hidden>
            *
          </span>
        </legend>
        <ScaleInput
          min={COMFORT_SCALE_MIN}
          max={COMFORT_SCALE_MAX}
          minLabel={COMFORT_SCALE_MIN_LABEL}
          maxLabel={COMFORT_SCALE_MAX_LABEL}
          value={value}
          onChange={setValue}
          name="comfort"
        />
      </fieldset>

      {error && (
        <p role="alert" className="mt-5 text-sm text-red-700">
          {error}
        </p>
      )}
      {submitError && (
        <p role="alert" className="mt-5 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <div className="mt-7 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting…' : 'Submit and begin the case'}
        </button>
      </div>
    </div>
  );
}

// =================================================================
// ScaleInput: 0–10 button row used for the comfort question.
// =================================================================
function ScaleInput({
  min,
  max,
  minLabel,
  maxLabel,
  value,
  onChange,
  name,
}: {
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
  value: number | null;
  onChange: (v: number) => void;
  name: string;
}) {
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div>
      <div className="grid grid-cols-11 gap-1">
        {values.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            aria-pressed={value === v}
            aria-label={`${name} ${v}`}
            className={`py-2 rounded-md border text-sm font-medium transition-colors ${
              value === v
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-blue-50'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      {(minLabel || maxLabel) && (
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>{minLabel ? `${min} — ${minLabel}` : ''}</span>
          <span>{maxLabel ? `${max} — ${maxLabel}` : ''}</span>
        </div>
      )}
    </div>
  );
}
