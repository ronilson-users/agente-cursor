export class TabSystem {
  constructor(private container: HTMLElement) {}

  initialize(): void {
    const buttons = Array.from(this.container.querySelectorAll('.tab-btn')) as HTMLButtonElement[];
    const indicator = this.container.querySelector('.tab-indicator') as HTMLElement | null;

    if (indicator) {
      indicator.style.width = `${100 / Math.max(buttons.length, 1)}%`;
      indicator.style.transform = `translateX(0%)`;
    }

    buttons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        this.switchTab(buttons, indicator, btn, index);
      });
    });
  }

  private switchTab(
    buttons: HTMLButtonElement[], 
    indicator: HTMLElement | null, 
    activeBtn: HTMLButtonElement, 
    index: number
  ): void {
    buttons.forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');

    if (indicator) {
      indicator.style.transform = `translateX(${index * 100}%)`;
    }

    const tab = activeBtn.dataset.tab!;
    this.container.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === `${tab}-tab`);
    });
  }
}