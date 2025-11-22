import * as React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '../ThemedText';

// Mock the useThemeColor hook
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: () => '#11181C',
}));

describe('ThemedText', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<ThemedText>Snapshot test!</ThemedText>);
    expect(getByText('Snapshot test!')).toBeTruthy();
  });

  it('renders correctly with title type', () => {
    const { getByText } = render(<ThemedText type="title">Title Text</ThemedText>);
    expect(getByText('Title Text')).toBeTruthy();
  });

  it('renders correctly with custom light color', () => {
    const { getByText } = render(
      <ThemedText lightColor="#FF0000">Colored Text</ThemedText>
    );
    expect(getByText('Colored Text')).toBeTruthy();
  });
});
