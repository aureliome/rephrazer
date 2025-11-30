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

  // Other dropdowns
  const [clarity, setClarity] = useState<
    "none" | "minimal" | "moderate" | "full"
  >("none");
  const [lengthPolicy, setLengthPolicy] = useState<
    "preserve" | "slight" | "shorter" | "longer" | "flexible"
  >("preserve");
  const [meaning, setMeaning] = useState<"preserve" | "adapt" | "rewrite">(
    "preserve"
  );
  const [audience, setAudience] = useState<
    "unchanged" | "general" | "layman" | "expert"
  >("unchanged");

  // Output options
  const [highlightBold, setHighlightBold] = useState(true);
  const [finalComment, setFinalComment] = useState(false);

  // ------------- Presets -------------
  const clearAll = () => {
    setLevel("custom");
    setSpellingGrammar(false);
    setSyntaxRefinement(false);
    setLogicalCoherence(false);
    setFactCheck(false);
    setToneMode(false);
    setFormatMode(false);
    setRestructure(false);
    setStyleEnhance(false);
    setClarity("none");
    setLengthPolicy("preserve");
    setMeaning("preserve");
    setAudience("unchanged");
  };

  const applySoft = () => {
    if (level === "soft") {
      clearAll();
      return;
    }
    setLevel("soft");
    setSpellingGrammar(true);
    setSyntaxRefinement(true);
    setLogicalCoherence(false);
    setFactCheck(false);
    setToneMode(false);
    setFormatMode(false);
    setRestructure(false);
    setStyleEnhance(false);
    setClarity("minimal");
    setLengthPolicy("preserve");
    setMeaning("preserve");
    setAudience("unchanged");
  };

  const applyMedium = () => {
    if (level === "medium") {
      clearAll();
      return;
    }
    setLevel("medium");
    setSpellingGrammar(true);
    setSyntaxRefinement(true);
    setLogicalCoherence(true);
    setFactCheck(true);
    setToneMode(false);
    setFormatMode(false);
    setRestructure(true);
    setStyleEnhance(true);
    setClarity("moderate");
    setLengthPolicy("slight");
    setMeaning("adapt");
    setAudience("unchanged");
  };

  const applyHard = () => {
    if (level === "hard") {
      clearAll();
      return;
    }
    setLevel("hard");
    setSpellingGrammar(true);
    setSyntaxRefinement(true);
    setLogicalCoherence(true);
    setFactCheck(true);
    setToneMode(true);
    setFormatMode(true);
    setRestructure(true);
    setStyleEnhance(true);
    setClarity("full");
    setLengthPolicy("flexible");
    setMeaning("rewrite");
    setAudience("unchanged");
  };

  // Mark custom only when changing options (not text)
  const markCustom = () => setLevel("custom");

  // ------------- Prompt Builder -------------
  const selectedRulesList = useMemo(() => {
    const lines: string[] = [];

    // Basics
    if (spellingGrammar) {
      lines.push("Fix spelling, grammar, and punctuation.");
    }
    if (syntaxRefinement) {
      lines.push(
        "Improve syntax and minor wording to enhance readability without altering meaning unnecessarily."
      );
    }

    // Structure & Accuracy
    if (logicalCoherence) {
      lines.push("Ensure logical coherence and fix contradictions.");
    }
    if (factCheck) {
      lines.push(
        "Fact-check doubtful, technical, historical, or numerical statements. Correct inaccuracies. Cite sources in the final comment if corrections were made."
      );
    }
    if (restructure) {
      lines.push("You may restructure sentences for better flow.");
    }
    if (styleEnhance) {
      lines.push(
        "Enhance style and vocabulary when it improves readability and precision."
      );
    }

    // Style
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

    // Clarity
    if (clarity !== "none") {
      const clarityMap: Record<typeof clarity, string> = {
        minimal:
          "Improve clarity minimally; only adjust phrasing where necessary.",
        moderate:
          "Improve clarity and flow with moderate rewording and limited restructuring.",
        full: "Improve clarity with freedom to heavily rephrase and restructure when beneficial.",
      };
      if (clarityMap[clarity]) lines.push(clarityMap[clarity]);
    }

    // Length policy
    const lengthMap: Record<typeof lengthPolicy, string> = {
      preserve: "Keep length approximately the same.",
      slight: "Allow slight length adjustments (±15%).",
      shorter: "Prefer a shorter version while retaining key information.",
      longer: "Allow a longer version if needed for clarity.",
      flexible: "Length is flexible; shorten or expand as needed for quality.",
    };
    lines.push(lengthMap[lengthPolicy]);

    // Meaning
    const meaningMap: Record<typeof meaning, string> = {
      preserve: "Keep the main meaning and purpose the same.",
      adapt:
        "If the original is flawed or ambiguous, adapt wording slightly to clarify without changing the core message.",
      rewrite: "You may rewrite creatively while keeping the core message.",
    };
    lines.push(meaningMap[meaning]);

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
    styleEnhance,
    lengthPolicy,
    meaning,
    audience,
  ]);

  const outputRules = useMemo(() => {
    const lines: string[] = [];
    lines.push("Return the corrected text only.");
    if (highlightBold) {
      lines.push(
        "Highlight every change by making only the changed word(s) **bold**."
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

    const rules = selectedRulesList.map((l) => `- ${l}`).join("\n");
    const outputs = outputRules.map((l) => `- ${l}`).join("\n");

    return `${header}\n\nRules:\n${rules}\n\nOutput Rules:\n${outputs}\n\nText to rephrase:\n\n\`\`\`\n${
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

  // ------------- Render -------------
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Rephrazer - Rephrase Prompt Builder
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Compose GPTs prompts for rephrasing texts. <br /> Choose checks,
              apply a level, then generate your final prompt.
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
                  label="Meaning"
                  value={meaning}
                  onChange={(v) => {
                    setMeaning(v as any);
                    markCustom();
                  }}
                  options={[
                    { value: "preserve", label: "No meaning changes" },
                    { value: "adapt", label: "Adapt if helpful" },
                    { value: "rewrite", label: "Rewrite creatively" },
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
              <textarea
                className="w-full min-h-[260px] rounded-xl border border-slate-300 p-3 text-sm font-mono"
                readOnly
                value={builtPrompt}
              />
            </Section>
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-slate-500">
          Project created by{" "}
          <a href="https://github.com/aureliome" target="_blank">
            Aurelio Merenda
          </a>
          , available on{" "}
          <a href="https://github.com/aureliome/rephrazer" target="_blank">
            Github
          </a>
          .
        </footer>
      </div>
    </div>
  );
}
