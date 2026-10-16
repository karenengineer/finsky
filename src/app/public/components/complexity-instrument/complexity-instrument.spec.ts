import { TestBed } from '@angular/core/testing';
import { ComplexityInstrumentComponent } from './complexity-instrument';

describe('ComplexityInstrumentComponent', () => {
  it('shows the selected business level and updates it with the slider', async () => {
    await TestBed.configureTestingModule({ imports: [ComplexityInstrumentComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ComplexityInstrumentComponent);
    fixture.componentRef.setInput('content', {
      eyebrow: 'From complexity to clarity',
      inputLabel: 'Your business',
      outputLabel: 'Your result',
      sliderLabel: 'Business complexity',
      result: 'A clear monthly view',
      levels: [
        { id: 'sole', title: 'Sole proprietor', description: 'Small business', deliverable: 'Clear records' },
        { id: 'vat', title: 'VAT company', description: 'VAT reporting', deliverable: 'Deadline overview' },
        { id: 'growth', title: 'Growing business', description: 'More operations', deliverable: 'Monthly summary' },
        { id: 'group', title: 'Business group', description: 'Several entities', deliverable: 'Consolidated view' },
        { id: 'recovery', title: 'Books recovery', description: 'Restore records', deliverable: 'Recovery plan' },
      ],
    });
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const slider = root.querySelector<HTMLInputElement>('input[type="range"]')!;
    expect(root.textContent).toContain('Sole proprietor');
    expect(slider.getAttribute('aria-valuetext')).toBe('Sole proprietor');

    slider.value = '4';
    slider.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(root.textContent).toContain('Business group');
    expect(slider.getAttribute('aria-valuetext')).toBe('Business group');
  });
});
