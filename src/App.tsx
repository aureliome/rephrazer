import React, { useEffect, useMemo, useState } from "react";
import Section from "./components/Section";
import Toggle from "./components/Toggle";
import Select from "./components/Select";

export default function App() {
  // ------------- State -------------
  const [text, setText] = useState("");
  const [level, setLevel] = useState<"custom" | "soft" | "medium" | "hard">(
    "custom"
  );

  // Core toggles
  const [spellingGrammar, setSpellingGrammar] = useState(false);
  const [syntaxRefinement, setSyntaxRefinement] = useState(false);
  const [logicalCoherence, setLogicalCoherence] = useState(false);
  const [factCheck, setFactCheck] = useState(false);
  const [restructure, setRestructure] = useState(false);
  const [styleEnhance, setStyleEnhance] = useState(false);
  const [toneMode, setToneMode] = useState(false);
  const [formatMode, setFormatMode] = useState(false);
  const [meaningAdapt, setMeaningAdapt] = useState(false);
  const [rewriteCreatively, setRewriteCreatively] = useState(false);

  // Other dropdowns
  const [clarity, setClarity] = useState<
    "none" | "minimal" | "moderate" | "full"
  >("minimal");
  const [lengthPolicy, setLengthPolicy] = useState<
    "preserve" | "slight" | "shorter" | "longer" | "flexible"
  >("preserve");
  const [audience, setAudience] = useState<
    "unchanged" | "general" | "layman" | "expert"
  >("unchanged");

  // Output options
  const [highlightBold, setHighlightBold] = useState(true);
  const [finalComment, setFinalComment] = useState(false);

  // ------------- Presets -------------
  const applySoft = () => {
    setLevel("soft");
    setSpellingGrammar(true);
    setSyntaxRefinement(true);
    setLogicalCoherence(false);
    setFactCheck(false);
    setToneMode(false);
    setFormatMode(false);
    setRestructure(false);
    setRewriteCreatively(false);
    setMeaningAdapt(false);
    setStyleEnhance(false);
    setClarity("minimal");
    setLengthPolicy("preserve");
    setAudience("unchanged");
  };

  const applyMedium = () => {
    setLevel("medium");
    setSpellingGrammar(true);
    setSyntaxRefinement(true);
    setLogicalCoherence(true);
    setFactCheck(true);
    setToneMode(false);
    setFormatMode(false);
    setRestructure(true);
    setRewriteCreatively(false);
    setMeaningAdapt(false);
    setStyleEnhance(true);
    setClarity("moderate");
    setLengthPolicy("slight");
    setAudience("unchanged");
  };

  const applyHard = () => {
    setLevel("hard");
    setSpellingGrammar(true);
    setSyntaxRefinement(true);
    setLogicalCoherence(true);
    setFactCheck(true);
    setToneMode(true);
    setFormatMode(true);
    setRestructure(true);
    setRewriteCreatively(true);
    setMeaningAdapt(true);
    setStyleEnhance(true);
    setClarity("full");
    setLengthPolicy("flexible");
    setAudience("unchanged");
  };

  // Mark custom only when changing options (not text)
  const markCustom = () => setLevel("custom");

  // ------------- Prompt Builder -------------
  const selectedRulesList = useMemo(() => {
    const lines: string[] = [];

    if (spellingGrammar) lines.push("Fix spelling, grammar, and punctuation.");
    if (syntaxRefinement)
      lines.push(
        "Improve syntax and minor wording to enhance readability without altering meaning unnecessarily."
      );

    if (clarity !== "none") {
      const map: Record<typeof clarity, string> = {
        none: "",
        minimal:
          "Improve clarity minimally; only adjust phrasing where necessary.",
        moderate:
          "Improve clarity and flow with moderate rewording and limited restructuring.",
        full: "Improve clarity with freedom to heavily rephrase and restructure when beneficial.",
      };
      if (map[clarity]) lines.push(map[clarity]);
    }

    if (logicalCoherence)
      lines.push("Ensure logical coherence and fix contradictions.");

    if (factCheck) {
      lines.push(
        "Fact-check doubtful, technical, historical, or numerical statements. Correct inaccuracies. Cite sources in the final comment if corrections were made."
      );
    }

    // Tone & Formatting
    if (toneMode) {
      lines.push("Adjust tone if it improves quality and intent.");
    } else {
      lines.push("Preserve the original tone.");
    }
    if (formatMode) {
      lines.push(
        "You may adjust formatting and structure if it improves readability."
      );
    } else {
      lines.push("Preserve the original formatting and structure.");
    }

    // Structure & creativity
    if (restructure)
      lines.push("You may restructure sentences for better flow.");
    if (rewriteCreatively)
      lines.push(
        "You may rewrite creatively while keeping the main meaning and purpose."
      );

    // Meaning logic per your spec
    if (!meaningAdapt) {
      lines.push("Keep the main meaning and purpose the same.");
    } else {
      lines.push(
        "If the original is flawed or ambiguous, adapt wording slightly to clarify without changing the core message."
      );
    }

    // Style
    if (styleEnhance)
      lines.push(
        "Enhance style and vocabulary when it improves readability and precision."
      );

    // Length policy
    const lengthMap: Record<typeof lengthPolicy, string> = {
      preserve: "Keep length approximately the same.",
      slight: "Allow slight length adjustments (±15%).",
      shorter: "Prefer a shorter version while retaining key information.",
      longer: "Allow a longer version if needed for clarity.",
      flexible: "Length is flexible; shorten or expand as needed for quality.",
    };
    lines.push(lengthMap[lengthPolicy]);

    // Audience
    const audienceMap: Record<typeof audience, string> = {
      unchanged: "Maintain the current audience level.",
      general: "Write for a general audience.",
      layman: "Explain for non-experts (layman-friendly).",
      expert: "Write for an expert audience (precise and concise).",
    };
    if (audience !== "unchanged") lines.push(audienceMap[audience]);

    return lines;
  }, [
    spellingGrammar,
    syntaxRefinement,
    clarity,
    logicalCoherence,
    factCheck,
    toneMode,
    formatMode,
    restructure,
    rewriteCreatively,
    meaningAdapt,
    styleEnhance,
    lengthPolicy,
    audience,
  ]);

  const outputRules = useMemo(() => {
    const lines: string[] = [];
    lines.push("Return the corrected text only.");
    if (highlightBold) {
      lines.push(
        "Highlight every change by making only the changed word(s) **bold**."
      );
    } else {
      lines.push(
        "Do not use bold to highlight changes; present the final text plainly."
      );
    }
    if (finalComment) {
      lines.push(
        "After the text, add a short *final comment* in italic, placed after a line with three dashes (---). Summarize what changed and why; if factual corrections were made, cite sources."
      );
    } else {
      lines.push("Do not include any explanation or final comment.");
    }
    return lines;
  }, [highlightBold, finalComment]);

  const builtPrompt = useMemo((): string => {
    const header = `You will rephrase the provided text using the following rules.`;
    const levelLine =
      level === "custom"
        ? ""
        : level === "soft"
        ? "\nLevel preset: Soft (minimal intervention)."
        : level === "medium"
        ? "\nLevel preset: Medium (improve readability; fact-check)."
        : "\nLevel preset: Hard (flexible rewrite; fact-check).";

    const rules = selectedRulesList.map((l) => `- ${l}`).join("\n");
    const outputs = outputRules.map((l) => `- ${l}`).join("\n");

    return `${header}${levelLine}\n\nRules:\n${rules}\n\nOutput Rules:\n${outputs}\n\nText to rephrase:\n\n\`\`\`\n${
      text || "[PASTE TEXT HERE]"
    }\n\`\`\``;
  }, [selectedRulesList, outputRules, text, level]);

  // ------------- Helpers -------------
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(builtPrompt);
      alert("Prompt copied to clipboard ✅");
    } catch {
      alert("Could not copy to clipboard. You can select and copy manually.");
    }
  };

  // ------------- Minimal Dev Tests (console) -------------
  useEffect(() => {
    try {
      console.assert(
        typeof builtPrompt === "string",
        "builtPrompt should be a string"
      );
      console.assert(
        builtPrompt.includes("Rules:"),
        "Prompt should include 'Rules:' section"
      );
      console.assert(
        builtPrompt.includes("Output Rules:"),
        "Prompt should include 'Output Rules:' section"
      );
      console.assert(
        builtPrompt.includes("```"),
        "Prompt should include fenced code block"
      );
      const testJoin = ["a", "b"].join("\n");
      console.assert(
        testJoin === "a\nb",
        "Join with \n should produce a single newline"
      );
    } catch (e) {
      console.warn("Dev test failed:", e);
    }
  }, [builtPrompt]);

  // ------------- Render -------------
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Rephrase Prompt Builder
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Compose precise prompts for ChatGPT and similar tools. Choose
              checks, apply a level, then generate your final prompt.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={applySoft}
              className={`px-3 py-2 rounded-xl text-sm font-medium border ${
                level === "soft"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white border-slate-300"
              }`}
            >
              Soft
            </button>
            <button
              type="button"
              onClick={applyMedium}
              className={`px-3 py-2 rounded-xl text-sm font-medium border ${
                level === "medium"
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-white border-slate-300"
              }`}
            >
              Medium
            </button>
            <button
              type="button"
              onClick={applyHard}
              className={`px-3 py-2 rounded-xl text-sm font-medium border ${
                level === "hard"
                  ? "bg-rose-600 text-white border-rose-600"
                  : "bg-white border-slate-300"
              }`}
            >
              Hard
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <Section
              title="Checks & Corrections"
              right={
                <span className="text-xs text-slate-500">Level: {level}</span>
              }
            >
              <div className="space-y-5">
                {/* Basics */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-1">
                    Basics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    <div>
                      <Toggle
                        label="Spelling & grammar"
                        checked={spellingGrammar}
                        onChange={(v) => {
                          setSpellingGrammar(v);
                          markCustom();
                        }}
                      />
                    </div>
                    <div>
                      <Toggle
                        label="Syntax refinement"
                        checked={syntaxRefinement}
                        onChange={(v) => {
                          setSyntaxRefinement(v);
                          markCustom();
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Structure & Accuracy */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-1">
                    Structure & Accuracy
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    <div>
                      <Toggle
                        label="Logical coherence"
                        checked={logicalCoherence}
                        onChange={(v) => {
                          setLogicalCoherence(v);
                          markCustom();
                        }}
                      />
                      <Toggle
                        label="Restructure sentences"
                        checked={restructure}
                        onChange={(v) => {
                          setRestructure(v);
                          markCustom();
                        }}
                      />
                    </div>
                    <div>
                      <Toggle
                        label="Fact-check"
                        checked={factCheck}
                        onChange={(v) => {
                          setFactCheck(v);
                          markCustom();
                        }}
                      />
                      <Toggle
                        label="Enhance style & vocabulary"
                        checked={styleEnhance}
                        onChange={(v) => {
                          setStyleEnhance(v);
                          markCustom();
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Style */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-1">
                    Style
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    <div>
                      <Toggle
                        label="Adjust tone if helpful"
                        checked={toneMode}
                        onChange={(v) => {
                          setToneMode(v);
                          markCustom();
                        }}
                      />
                      <Toggle
                        label="Adapt meaning if helpful"
                        checked={meaningAdapt}
                        onChange={(v) => {
                          setMeaningAdapt(v);
                          markCustom();
                        }}
                      />
                    </div>
                    <div>
                      <Toggle
                        label="Adjust formatting if helpful"
                        checked={formatMode}
                        onChange={(v) => {
                          setFormatMode(v);
                          markCustom();
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Creativity */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-1">
                    Creativity
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    <div>
                      <Toggle
                        label="Rewrite creatively"
                        checked={rewriteCreatively}
                        onChange={(v) => {
                          setRewriteCreatively(v);
                          markCustom();
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Intensity & Audience">
              <div className="grid grid-cols-1 gap-3">
                <Select
                  label="Improve clarity"
                  value={clarity}
                  onChange={(v) => {
                    setClarity(v as any);
                    markCustom();
                  }}
                  options={[
                    { value: "none", label: "No clarity changes" },
                    { value: "minimal", label: "Minimal" },
                    { value: "moderate", label: "Moderate" },
                    { value: "full", label: "Full rewrite allowed" },
                  ]}
                />
                <Select
                  label="Length policy"
                  value={lengthPolicy}
                  onChange={(v) => {
                    setLengthPolicy(v as any);
                    markCustom();
                  }}
                  options={[
                    { value: "preserve", label: "Preserve length" },
                    { value: "slight", label: "Slight change (±15%)" },
                    { value: "shorter", label: "Prefer shorter" },
                    { value: "longer", label: "Allow longer" },
                    { value: "flexible", label: "Flexible" },
                  ]}
                />
                <Select
                  label="Audience"
                  value={audience}
                  onChange={(v) => {
                    setAudience(v as any);
                    markCustom();
                  }}
                  options={[
                    { value: "unchanged", label: "Unchanged" },
                    { value: "general", label: "General audience" },
                    { value: "layman", label: "Layman-friendly" },
                    { value: "expert", label: "Expert audience" },
                  ]}
                />
              </div>
            </Section>

            <Section title="Output Options">
              <div className="grid grid-cols-1 gap-2">
                <Toggle
                  label="Highlight changes in bold"
                  checked={highlightBold}
                  onChange={setHighlightBold}
                />
                <Toggle
                  label="Add final comment after text"
                  checked={finalComment}
                  onChange={setFinalComment}
                />
              </div>
            </Section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Section title="Text to Rephrase">
              <textarea
                className="w-full min-h-[220px] rounded-xl border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="Paste or type your text here…"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-2">
                Tip: Paste your paragraph(s) here. The prompt will include this
                under a code block.
              </p>
            </Section>

            <Section
              title="Create Prompt"
              right={
                <button
                  type="button"
                  onClick={copyPrompt}
                  className="px-3 py-2 rounded-xl text-sm font-medium bg-slate-900 text-white hover:bg-slate-800"
                >
                  Copy
                </button>
              }
            >
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => {
                    /* no-op */
                  }}
                  className="px-3 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500"
                  title="The prompt below updates automatically as you tweak options."
                >
                  Create prompt
                </button>
                <span className="text-xs text-slate-500">
                  Auto-updates as you change options
                </span>
              </div>
              <textarea
                className="w-full min-h-[260px] rounded-xl border border-slate-300 p-3 text-sm font-mono"
                readOnly
                value={builtPrompt}
              />
            </Section>
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-slate-500">
          Built with React + Tailwind (multi-file structure). Presets follow
          Soft / Medium / Hard semantics you defined.
        </footer>
      </div>
    </div>
  );
}
