import { fireEvent, render, screen } from '@testing-library/react-native';

import { ThemeProvider } from '@/theme';

import { Button } from './button';

describe('Button', () => {
  it('renders its label and calls onPress', async () => {
    const onPress = jest.fn();
    await render(
      <ThemeProvider>
        <Button label="Đặt bác sĩ" onPress={onPress} />
      </ThemeProvider>,
    );
    const button = screen.getByRole('button', { name: 'Đặt bác sĩ' });
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled while loading', async () => {
    const onPress = jest.fn();
    await render(
      <ThemeProvider>
        <Button label="Đang lưu" onPress={onPress} loading />
      </ThemeProvider>,
    );
    const button = screen.getByRole('button', { name: 'Đang lưu' });
    expect(button).toBeDisabled();
    await fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
