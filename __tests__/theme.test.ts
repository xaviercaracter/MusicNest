import { colors, spacing, typography, borderRadius } from '../theme';

describe('theme', () => {
  it('should have dark color scheme', () => {
    expect(colors.dark).toBeDefined();
    expect(colors.dark.background).toBe('#0A0A0A');
    expect(colors.dark.primary).toBe('#FFB000');
  });

  it('should have light color scheme', () => {
    expect(colors.light).toBeDefined();
    expect(colors.light.background).toBe('#F5EFE3');
    expect(colors.light.primary).toBe('#B06E16');
  });

  it('should have spacing values', () => {
    expect(spacing.xs).toBe(4);
    expect(spacing.sm).toBe(8);
    expect(spacing.md).toBe(16);
  });

  it('should have typography values', () => {
    expect(typography.fontSizes).toBeDefined();
    expect(typography.fontWeights).toBeDefined();
  });

  it('should have border radius values', () => {
    expect(borderRadius.sm).toBe(4);
    expect(borderRadius.full).toBe(9999);
  });
});
