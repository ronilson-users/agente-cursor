/* 🧩 Acode Plugin Build - 2025-11-03T02:36:46.577Z */

// plugin.json
var plugin_default = {
  id: "rsjRonilson.IA.Agente",
  name: "testar",
  main: "main.ts",
  version: "1.0.0",
  readme: "readme.md",
  icon: "icon.png",
  files: [
    "styles/main.scss",
    "assets/icon.png",
    "src/main.ts",
    "src/api/deepseek.js",
    "src/api/multiAIOrchestrator.js",
    "src/features/codeGenerator.js",
    "src/features/codeCorrector.js",
    "src/features/projectCreator.js",
    "src/features/codeSuggester.js",
    "src/features/nextJSSpecialist.js",
    "src/features/contextAnalyzer.js",
    "src/ui/sidebar.js",
    "src/ui/dialogs.js",
    "src/utils/fileManager.js",
    "src/utils/analytics.js"
  ],
  minVersionCode: 290,
  license: "MIT",
  changelogs: "changelogs.md",
  keywords: [
    "app",
    "acode"
  ],
  permissions: [
    "storage",
    "internet",
    "file-system"
  ],
  supportedLanguages: [
    "javascript",
    "typescript",
    "python",
    "html",
    "css",
    "php",
    "java",
    "rust",
    "go",
    "sql"
  ],
  aiProviders: [
    "DeepSeek",
    "Gemini",
    "OpenAI"
  ],
  browser: false,
  author: {
    name: "rsjRoni",
    email: "ronilson.stos@gmail.com",
    github: "roilson-users"
  }
};

// src/styles/main.scss
var css = `.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;
  background: #f3f4f6;
  color: #374151;
  font-size: 14px;
  line-height: 1.5;
  overflow: hidden;
}
.sidebar-container .flex.border-b {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}
.sidebar-container .flex.border-b .tab-btn {
  flex: 1;
  padding: 12px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
  font-weight: 500;
}
.sidebar-container .flex.border-b .tab-btn.active {
  color: #2e2e2f;
  font-weight: 600;
  border-bottom-color: #2e2e2f;
  background: #f9fafb;
}
.sidebar-container .flex.border-b .tab-btn:hover:not(.active) {
  background: #f9fafb;
  color: #374151;
}
.sidebar-container .flex.border-b .tab-btn:active {
  transform: translateY(1px);
}
.sidebar-container .tab-content-main {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overflow-x: hidden;
  height: 100%;
}
.sidebar-container .tab-content-main .tab-pane {
  display: none;
  padding: 0;
  animation: fadeIn 0.25s ease;
  min-height: 100%;
}
.sidebar-container .tab-content-main .tab-pane.active {
  display: block;
}

.btn {
  display: block;
  padding: 12px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  text-align: center;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}
.btn.primary {
  background: #2e2e2f;
  color: white;
}
.btn.primary:hover:not(:disabled) {
  background: rgb(20.7741935484, 20.7741935484, 21.2258064516);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.btn.primary:active:not(:disabled) {
  transform: translateY(0);
}
.btn.secondary {
  background: #4b5563;
  color: white;
}
.btn.secondary:hover:not(:disabled) {
  background: rgb(53.0172413793, 60.0862068966, 69.9827586207);
  transform: translateY(-1px);
}
.btn.secondary:active:not(:disabled) {
  transform: translateY(0);
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}
.btn.py-1 {
  padding-top: 8px;
  padding-bottom: 8px;
}
.btn.py-2 {
  padding-top: 12px;
  padding-bottom: 12px;
}

input,
select,
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  transition: all 0.2s ease;
}
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #2e2e2f;
  box-shadow: 0 0 0 3px rgba(46, 46, 47, 0.1);
}
input::placeholder,
select::placeholder,
textarea::placeholder {
  color: #9ca3af;
}

.terminal-output {
  background: #282d37;
  color: #10b981;
  padding: 16px;
  border-radius: 4px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 160px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.terminal-output .text-success {
  color: #10b981;
}
.terminal-output .text-yellow-400 {
  color: #fbbf24;
}
.terminal-output .text-red-400 {
  color: #ef4444;
}
.terminal-output .text-blue-400 {
  color: #60a5fa;
}
.terminal-output .text-gray-400 {
  color: #9ca3af;
}
.terminal-output .text-gray-500 {
  color: #6b7280;
}

.text-success {
  color: #10b981;
}

.text-error {
  color: #ef4444;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (prefers-color-scheme: dark) {
  .sidebar-container {
    background: #282d37;
    color: #e5e7eb;
  }
  .sidebar-container .flex.border-b {
    background: #1f2937;
    border-bottom-color: #374151;
  }
  .sidebar-container .flex.border-b .tab-btn {
    color: #9ca3af;
  }
  .sidebar-container .flex.border-b .tab-btn.active {
    color: #2e2e2f;
    background: #1f2937;
  }
  .sidebar-container .flex.border-b .tab-btn:hover:not(.active) {
    background: #374151;
    color: #e5e7eb;
  }
  .sidebar-container input,
  .sidebar-container select,
  .sidebar-container textarea {
    background: #1f2937;
    border-color: #4b5563;
    color: #e5e7eb;
  }
  .sidebar-container input:focus,
  .sidebar-container select:focus,
  .sidebar-container textarea:focus {
    border-color: #2e2e2f;
    box-shadow: 0 0 0 3px rgba(46, 46, 47, 0.2);
  }
  .sidebar-container input::placeholder,
  .sidebar-container select::placeholder,
  .sidebar-container textarea::placeholder {
    color: #6b7280;
  }
  .sidebar-container .terminal-output {
    background: #0d1117;
    color: #10b981;
  }
  .sidebar-container .border {
    border-color: #4b5563;
  }
  .sidebar-container .bg-white {
    background: #1f2937 !important;
  }
  .sidebar-container .bg-gray-900 {
    background: #282d37 !important;
  }
}
@media (max-width: 768px) {
  .sidebar-container .flex.border-b .tab-btn {
    padding: 8px 4px;
    font-size: 12px;
  }
  .sidebar-container .tab-content .tab-pane .p-2 {
    padding: 12px;
  }
}
.loading {
  opacity: 0.7;
  pointer-events: none;
  position: relative;
}
.loading::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 2px solid transparent;
  border-top: 2px solid #2e2e2f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.tab-content-main {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
}

.sidebar-container {
  touch-action: pan-y;
}

.btn, input, select, textarea {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.tab-pane > div {
  min-height: calc(100vh - 120px);
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL2RhdGEvZGF0YS9jb20udGVybXV4L2ZpbGVzL2hvbWUvQ29udGludWEvdHMtc2lkZWJhci9zcmMvc3R5bGVzIiwic291cmNlcyI6WyJtYWluLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBc0NBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQSxZQWhDUztFQWlDVCxPQTNCUztFQTRCVCxXQWRhO0VBZWI7RUFDQTs7QUFHQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsV0FuQ1M7RUFvQ1QsT0FwREs7RUFxREw7RUFDQTtFQUNBOztBQUVBO0VBQ0UsT0FyRVE7RUFzRVI7RUFDQSxxQkF2RVE7RUF3RVIsWUFsRUU7O0FBcUVKO0VBQ0UsWUF0RUU7RUF1RUYsT0FoRUc7O0FBbUVMO0VBQ0U7O0FBTU47RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7O0FBY1I7RUFDRTtFQUNBO0VBQ0E7RUFDQSxlQXRHYztFQXVHZDtFQUNBO0VBQ0EsV0EvRmE7RUFnR2I7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRSxZQWpJWTtFQWtJWjs7QUFFQTtFQUNFO0VBQ0E7RUFDQTs7QUFHRjtFQUNFOztBQUlMO0VBQ0MsWUEvSWdCO0VBZ0poQjs7QUFFQTtFQUNDO0VBQ0E7O0FBR0Q7RUFDQzs7QUFJRjtFQUNDO0VBQ0E7RUFDQTs7QUFJRDtFQUNDLGFBaEpXO0VBaUpYLGdCQWpKVzs7QUFvSlo7RUFDQyxhQXBKVztFQXFKWCxnQkFySlc7OztBQTBKYjtBQUFBO0FBQUE7RUFHQztFQUNBLFNBOUpZO0VBK0paO0VBQ0EsZUFyS2U7RUFzS2YsV0E1SmM7RUE2SmQ7RUFDQTs7QUFFQTtBQUFBO0FBQUE7RUFDQztFQUNBLGNBN0xjO0VBOExkOztBQUdEO0FBQUE7QUFBQTtFQUNDLE9BeExTOzs7QUE2TFg7RUFDRSxZQXpMUztFQTBMVDtFQUNBLFNBbkxXO0VBb0xYLGVBMUxjO0VBMkxkO0VBQ0EsV0FuTGE7RUFvTGI7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUdBO0VBQWdCLE9BcE5GOztBQXFOZDtFQUFtQjs7QUFDbkI7RUFBZ0IsT0FyTko7O0FBc05aO0VBQWlCOztBQUNqQjtFQUFpQixPQWhOUjs7QUFpTlQ7RUFBaUIsT0FoTlI7OztBQW9OWDtFQUNDLE9BOU5lOzs7QUFpT2hCO0VBQ0MsT0FqT2E7OztBQXdPZDtFQUNDO0lBQ0M7SUFDQTs7RUFHRDtJQUNDO0lBQ0E7OztBQVFGO0VBQ0M7SUFDQyxZQTlPUztJQStPVCxPQXRQUzs7RUF3UFQ7SUFDQyxZQW5QUTtJQW9QUixxQkFyUFE7O0VBdVBSO0lBQ0MsT0EzUE87O0VBNlBQO0lBQ0MsT0F4UVc7SUF5UVgsWUEzUE07O0VBOFBQO0lBQ0MsWUFoUU07SUFpUU4sT0F0UU07O0VBMlFUO0FBQUE7QUFBQTtJQUdDLFlBeFFRO0lBeVFSLGNBM1FRO0lBNFFSLE9BaFJROztFQWtSUjtBQUFBO0FBQUE7SUFDQyxjQTNSWTtJQTRSWjs7RUFHRDtBQUFBO0FBQUE7SUFDQyxPQXJSTzs7RUF5UlQ7SUFDQztJQUNBOztFQUdEO0lBQ0MsY0E5UlE7O0VBaVNUO0lBQ0M7O0VBR0Q7SUFDQzs7O0FBV0g7RUFFRTtJQUNDO0lBQ0EsV0F2U1k7O0VBMFNiO0lBQ0MsU0EvU1U7OztBQXdUYjtFQUNDO0VBQ0E7RUFDQTs7QUFFQTtFQUNDO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUlGO0VBQ0M7SUFDQzs7RUFHRDtJQUNDOzs7QUFVRjtFQUNFO0VBQ0E7RUFDQTs7O0FBSUY7RUFDRTs7O0FBSUY7RUFDRTtFQUNBOzs7QUFJRjtFQUNFIiwic291cmNlc0NvbnRlbnQiOlsiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAxLiBfdmFyaWFibGVzIChBanVzdGFkbyBwYXJhIEdyYXlzY2FwZXMpXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuJHByaW1hcnktY29sb3I6ICMyZTJlMmY7XG4kc2Vjb25kYXJ5LWNvbG9yOiAjNGI1NTYzO1xuJHN1Y2Nlc3MtY29sb3I6ICMxMGI5ODE7XG4kZXJyb3ItY29sb3I6ICNlZjQ0NDQ7XG5cbi8vIFRvbnMgZGUgQ2luemEgcGFyYSBvIFRlbWEgQmFzZSAtIE5PTUVTIENPUlJJR0lET1NcbiRncmF5LTUwOiAjZjlmYWZiO1xuJGdyYXktMTAwOiAjZjNmNGY2O1xuJGdyYXktMjAwOiAjZTVlN2ViO1xuJGdyYXktMzAwOiAjZDFkNWRiO1xuJGdyYXktNDAwOiAjOWNhM2FmO1xuJGdyYXktNTAwOiAjNmI3MjgwO1xuJGdyYXktNjAwOiAjNGI1NTYzO1xuJGdyYXktNzAwOiAjMzc0MTUxO1xuJGdyYXktODAwOiAjMWYyOTM3O1xuJGdyYXktOTAwOiAjMjgyZDM3O1xuXG4kYm9yZGVyLXJhZGl1czogNHB4O1xuXG4vLyBFc3Bhw6dhbWVudG8gZSBGb250ZXMgXG4kc3BhY2luZy14eHM6IDRweDtcbiRzcGFjaW5nLXhzOiA4cHg7XG4kc3BhY2luZy1zbTogMTJweDtcbiRzcGFjaW5nLW1kOiAxNnB4O1xuJHNwYWNpbmctbGc6IDIwcHg7XG5cbiRmb250LXNpemUteHM6IDEycHg7XG4kZm9udC1zaXplLXNtOiAxNHB4O1xuJGZvbnQtc2l6ZS1iYXNlOiAxNnB4O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIDIuIFNpZGViYXIgQ29udGFpbmVyIFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi5zaWRlYmFyLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGhlaWdodDogMTAwdmg7IFxuICBtYXgtaGVpZ2h0OiAxMDB2aDtcbiAgYmFja2dyb3VuZDogJGdyYXktMTAwO1xuICBjb2xvcjogJGdyYXktNzAwO1xuICBmb250LXNpemU6ICRmb250LXNpemUtc207XG4gIGxpbmUtaGVpZ2h0OiAxLjU7XG4gIG92ZXJmbG93OiBoaWRkZW47IFxuICBcbiAgLy8gQ2FiZcOnYWxobyBjb20gYWJhc1xuICAuZmxleC5ib3JkZXItYiB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBwb3NpdGlvbjogc3RpY2t5O1xuICAgIHRvcDogMDtcbiAgICB6LWluZGV4OiAxMDtcbiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgJGdyYXktMjAwO1xuICAgIGJveC1zaGFkb3c6IDAgMXB4IDNweCByZ2JhKDAsIDAsIDAsIDAuMSk7XG4gICAgZmxleC1zaHJpbms6IDA7IC8vIE7Do28gZW5jb2xoZXJcbiAgICBcbiAgICAudGFiLWJ0biB7XG4gICAgICBmbGV4OiAxO1xuICAgICAgcGFkZGluZzogJHNwYWNpbmctc20gJHNwYWNpbmcteHM7XG4gICAgICBib3JkZXI6IG5vbmU7XG4gICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1zbTtcbiAgICAgIGNvbG9yOiAkZ3JheS01MDA7XG4gICAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xuICAgICAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkIHRyYW5zcGFyZW50O1xuICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgIFxuICAgICAgJi5hY3RpdmUge1xuICAgICAgICBjb2xvcjogJHByaW1hcnktY29sb3I7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGJvcmRlci1ib3R0b20tY29sb3I6ICRwcmltYXJ5LWNvbG9yO1xuICAgICAgICBiYWNrZ3JvdW5kOiAkZ3JheS01MDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgJjpob3Zlcjpub3QoLmFjdGl2ZSkge1xuICAgICAgICBiYWNrZ3JvdW5kOiAkZ3JheS01MDtcbiAgICAgICAgY29sb3I6ICRncmF5LTcwMDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgJjphY3RpdmUge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMXB4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIC8vIENPTlRFw5pETyBQUklOQ0lQQUwgLSDDmk5JQ08gUE9OVE8gREUgU0NST0xMXG4gIC50YWItY29udGVudC1tYWluIHtcbiAgICBmbGV4OiAxO1xuICAgIG92ZXJmbG93LXk6IGF1dG87IC8vIFNDUk9MTCBBUEVOQVMgQVFVSVxuICAgIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDsgLy8gQ1LDjVRJQ08gcGFyYSBpT1NcbiAgICBvdmVyZmxvdy14OiBoaWRkZW47XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIFxuICAgIC50YWItcGFuZSB7XG4gICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgcGFkZGluZzogMDtcbiAgICAgIGFuaW1hdGlvbjogZmFkZUluIDAuMjVzIGVhc2U7XG4gICAgICBtaW4taGVpZ2h0OiAxMDAlOyAvLyBHYXJhbnRpciBhbHR1cmEgbcOtbmltYVxuICAgICAgXG4gICAgICAmLmFjdGl2ZSB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBSRU1PVkVSIG92ZXJmbG93LXkgZG9zIHBhbmVzIGluZGl2aWR1YWlzXG4gICAgICAvLyBPIHNjcm9sbCBhZ29yYSDDqSBjb250cm9sYWRvIHBlbG8gY29udGFpbmVyIHByaW5jaXBhbFxuICAgIH1cbiAgfVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIDMuIENvbXBvbmVudGVzIEludGVybm9zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gQm90w7Vlc1xuLmJ0biB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBwYWRkaW5nOiAkc3BhY2luZy1zbSAkc3BhY2luZy1tZDtcbiAgYm9yZGVyOiBub25lO1xuICBib3JkZXItcmFkaXVzOiAkYm9yZGVyLXJhZGl1cztcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBmb250LXdlaWdodDogNTAwO1xuICBmb250LXNpemU6ICRmb250LXNpemUtc207XG4gIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2U7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAtd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6IHRyYW5zcGFyZW50OyAvLyBNZWxob3JhciB0b3VjaCBubyBtb2JpbGVcbiAgXG4gICYucHJpbWFyeSB7XG4gICAgYmFja2dyb3VuZDogJHByaW1hcnktY29sb3I7XG4gICAgY29sb3I6IHdoaXRlO1xuICAgIFxuICAgICY6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xuICAgICAgYmFja2dyb3VuZDogZGFya2VuKCRwcmltYXJ5LWNvbG9yLCAxMCUpO1xuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xcHgpO1xuICAgICAgYm94LXNoYWRvdzogMCAycHggNHB4IHJnYmEoMCwgMCwgMCwgMC4xKTtcbiAgICB9XG4gICAgXG4gICAgJjphY3RpdmU6bm90KDpkaXNhYmxlZCkge1xuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICAgIH1cbiAgfVxuIFxuICYuc2Vjb25kYXJ5IHtcbiAgYmFja2dyb3VuZDogJHNlY29uZGFyeS1jb2xvcjtcbiAgY29sb3I6IHdoaXRlO1xuICBcbiAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XG4gICBiYWNrZ3JvdW5kOiBkYXJrZW4oJHNlY29uZGFyeS1jb2xvciwgMTAlKTtcbiAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMXB4KTtcbiAgfVxuICBcbiAgJjphY3RpdmU6bm90KDpkaXNhYmxlZCkge1xuICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG4gfVxuIFxuICY6ZGlzYWJsZWQge1xuICBvcGFjaXR5OiAwLjU7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gIHRyYW5zZm9ybTogbm9uZSAhaW1wb3J0YW50O1xuIH1cbiBcbiAvLyBUYW1hbmhvc1xuICYucHktMSB7XG4gIHBhZGRpbmctdG9wOiAkc3BhY2luZy14cztcbiAgcGFkZGluZy1ib3R0b206ICRzcGFjaW5nLXhzO1xuIH1cbiBcbiAmLnB5LTIge1xuICBwYWRkaW5nLXRvcDogJHNwYWNpbmctc207XG4gIHBhZGRpbmctYm90dG9tOiAkc3BhY2luZy1zbTtcbiB9XG59XG5cbi8vIENhbXBvcyBkZSBmb3JtdWzDoXJpb1xuaW5wdXQsXG5zZWxlY3QsXG50ZXh0YXJlYSB7XG4gd2lkdGg6IDEwMCU7XG4gcGFkZGluZzogJHNwYWNpbmctc207XG4gYm9yZGVyOiAxcHggc29saWQgJGdyYXktMzAwO1xuIGJvcmRlci1yYWRpdXM6ICRib3JkZXItcmFkaXVzO1xuIGZvbnQtc2l6ZTogJGZvbnQtc2l6ZS1zbTtcbiBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xuIFxuICY6Zm9jdXMge1xuICBvdXRsaW5lOiBub25lO1xuICBib3JkZXItY29sb3I6ICRwcmltYXJ5LWNvbG9yO1xuICBib3gtc2hhZG93OiAwIDAgMCAzcHggcmdiYSgkcHJpbWFyeS1jb2xvciwgMC4xKTtcbiB9XG4gXG4gJjo6cGxhY2Vob2xkZXIge1xuICBjb2xvcjogJGdyYXktNDAwO1xuIH1cbn1cblxuLy8gVGVybWluYWwgT3V0cHV0XG4udGVybWluYWwtb3V0cHV0IHtcbiAgYmFja2dyb3VuZDogJGdyYXktOTAwO1xuICBjb2xvcjogIzEwYjk4MTtcbiAgcGFkZGluZzogJHNwYWNpbmctbWQ7XG4gIGJvcmRlci1yYWRpdXM6ICRib3JkZXItcmFkaXVzO1xuICBmb250LWZhbWlseTogJ01vbmFjbycsICdNZW5sbycsICdVYnVudHUgTW9ubycsIG1vbm9zcGFjZTtcbiAgZm9udC1zaXplOiAkZm9udC1zaXplLXhzO1xuICBsaW5lLWhlaWdodDogMS40O1xuICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XG4gIHdvcmQtYnJlYWs6IGJyZWFrLWFsbDtcbiAgbWF4LWhlaWdodDogMTYwcHg7IC8vIFJlZHV6aXIgdW0gcG91Y28gcGFyYSBtb2JpbGVcbiAgb3ZlcmZsb3cteTogYXV0bztcbiAgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoO1xuICBcbiAgLy8gQ29yZXMgKG1hbnRpZG8gaWd1YWwpXG4gIC50ZXh0LXN1Y2Nlc3MgeyBjb2xvcjogJHN1Y2Nlc3MtY29sb3I7IH1cbiAgLnRleHQteWVsbG93LTQwMCB7IGNvbG9yOiAjZmJiZjI0OyB9XG4gIC50ZXh0LXJlZC00MDAgeyBjb2xvcjogJGVycm9yLWNvbG9yOyB9XG4gIC50ZXh0LWJsdWUtNDAwIHsgY29sb3I6ICM2MGE1ZmE7IH1cbiAgLnRleHQtZ3JheS00MDAgeyBjb2xvcjogJGdyYXktNDAwOyB9XG4gIC50ZXh0LWdyYXktNTAwIHsgY29sb3I6ICRncmF5LTUwMDsgfVxufVxuXG4vLyBTdGF0dXMgZSBpbmRpY2Fkb3Jlc1xuLnRleHQtc3VjY2VzcyB7XG4gY29sb3I6ICRzdWNjZXNzLWNvbG9yO1xufVxuXG4udGV4dC1lcnJvciB7XG4gY29sb3I6ICRlcnJvci1jb2xvcjtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyA0LiBBbmltYcOnw7Vlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbkBrZXlmcmFtZXMgZmFkZUluIHtcbiBmcm9tIHtcbiAgb3BhY2l0eTogMDtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDVweCk7XG4gfVxuIFxuIHRvIHtcbiAgb3BhY2l0eTogMTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyA1LiBNb2RvIEVzY3Vyb1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbkBtZWRpYSAocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspIHtcbiAuc2lkZWJhci1jb250YWluZXIge1xuICBiYWNrZ3JvdW5kOiAkZ3JheS05MDA7XG4gIGNvbG9yOiAkZ3JheS0yMDA7XG4gIFxuICAuZmxleC5ib3JkZXItYiB7XG4gICBiYWNrZ3JvdW5kOiAkZ3JheS04MDA7XG4gICBib3JkZXItYm90dG9tLWNvbG9yOiAkZ3JheS03MDA7XG4gICBcbiAgIC50YWItYnRuIHtcbiAgICBjb2xvcjogJGdyYXktNDAwO1xuICAgIFxuICAgICYuYWN0aXZlIHtcbiAgICAgY29sb3I6ICRwcmltYXJ5LWNvbG9yO1xuICAgICBiYWNrZ3JvdW5kOiAkZ3JheS04MDA7XG4gICAgfVxuICAgIFxuICAgICY6aG92ZXI6bm90KC5hY3RpdmUpIHtcbiAgICAgYmFja2dyb3VuZDogJGdyYXktNzAwO1xuICAgICBjb2xvcjogJGdyYXktMjAwO1xuICAgIH1cbiAgIH1cbiAgfVxuICBcbiAgaW5wdXQsXG4gIHNlbGVjdCxcbiAgdGV4dGFyZWEge1xuICAgYmFja2dyb3VuZDogJGdyYXktODAwO1xuICAgYm9yZGVyLWNvbG9yOiAkZ3JheS02MDA7XG4gICBjb2xvcjogJGdyYXktMjAwO1xuICAgXG4gICAmOmZvY3VzIHtcbiAgICBib3JkZXItY29sb3I6ICRwcmltYXJ5LWNvbG9yO1xuICAgIGJveC1zaGFkb3c6IDAgMCAwIDNweCByZ2JhKCRwcmltYXJ5LWNvbG9yLCAwLjIpO1xuICAgfVxuICAgXG4gICAmOjpwbGFjZWhvbGRlciB7XG4gICAgY29sb3I6ICRncmF5LTUwMDtcbiAgIH1cbiAgfVxuICBcbiAgLnRlcm1pbmFsLW91dHB1dCB7XG4gICBiYWNrZ3JvdW5kOiAjMGQxMTE3O1xuICAgY29sb3I6ICMxMGI5ODE7XG4gIH1cbiAgXG4gIC5ib3JkZXIge1xuICAgYm9yZGVyLWNvbG9yOiAkZ3JheS02MDA7XG4gIH1cbiAgXG4gIC5iZy13aGl0ZSB7XG4gICBiYWNrZ3JvdW5kOiAkZ3JheS04MDAgIWltcG9ydGFudDtcbiAgfVxuICBcbiAgLmJnLWdyYXktOTAwIHtcbiAgIGJhY2tncm91bmQ6ICRncmF5LTkwMCAhaW1wb3J0YW50O1xuICB9XG4gfVxufVxuXG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyA3LiBVdGlsaXTDoXJpb3MgUmVzcG9uc2l2b3Ncbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAuc2lkZWJhci1jb250YWluZXIge1xuICAuZmxleC5ib3JkZXItYiAudGFiLWJ0biB7XG4gICBwYWRkaW5nOiAkc3BhY2luZy14cyAkc3BhY2luZy14eHM7XG4gICBmb250LXNpemU6ICRmb250LXNpemUteHM7XG4gIH1cbiAgXG4gIC50YWItY29udGVudCAudGFiLXBhbmUgLnAtMiB7XG4gICBwYWRkaW5nOiAkc3BhY2luZy1zbTtcbiAgfVxuIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyA4LiBFc3RhZG9zIGRlIExvYWRpbmcgZSBEaXNhYmxlZFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi5sb2FkaW5nIHtcbiBvcGFjaXR5OiAwLjc7XG4gcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gcG9zaXRpb246IHJlbGF0aXZlO1xuIFxuICY6OmFmdGVyIHtcbiAgY29udGVudDogJyc7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA1MCU7XG4gIGxlZnQ6IDUwJTtcbiAgd2lkdGg6IDE2cHg7XG4gIGhlaWdodDogMTZweDtcbiAgbWFyZ2luOiAtOHB4IDAgMCAtOHB4O1xuICBib3JkZXI6IDJweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLXRvcDogMnB4IHNvbGlkICRwcmltYXJ5LWNvbG9yO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGFuaW1hdGlvbjogc3BpbiAxcyBsaW5lYXIgaW5maW5pdGU7XG4gfVxufVxuXG5Aa2V5ZnJhbWVzIHNwaW4ge1xuIDAlIHtcbiAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XG4gfVxuIFxuIDEwMCUge1xuICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuIH1cbn1cblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIDkuIENPUlJFw4fDlUVTIEVTUEVDw41GSUNBUyBQQVJBIFRPVUNIXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gTWVsaG9yYXIgcGVyZm9ybWFuY2Ugbm8gc2Nyb2xsIHRvdWNoXG4udGFiLWNvbnRlbnQtbWFpbiB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWigwKTsgLy8gQWNlbGVyYXIgaGFyZHdhcmVcbiAgYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuO1xuICBwZXJzcGVjdGl2ZTogMTAwMDtcbn1cblxuLy8gUHJldmVuaXIgem9vbSBubyBkb3VibGUtdGFwIChpT1MpXG4uc2lkZWJhci1jb250YWluZXIge1xuICB0b3VjaC1hY3Rpb246IHBhbi15OyAvLyBTw7MgcGVybWl0ZSBzY3JvbGwgdmVydGljYWxcbn1cblxuLy8gTWVsaG9yYXIgdG9xdWUgZW0gYm90w7VlcyBlIGlucHV0c1xuLmJ0biwgaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWEge1xuICAtd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6IHRyYW5zcGFyZW50O1xuICB0b3VjaC1hY3Rpb246IG1hbmlwdWxhdGlvbjsgLy8gTWVsaG9yIHJlc3Bvc3RhIGFvIHRvcXVlXG59XG5cbi8vIEdhcmFudGlyIHF1ZSBjb250ZcO6ZG8gdGVuaGEgYWx0dXJhIHN1ZmljaWVudGUgcGFyYSBzY3JvbGxcbi50YWItcGFuZSA+IGRpdiB7XG4gIG1pbi1oZWlnaHQ6IGNhbGMoMTAwdmggLSAxMjBweCk7IC8vIEFsdHVyYSBtw61uaW1hIGJhc2VhZGEgbmEgdmlld3BvcnRcbn1cblxuIl19 */`;
document.head.appendChild(document.createElement("style")).appendChild(document.createTextNode(css));

// src/main.ts
var toast = acode.require("toast");
var AcodePlugin = class {
  baseUrl;
  sideBarApps;
  async init($page, cacheFile, cacheFileUrl) {
    try {
      this.sideBarApps = window.sidebarApps || acode.require("sidebarApps");
      if (!this.sideBarApps) {
        console.error("sidebarApps n\xE3o dispon\xEDvel");
        return;
      }
      const iconUrl = `${this.baseUrl || ""}assets/icon.png`;
      acode.addIcon("sidebar-icon", iconUrl);
      this.sideBarApps.add(
        "sidebar-icon",
        "agente_IA",
        "Agente IA",
        (container) => this.initializeAppUI(container),
        false,
        (container) => this.onAppSelected(container)
      );
      console.log("Plugin inicializado com sucesso");
    } catch (error) {
      console.error("Erro ao inicializar plugin:", error);
    }
  }
  initializeAppUI(container) {
    container.innerHTML = `
    <div class="sidebar-container ">
      <!-- Abas  -->
      <div class="flex border-b">
        <button class="tab-btn active" data-tab="assistant">Assistente</button>
        <button class="tab-btn" data-tab="projects">Projetos</button>
        <button class="tab-btn" data-tab="settings">CONFIG</button>
      </div>

      <!-- CONTE\xDADO \u2013 **\xFAnico ponto de scroll** -->
      <div class="tab-content-main scroll">
        <!-- Assistente -->
        <div class="tab-pane active" id="assistant-tab">
          <div class="p-2">
            <h3 class="font-bold mb-2">Assistente IA</h3>
            ${this.getAssistantContent()}
          </div>
        </div>

        <!-- Projetos -->
        <div class="tab-pane" id="projects-tab">
          <div class="p-2">
            <h3 class="font-bold mb-2">Projetos</h3>
            <div id="project-creator-content"></div>
          </div>
        </div>

        <!-- Config -->
        <div class="tab-pane" id="settings-tab">
          <div class="p-2">
            ${this.getSettingsContent()}
          </div>
        </div>
      </div>
    </div>
  `;
    setTimeout(() => {
      this.initializeTabSystem(container);
      this.initializeProjectCreatorUI(container);
      this.initializeAssistantUI(container);
      this.initializeSettingsUI(container);
    }, 100);
  }
  initializeTabSystem(container) {
    const buttons = container.querySelectorAll(".tab-btn");
    const panes = container.querySelectorAll(".tab-pane");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        const paneId = `${tab}-tab`;
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        panes.forEach((p) => {
          p.classList.toggle("active", p.id === paneId);
        });
      });
    });
  }
  initializeProjectCreatorUI(container) {
    const projectContainer = container.querySelector("#project-creator-content");
    if (!projectContainer) {
      console.error("Container #project-creator-content n\xE3o encontrado");
      return;
    }
    class CLIProjectCreator {
      getAvailableTemplates() {
        return {
          vanilla: { name: "Vanilla JS", description: "Projeto JS puro" },
          react: { name: "React", description: "App React com Vite" },
          node: { name: "Node.js", description: "API com Express" }
        };
      }
    }
    const creator = new CLIProjectCreator();
    const templates = creator.getAvailableTemplates();
    let options = "";
    for (const [key, tmpl] of Object.entries(templates)) {
      options += `<option value="${key}">${tmpl.name} - ${tmpl.description}</option>`;
    }
    projectContainer.innerHTML = `
      <!-- Formul\xE1rio -->
      <div class="space-y-3 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1">Template:</label>
          <select id="project-template" class="w-full p-2 border rounded">
            ${options}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Nome do Projeto:</label>
          <input type="text" id="project-name" placeholder="meu-projeto"
                 class="w-full p-2 border rounded"
                 value="meu-projeto-${Date.now().toString().slice(-4)}">
        </div>

        <button class="btn primary w-full py-2" id="create-project">
          Criar Projeto
        </button>

        <div class="text-xs text-gray-500 text-center">
          Criado via terminal - R\xE1pido e eficiente
        </div>
      </div>

      <!-- Terminal -->
      <div class="terminal-section mb-4">
        <div class="flex justify-between items-center mb-1">
          <label class="text-sm font-medium">Terminal Output:</label>
          <button class="btn secondary text-xs py-1" id="clear-output">Limpar</button>
        </div>
        <div id="terminal-output" class="terminal-output bg-gray-900 text-green-400 p-3 rounded font-mono text-xs h-40 overflow-auto">
$ Aguardando comando...
        </div>
      </div>

      <!-- Conte\xFAdo longo para scroll -->
      ${this.getProjectCreatorContent()}
    `;
    projectContainer.addEventListener("click", (e) => {
      const target = e.target;
      if (target.id === "create-project") {
        this.handleCreateProject();
      }
      if (target.id === "clear-output") {
        const output = document.getElementById("terminal-output");
        if (output) output.innerHTML = "$ Output limpo\n";
      }
    });
  }
  getProjectCreatorContent() {
    return `
      <div class="p-2 mt-6 border-t pt-4 space-y-2">
        <h3 class="font-bold mb-2">Teste de Scroll (Projetos)</h3>
        <p>Role para baixo para testar o scroll nesta aba tamb\xE9m</p>
        ${Array(40).fill(`<p class="text-sm text-gray-700 dark:text-gray-300">Projeto exemplo em constru\xE7\xE3o... informa\xE7\xF5es de template, configura\xE7\xF5es, logs, etc.</p>`).join("")}
      </div>
    `;
  }
  getAssistantContent() {
    return `
      <div class="space-y-2" id="assistant-content">
        <p class="p-2">Bem-vindo ao Assistente IA!</p>
        <p class="p-2">Role para baixo para testar o scroll</p>
        ${Array(50).fill(`<p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.</p>`).join("")}
      </div>
    `;
  }
  getSettingsContent() {
    return `
      <div class="space-y-3" id="settings-content">
        <h3 class="font-bold mb-2">Configura\xE7\xF5es Gerais</h3>
        <div class="space-y-2">
          <label class="flex items-center gap-2">
            <input type="checkbox" checked class="rounded"> Habilitar IA
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" class="rounded"> Modo Dark
          </label>
        </div>
        ${Array(90).fill(`<p class="text-sm text-gray-600 dark:text-gray-400">Op\xE7\xE3o de configura\xE7\xE3o avan\xE7ada...</p>`).join("")}
      </div>
    `;
  }
  initializeAssistantUI(container) {
    const el = container.querySelector("#assistant-content");
    if (!el) return;
    el.addEventListener("click", (e) => {
      const t = e.target;
      if (t.id === "btn-generate-code") this.handleGenerateCode();
    });
  }
  initializeSettingsUI(container) {
    const el = container.querySelector("#settings-content");
    if (!el) return;
  }
  // Métodos de ação (exemplos)
  handleCreateProject() {
    toast("Projeto criado com sucesso!");
  }
  handleGenerateCode() {
    toast("C\xF3digo gerado!");
  }
  onAppSelected(container) {
    toast("Podemos iniciar", 400);
  }
  async destroy() {
    if (this.sideBarApps) {
      this.sideBarApps.remove("agente_IA");
      this.sideBarApps.remove("sidebar-icon");
    }
  }
};
if (window.acode) {
  const acodePlugin = new AcodePlugin();
  acode.setPluginInit(plugin_default.id, async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
    if (!baseUrl.endsWith("/")) baseUrl += "/";
    acodePlugin.baseUrl = baseUrl;
    await acodePlugin.init($page, cacheFile, cacheFileUrl);
  });
  acode.setPluginUnmount(plugin_default.id, () => {
    acodePlugin.destroy();
  });
}
//# sourceMappingURL=main.js.map
