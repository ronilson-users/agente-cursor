import { CryptoUtils } from '../../utils/CryptoUtils';
import { DOMUtils } from '../../utils/DOMUtils';

export class ConfigEvents {
  constructor(
    private container: HTMLElement,
    private onSaveConfig: () => void,
    private onTestAPI: () => void,
    private cryptoUtils: CryptoUtils
  ) {}

  initialize(): void {
    this.setupTemperatureSlider();
    this.setupApiKeyEvents();
    this.setupSaveEvent();
    this.setupTestEvent();
  }

  private setupTemperatureSlider(): void {
    const tempSlider = this.container.querySelector('#temperature') as HTMLInputElement;
    const tempValue = this.container.querySelector('#temp-value') as HTMLElement;

    tempSlider?.addEventListener('input', () => {
      if (tempValue && tempSlider) {
        tempValue.textContent = tempSlider.value;
      }
    });
  }

  private setupApiKeyEvents(): void {
    const revealBtn = this.container.querySelector('#reveal-key') as HTMLButtonElement;
    const clearKeyBtn = this.container.querySelector('#clear-key') as HTMLButtonElement;

    revealBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      const apiKeyEl = this.container.querySelector('#api-key') as HTMLInputElement;
      if (!apiKeyEl) return;
      apiKeyEl.type = apiKeyEl.type === 'password' ? 'text' : 'password';
    });

    clearKeyBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      const apiKeyEl = this.container.querySelector('#api-key') as HTMLInputElement;
      if (!apiKeyEl) return;
      apiKeyEl.value = '';
    });
  }

  private setupSaveEvent(): void {
    const saveBtn = this.container.querySelector('#save-config') as HTMLButtonElement;
    saveBtn?.addEventListener('click', () => this.onSaveConfig());
  }

  private setupTestEvent(): void {
    const testBtn = this.container.querySelector('#test-api') as HTMLButtonElement;
    testBtn?.addEventListener('click', () => this.onTestAPI());
  }
}