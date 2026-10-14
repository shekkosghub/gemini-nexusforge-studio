/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { AgentPromptBar } from './components/AgentPromptBar';
import { MultiFileCodeEditor } from './components/MultiFileCodeEditor';
import { ViewportSimulator } from './components/ViewportSimulator';
import { MarketplaceStudio } from './components/MarketplaceStudio';
import { MarketplaceInsightsModal } from './components/MarketplaceInsightsModal';
import { PlatformType, ResourceType, AddonProject, TemplatePreset } from './types/addon';
import { STARTER_TEMPLATES } from './data/templates';
import { packageAndDownloadZip } from './utils/zipPackager';
import { Code2, MonitorPlay, ShoppingBag, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentPlatform, setCurrentPlatform] = useState<PlatformType>('blender');
  const [resourceType, setResourceType] = useState<ResourceType>('suite');
  const [targetVersion, setTargetVersion] = useState<string>('Blender 4.2 LTS (Latest)');
  const [prompt, setPrompt] = useState<string>(
    'A Blender 4.2+ N-panel addon that calculates sharp mesh dihedral angles, marks UV seams automatically, assigns non-destructive bevel weights, and generates an inflated vertex displacement cage for high-to-low texture baking.'
  );
  const [activeProject, setActiveProject] = useState<AddonProject | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'simulator' | 'marketplace'>('editor');
  const [isInsightsOpen, setIsInsightsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load initial project on mount or when switching platforms
  const loadPlatformProject = async (platform: PlatformType, customPrompt?: string) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-addon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          resourceType,
          targetVersion,
          prompt: customPrompt || prompt,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setActiveProject(data.data);
      }
    } catch (err) {
      console.error('Failed to load project:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    loadPlatformProject('blender');
  }, []);

  const handleSelectPlatform = (plat: PlatformType) => {
    setCurrentPlatform(plat);
    // Find matching template to update prompt
    const defaultTemplate = STARTER_TEMPLATES.find((t) => t.platform === plat);
    if (defaultTemplate) {
      setPrompt(defaultTemplate.prompt);
      setResourceType(defaultTemplate.resourceType);
      loadPlatformProject(plat, defaultTemplate.prompt);
    } else {
      loadPlatformProject(plat);
    }
    showToast(`Switched workspace to ${plat.toUpperCase()}`);
  };

  const handleSelectTemplate = (template: TemplatePreset) => {
    setCurrentPlatform(template.platform);
    setResourceType(template.resourceType);
    setPrompt(template.prompt);
    loadPlatformProject(template.platform, template.prompt);
    showToast(`Loaded blueprint: "${template.title}"`);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-addon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: currentPlatform,
          resourceType,
          targetVersion,
          prompt,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setActiveProject(data.data);
        showToast(`AI generated addon: "${data.data.name}"`);
      }
    } catch (err) {
      console.error(err);
      showToast('Generation error, using fallback template.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateFileCode = (filename: string, newCode: string) => {
    if (!activeProject) return;
    const updatedFiles = activeProject.files.map((f) =>
      f.filename === filename ? { ...f, code: newCode } : f
    );
    setActiveProject({ ...activeProject, files: updatedFiles });
  };

  const handleExportZip = async () => {
    if (!activeProject) return;
    setIsExporting(true);
    try {
      await packageAndDownloadZip(activeProject);
      showToast(`Package "${activeProject.identifier}.zip" downloaded!`);
    } catch (e) {
      console.error(e);
      showToast('Failed to export zip file.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b11] text-slate-100 flex flex-col font-sans selection:bg-orange-500/20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#161c2b] border border-[#27324c] text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Contract Compliant Navigation */}
      <TopNav
        currentPlatform={currentPlatform}
        onSelectPlatform={handleSelectPlatform}
        onExportZip={handleExportZip}
        isExporting={isExporting}
      />

      {/* Agent Studio Input & Blueprint Bar */}
      <AgentPromptBar
        currentPlatform={currentPlatform}
        resourceType={resourceType}
        onChangeResourceType={setResourceType}
        targetVersion={targetVersion}
        onChangeTargetVersion={setTargetVersion}
        prompt={prompt}
        onChangePrompt={setPrompt}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        onSelectTemplate={handleSelectTemplate}
        onOpenInsights={() => setIsInsightsOpen(true)}
      />

      {/* Main Studio Viewport & Tooling Tabs */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 flex flex-col space-y-4">
        {/* Workspace Sub-Nav Tabs */}
        <div className="flex items-center justify-between border-b border-[#1f283c] pb-3">
          <div className="flex items-center gap-1.5 p-1 bg-[#121622] rounded-lg border border-[#21293c]">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-[#1e273a] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Multi-File Code Sandbox</span>
              {activeProject && (
                <span className="font-mono text-[10px] text-slate-400 bg-[#161d2d] px-1.5 py-0.5 rounded ml-1">
                  {activeProject.files.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-[#1e273a] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MonitorPlay className="w-3.5 h-3.5 text-blue-400" />
              <span>Interactive Runtime Simulator</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
            </button>

            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'marketplace'
                  ? 'bg-[#1e273a] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
              <span>Marketplace & Monetization Kit</span>
              {activeProject?.marketplaceInfo?.suggestedPriceUSD && (
                <span className="font-mono text-[10px] text-emerald-400 bg-[#161d2d] px-1.5 py-0.5 rounded ml-1">
                  ${activeProject.marketplaceInfo.suggestedPriceUSD}
                </span>
              )}
            </button>
          </div>

          {/* Active Addon Title Metadata */}
          {activeProject && (
            <div className="hidden md:flex items-center gap-3 text-xs text-slate-400">
              <span className="font-bold text-slate-200">{activeProject.name}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono text-slate-400">v{activeProject.version}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono text-slate-400 capitalize">{activeProject.platform}</span>
            </div>
          )}
        </div>

        {/* Tab Contents */}
        <div className="flex-1">
          {activeProject ? (
            <>
              {activeTab === 'editor' && (
                <MultiFileCodeEditor
                  files={activeProject.files}
                  onUpdateFileCode={handleUpdateFileCode}
                />
              )}

              {activeTab === 'simulator' && (
                <ViewportSimulator
                  platform={activeProject.platform}
                  controls={activeProject.simulatedControls}
                  addonName={activeProject.name}
                />
              )}

              {activeTab === 'marketplace' && (
                <MarketplaceStudio
                  project={activeProject}
                  onUpdateProject={setActiveProject}
                />
              )}
            </>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center p-8 bg-[#10141f] border border-[#1e2538] rounded-xl">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
              </div>
              <h3 className="text-sm font-semibold text-white">Initializing Studio Architecture...</h3>
              <p className="text-xs text-slate-400 mt-1">Generating multi-file addon files and runtime controls.</p>
            </div>
          )}
        </div>
      </main>

      {/* Market Insights & Demand Density Modal */}
      <MarketplaceInsightsModal
        isOpen={isInsightsOpen}
        onClose={() => setIsInsightsOpen(false)}
      />

      {/* Quiet Footer adhering strictly to Anti-Slop Discipline */}
      <footer className="border-t border-[#182030] py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-[1600px] w-full mx-auto">
        <div className="flex items-center gap-2">
          <span>NexusForge Studio</span>
          <span aria-hidden="true">·</span>
          <span>Commercial Creative Addon Generator</span>
          <span aria-hidden="true">·</span>
          <a
            href="https://github.com/shekkosghub/gemini-nexusforge-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-200 underline-offset-2 hover:underline inline-flex items-center gap-1 transition-colors"
          >
            GitHub Repository
          </a>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span>Blender 4.2+ LTS</span>
          <span aria-hidden="true">·</span>
          <span>ZBrush ZScript</span>
          <span aria-hidden="true">·</span>
          <span>Procreate 5.3+</span>
          <span aria-hidden="true">·</span>
          <span>Photoshop UXP</span>
        </div>
      </footer>
    </div>
  );
}
