import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

const fileTree = [
  { id: '1', name: 'index.html', type: 'file', language: 'html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>' },
  { id: '2', name: 'styles.css', type: 'file', language: 'css', content: 'body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\nh1 {\n  color: #333;\n}' },
  { id: '3', name: 'app.js', type: 'file', language: 'javascript', content: 'console.log("Hello from JavaScript!");\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\ngreet("World");' },
  { id: '4', name: 'main.py', type: 'file', language: 'python', content: 'def greet(name):\n    return f"Hello, {name}!"\n\nif __name__ == "__main__":\n    print(greet("World"))' },
];

export function CodeEditor() {
  const { theme } = useStore();
  const [selectedFile, setSelectedFile] = useState(fileTree[0]);
  const [code, setCode] = useState(fileTree[0].content);

  const handleFileSelect = (file: typeof fileTree[0]) => {
    setSelectedFile(file);
    setCode(file.content);
  };

  return (
    <div className="flex h-full">
      {/* File Tree */}
      <div className="w-64 border-r border-border/50 p-3 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Explorer</h3>
          <Button size="icon" variant="ghost" className="h-6 w-6" data-testid="button-new-file">
            <Icons.FilePlus className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-1">
          {fileTree.map((file) => {
            const IconComponent = file.type === 'file' ? Icons.File : Icons.Folder;
            return (
              <button
                key={file.id}
                onClick={() => handleFileSelect(file)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover-elevate active-elevate-2 transition-colors ${
                  selectedFile.id === file.id ? 'bg-primary/20' : ''
                }`}
                data-testid={`file-${file.name}`}
              >
                <IconComponent className="h-4 w-4" />
                {file.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Icons.Code className="h-4 w-4" />
            <span className="text-sm font-medium">{selectedFile.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" data-testid="button-format">
              <Icons.Wand2 className="h-4 w-4 mr-2" />
              Format
            </Button>
            <Button size="sm" variant="ghost" data-testid="button-run">
              <Icons.Play className="h-4 w-4 mr-2" />
              Run
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <Editor
            height="100%"
            language={selectedFile.language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              rulers: [],
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
        <div className="flex items-center justify-between px-3 py-1 border-t border-border/50 text-xs text-muted-foreground">
          <span>Ln 1, Col 1</span>
          <span>{selectedFile.language}</span>
        </div>
      </div>
    </div>
  );
}
