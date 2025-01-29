import React from 'react';
import Editor, { OnChange } from '@monaco-editor/react';

interface MonacoWrapperProps {
  value: string;
  onChange: OnChange;
  language: string;
  height?: string;
}

export const MonacoWrapper = React.forwardRef<any, MonacoWrapperProps>((props, ref) => (
  <Editor
    height={props.height || "150px"}
    defaultLanguage={props.language}
    theme="vs-dark"
    options={{
      minimap: { enabled: false },
      fontSize: 14,
    }}
    value={props.value}
    onChange={props.onChange}
  />
));

MonacoWrapper.displayName = 'MonacoWrapper';