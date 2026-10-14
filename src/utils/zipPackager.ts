import JSZip from 'jszip';
import { AddonProject } from '../types/addon';

export async function packageAndDownloadZip(project: AddonProject): Promise<void> {
  const zip = new JSZip();
  const folderName = project.identifier || 'nexusforge_addon';
  const root = zip.folder(folderName) || zip;

  // Add all source code and documentation files
  for (const file of project.files) {
    root.file(file.filename, file.code);
  }

  // Include comprehensive installation & marketplace text file
  const installGuide = `=====================================================
${project.name} (v${project.version})
Built for: ${project.platform.toUpperCase()}
Resource Type: ${project.resourceType}
Generated with NexusForge Studio
=====================================================

--- INSTALLATION GUIDE ---
${project.marketplaceInfo.installationGuide || 'See README.md for complete platform instructions.'}

--- TARGET AUDIENCE ---
${project.marketplaceInfo.targetAudience}

--- KEY FEATURES ---
${project.marketplaceInfo.features.map(f => `• ${f}`).join('\n')}

--- RECOMMENDED MARKETPLACE PRICING ---
Suggested Price: $${project.marketplaceInfo.suggestedPriceUSD} USD

--- TAGS ---
${project.marketplaceInfo.tags.join(', ')}

=====================================================
`;
  root.file('QUICK_START_AND_MARKETPLACE.txt', installGuide);

  // Generate ZIP blob and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.identifier}_v${project.version}_${project.platform}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
