import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, FileText, Code2, Sparkles, RefreshCw } from 'lucide-react';
import { AddonFile } from '../types/addon';

interface MultiFileCodeEditorProps {
  files: AddonFile[];
  onUpdateFileCode: (filename: string, newCode: string) => void;
}

export const MultiFileCodeEditor: React.FC<MultiFileCodeEditorProps> = ({
  files,
  onUpdateFileCode,
}) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile = files[activeFileIndex] || files[0];

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.py')) return <Code2 className="w-3.5 h-3.5 text-orange-400" />;
    if (filename.endsWith('.txt')) return <FileText className="w-3.5 h-3.5 text-blue-400" />;
    if (filename.endsWith('.json')) return <FileCode className="w-3.5 h-3.5 text-purple-400" />;
    if (filename.endsWith('.js')) return <FileCode className="w-3.5 h-3.5 text-cyan-400" />;
    return <FileText className="w-3.5 h-3.5 text-slate-400" />;
  };

  const lines = activeFile ? activeFile.code.split('\n') : [];

  return (
    <div className="flex flex-col h-full bg-[#0c0f17] border border-[#1e2538] rounded-xl overflow-hidden shadow-xl">
      {/* Tab Header Bar */}
      <div className="flex items-center justify-between bg-[#121622] border-b border-[#1e2538] px-3 pt-2 overflow-x-auto">
        <div className="flex items-center gap-1 overflow-x-auto">
          {files.map((file, idx) => {
            const isActive = idx === activeFileIndex;
            return (
              <button
                key={file.filename}
                onClick={() => setActiveFileIndex(idx)}
                className={`px-3 py-1.5 text-xs font-mono rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border-t border-x ${
                  isActive
                    ? 'bg-[#0c0f17] text-white border-[#27324c] font-semibold border-b-transparent shadow-sm'
                    : 'bg-[#151a27] text-slate-400 border-transparent hover:text-slate-200 hover:bg-[#1a2133]'
                }`}
              >
                {getFileIcon(file.filename)}
                <span>{file.filename}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons: Copy & Download Single */}
        <div className="flex items-center gap-2 pb-1.5 shrink-0 pl-3">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-[#1a2133] hover:bg-[#232c44] border border-[#27324c] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy current file contents"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadSingle}
            className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-[#1a2133] hover:bg-[#232c44] border border-[#27324c] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download this file only"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* File Description Header */}
      {activeFile && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#0e121c] border-b border-[#181f30] text-[11px] text-slate-400">
          <span className="truncate">{activeFile.description}</span>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 tabular-nums shrink-0">
            <span>{lines.length} lines</span>
            <span aria-hidden="true">·</span>
            <span className="uppercase">{activeFile.language}</span>
          </div>
        </div>
      )}

      {/* Code Editor Surface with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative font-code text-xs">
        {/* Line Numbers column */}
        <div className="select-none bg-[#090c13] text-slate-600 px-3 py-3 border-r border-[#192032] text-right font-mono tabular-nums min-w-[3rem] overflow-hidden">
          {lines.map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Interactive Editable Code Textarea */}
        <div className="flex-1 relative overflow-auto bg-[#0c0f17]">
          <textarea
            value={activeFile?.code || ''}
            onChange={(e) => onUpdateFileCode(activeFile.filename, e.target.value)}
            spellCheck={false}
            className="w-full h-full min-h-[460px] p-3 font-code text-xs leading-6 bg-transparent text-slate-200 resize-none focus:outline-none whitespace-pre overflow-auto font-mono selection:bg-orange-500/30 selection:text-white"
          />
        </div>
      </div>
    </div>
  );
};
