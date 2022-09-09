import React from 'react';
import './index.css';
import {
  SandpackLayout,
  SandpackProvider,
  SandpackFileExplorer,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
} from "@codesandbox/sandpack-react";
import { sandpackDark, dracula, nightOwl, monokaiPro, githubLight, aquaBlue } from "@codesandbox/sandpack-themes";

const externalResources = [
  "https://unpkg.com/@vue/reactivity@3.0.5/dist/reactivity.global.js",
];

const editorHeight = window.innerHeight - 80;
const options = {
  showTabs: false,
  showNavigator: true,
  showLineNumbers: true,
  showInlineErrors: true,
  showRefreshButton: true,
  closableTabs: true,
  wrapContent: true,
};

function Sandbox({
  files,
}) {
  return (
    <div>
      <SandpackProvider
        customSetup={{
          entry: "/index.js",
        }}
        files={files}
        theme={nightOwl}
        options={{
          externalResources,
        }}
        editorHeight={editorHeight}
      >
        <SandpackLayout>
          <div className='sandbox'>
            <div className='explore'><SandpackFileExplorer /></div>
            <div className='editor'><SandpackCodeEditor {...options} /></div>
            <div className='preview'>
              <div className='preview-box'>
                <SandpackPreview
                  showNavigator={options?.showNavigator}
                  showRefreshButton={options?.showRefreshButton}
                />
              </div>
              <div className='console-box'><SandpackConsole /></div>
            </div>
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}

export default Sandbox;
