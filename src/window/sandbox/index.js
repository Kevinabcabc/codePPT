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
  showLineNumbers: true,
  showInlineErrors: true,
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
          activeFile: '/index.js',
          initMode: 'lazy',
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
                  showNavigator={true}
                  showRefreshButton={true}
                  key={Math.random()}
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
