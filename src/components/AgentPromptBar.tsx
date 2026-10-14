import React, { useState } from 'react';
import { Sparkles, Wand2, ArrowRight, BookOpen, Layers, Terminal, AlertCircle } from 'lucide-react';
import { PlatformType, ResourceType, TemplatePreset } from '../types/addon';
import { STARTER_TEMPLATES } from '../data/templates';

interface AgentPromptBarProps {
  currentPlatform: PlatformType;
  resourceType: ResourceType;
  onChangeResourceType: (type: ResourceType) => void;
  targetVersion: string;
  onChangeTargetVersion: (ver: string) => void;
  prompt: string;
  onChangePrompt: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onSelectTemplate: (template: TemplatePreset) => void;
  onOpenInsights: () => void;
}

export const AgentPromptBar: React.FC<AgentPromptBarProps> = ({
  currentPlatform,
  resourceType,
  onChangeResourceType,
  targetVersion,
  onChangeTargetVersion,
  prompt,
  onChangePrompt,
  onGenerate,
  isGenerating,
  onSelectTemplate,
  onOpenInsights,
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const platformTemplates = STARTER_TEMPLATES.filter(
    (t) => t.platform === currentPlatform
  );

  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: currentPlatform, prompt }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        onChangePrompt(data.enhancedPrompt);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const getPlatformVersions = () => {
    switch (currentPlatform) {
      case 'blender':
        return ['Blender 4.2 LTS (Latest)', 'Blender 4.1', 'Blender 3.6 LTS'];
      case 'zbrush':
        return ['ZBrush 2025 (Latest)', 'ZBrush 2024', 'ZBrush 2023'];
      case 'procreate':
        return ['Procreate 5.3 (iPad)', 'Procreate Dreams', 'Pocket (iPhone)'];
      case 'photoshop':
        return ['Photoshop UXP 2024+', 'Photoshop 2023 UXP', 'ExtendScript JSX'];
      default:
        return ['Latest'];
    }
  };

  return (
    <div className="bg-[#121622] border-b border-[#1f273b] p-6 space-y-4">
      {/* Top row with Context & Market Opportunity Callout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">Workflow Target:</span>
          <span className="text-amber-400 font-mono capitalize">{currentPlatform}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Verified API Architecture</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Multi-file Commercial Export</span>
        </div>

        <button
          onClick={onOpenInsights}
          className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 transition-colors cursor-pointer self-start md:self-auto"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Market Opportunity & Monetization Density</span>
        </button>
      </div>

      {/* Main Prompt Input Box */}
      <div className="relative rounded-xl bg-[#0b0e16] border border-[#232b3e] focus-within:border-amber-500/60 focus-within:ring-1 focus-within:ring-amber-500/20 transition-all p-3 shadow-inner">
        <textarea
          value={prompt}
          onChange={(e) => onChangePrompt(e.target.value)}
          placeholder={`Describe what you want your ${currentPlatform} addon or resource to do... e.g. "Create a tool that automatically detects sharp edges, marks UV seams, sets bevel weights, and generates an inflated bake cage"`}
          rows={3}
          className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none resize-none font-sans"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1a2030] mt-1">
          {/* Controls: Resource Type & Target Version */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Type:</span>
              <select
                value={resourceType}
                onChange={(e) => onChangeResourceType(e.target.value as ResourceType)}
                className="bg-[#151a27] border border-[#232c40] rounded px-2 py-1 text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="suite">Full Addon Suite (Operators + UI)</option>
                <option value="script">Automation Script / Modal Operator</option>
                <option value="panel">Custom Viewport N-Panel</option>
                <option value="shader">Procedural Node Setup / Material</option>
                <option value="brush">Brush Preset & Dynamic Swatches</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Terminal className="w-3.5 h-3.5 text-slate-500" />
              <span>Version:</span>
              <select
                value={targetVersion}
                onChange={(e) => onChangeTargetVersion(e.target.value)}
                className="bg-[#151a27] border border-[#232c40] rounded px-2 py-1 text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                {getPlatformVersions().map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {/* Prompt Enhancer Button */}
            <button
              onClick={handleEnhance}
              disabled={isEnhancing || !prompt.trim()}
              className="px-2.5 py-1 text-xs font-medium text-amber-300 bg-amber-950/40 border border-amber-800/50 hover:bg-amber-900/40 rounded flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
              title="Expand with technical APIs, bmesh/ZScript hooks, and error handling"
            >
              <Wand2 className={`w-3 h-3 ${isEnhancing ? 'animate-spin' : ''}`} />
              <span>{isEnhancing ? 'Enhancing...' : 'Enhance with Technical Vocabulary'}</span>
            </button>
          </div>

          {/* Generate Button */}
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2 shadow-md shadow-orange-500/20 disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating Architecture...' : 'Generate with AI Agent'}</span>
          </button>
        </div>
      </div>

      {/* High-Yield Starter Templates Ribbons */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium text-slate-300">
            Top-Selling Market Blueprints ({currentPlatform}):
          </span>
          <span className="text-[11px] text-slate-500">
            Click to load architecture and commercial pricing
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {platformTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="text-left p-3 rounded-lg bg-[#0e121a] hover:bg-[#161d2b] border border-[#1f283a] hover:border-amber-500/40 transition-all group flex items-start justify-between gap-3 cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">
                    {template.title}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 tabular-nums">
                    {template.priceEstimate}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {template.prompt}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                  <span>{template.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{template.resourceType}</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
