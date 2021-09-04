import React from 'react';
import CodeEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

type EditorProps = {
  value: string;
  onChangeValue: (value: string) => void;
}

export default function Editor({ value = '', onChangeValue }: EditorProps): React.ReactElement {
  return (
    <CodeEditor
      value={value}
      onValueChange={onChangeValue}
      highlight={code => highlight(code, languages.javascript, "javascript")}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
      }}
    />
  );
}