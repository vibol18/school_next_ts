import fs from 'fs';
import path from 'path';
import { FolderOpen, FileCode, FolderTree } from 'lucide-react';
import { FileTree } from '@/components/files/FileTree';

export interface FileNode {
  name: string;
  relPath: string;
  type: 'folder' | 'file';
  children?: FileNode[];
}

const EXCLUDED_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  'tsconfig.tsbuildinfo',
]);

const EXCLUDED_FILES = new Set([
  '.DS_Store',
  'package-lock.json',
]);

function buildTree(dir: string, relPath: string, depth = 0, maxDepth = 8): FileNode[] {
  if (depth > maxDepth) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const nodes: FileNode[] = [];

  for (const entry of entries) {
    if (EXCLUDED_DIRS.has(entry.name) || EXCLUDED_FILES.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    const childRel = path.join(relPath, entry.name);

    if (entry.isDirectory()) {
      nodes.push({
        name: entry.name,
        relPath: childRel,
        type: 'folder',
        children: buildTree(fullPath, childRel, depth + 1, maxDepth),
      });
    } else {
      nodes.push({ name: entry.name, relPath: childRel, type: 'file' });
    }
  }

  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return nodes;
}

export default function FilesPage() {
  const root = process.cwd();
  const tree = buildTree(root, '');
  const countFiles = (nodes: FileNode[]): number =>
    nodes.reduce(
      (acc, n) => acc + (n.type === 'file' ? 1 : countFiles(n.children ?? [])),
      0
    );
  const countFolders = (nodes: FileNode[]): number =>
    nodes.reduce(
      (acc, n) => acc + (n.type === 'folder' ? 1 + countFolders(n.children ?? []) : 0),
      0
    );

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-[#5b51ef] text-xs font-semibold uppercase tracking-wider mb-1">
          <FolderOpen className="w-4 h-4" />
          Project Explorer
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">File Explorer</h1>
        <p className="text-sm text-[#6b7280] mt-1">
          Browse the project&apos;s files and folders.
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#5b51ef]/10 text-[#5b51ef] flex items-center justify-center">
            <FolderTree className="w-4 h-4" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 leading-tight">{countFolders(tree)}</p>
            <p className="text-[11px] font-medium text-slate-500">Folders</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 leading-tight">{countFiles(tree)}</p>
            <p className="text-[11px] font-medium text-slate-500">Files</p>
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <FolderOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 leading-tight truncate">
              {root.split('/').pop() || 'project'}
            </p>
            <p className="text-[11px] font-medium text-slate-500 truncate">{root}</p>
          </div>
        </div>
      </div>

      {/* Tree */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Project files</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click a folder to expand or collapse it.
          </p>
        </div>
        <div className="p-4 max-h-[560px] overflow-y-auto">
          <FileTree nodes={tree} />
        </div>
      </div>
    </div>
  );
}
