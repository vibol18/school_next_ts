'use client';

import React, { useState } from 'react';
import { ChevronRight, Folder, FolderOpen, File, FileCode, FileText, FileJson, ImageIcon } from 'lucide-react';
import type { FileNode } from '@/app/(dashboard)/files/page';

const EXTENSION_ICONS: Record<string, React.ReactNode> = {
  ts: <FileCode className="w-3.5 h-3.5 text-sky-500" />,
  tsx: <FileCode className="w-3.5 h-3.5 text-sky-500" />,
  js: <FileCode className="w-3.5 h-3.5 text-amber-500" />,
  jsx: <FileCode className="w-3.5 h-3.5 text-amber-500" />,
  css: <FileText className="w-3.5 h-3.5 text-blue-500" />,
  json: <FileJson className="w-3.5 h-3.5 text-emerald-500" />,
  md: <FileText className="w-3.5 h-3.5 text-slate-500" />,
  html: <FileText className="w-3.5 h-3.5 text-orange-500" />,
  svg: <ImageIcon className="w-3.5 h-3.5 text-fuchsia-500" />,
  png: <ImageIcon className="w-3.5 h-3.5 text-fuchsia-500" />,
  jpg: <ImageIcon className="w-3.5 h-3.5 text-fuchsia-500" />,
  webp: <ImageIcon className="w-3.5 h-3.5 text-fuchsia-500" />,
  sh: <FileText className="w-3.5 h-3.5 text-rose-500" />,
};

function FileIcon({ name }: { name: string }) {
  const ext = name.includes('.') ? name.split('.').pop()?.toLowerCase() ?? '' : '';
  return EXTENSION_ICONS[ext] ?? <File className="w-3.5 h-3.5 text-slate-400" />;
}

function countFiles(node: FileNode): number {
  if (node.type === 'file') return 1;
  return (node.children ?? []).reduce((acc, child) => acc + countFiles(child), 0);
}

export function FileTree({ nodes, depth = 0 }: { nodes: FileNode[]; depth?: number }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (relPath: string) => {
    setCollapsed((prev) => ({ ...prev, [relPath]: !prev[relPath] }));
  };

  return (
    <ul className="space-y-0.5">
      {nodes.map((node) => {
        const isFolder = node.type === 'folder';
        const isCollapsed = collapsed[node.relPath];
        const indent = { paddingLeft: `${depth * 16}px` };

        if (isFolder) {
          return (
            <li key={node.relPath}>
              <button
                onClick={() => toggle(node.relPath)}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-slate-100/80 text-[13px] font-medium text-slate-700 transition-colors"
                style={indent}
              >
                <ChevronRight
                  className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
                />
                {isCollapsed ? (
                  <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span className="truncate">{node.name}</span>
                <span className="ml-auto text-[10px] text-slate-400 shrink-0">
                  {countFiles(node)} files
                </span>
              </button>
              {!isCollapsed && node.children && node.children.length > 0 && (
                <FileTree nodes={node.children} depth={depth + 1} />
              )}
            </li>
          );
        }

        return (
          <li key={node.relPath}>
            <div
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-slate-100/80 text-[13px] text-slate-600 transition-colors"
              style={indent}
            >
              <span className="w-3.5 shrink-0" />
              <FileIcon name={node.name} />
              <span className="truncate">{node.name}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
