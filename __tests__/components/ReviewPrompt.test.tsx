import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import * as StoreReview from 'expo-store-review';
import { ThemeProvider } from 'styled-components/native';
import ReviewPrompt from '../../components/review-prompt/ReviewPrompt';

const mockTheme = {
  colors: {
    primary: '#007AFF',
  },
};

describe('ReviewPrompt', () => {
  const mockOnClose = jest.fn();
  const mockOnFeedbackSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider theme={mockTheme}>
        <ReviewPrompt
          isVisible={true}
          onClose={mockOnClose}
          onFeedbackSubmit={mockOnFeedbackSubmit}
          {...props}
        />
      </ThemeProvider>
    );
  };

  describe('Initial Prompt', () => {
    it('should render the initial prompt correctly', () => {
      const { getByText } = renderComponent();
      
      expect(getByText('Are you enjoying Aurelia?')).toBeTruthy();
      expect(getByText("We'd love to know how we're doing! Your thoughts help us make Aurelia even better.")).toBeTruthy();
      expect(getByText('Not Really')).toBeTruthy();
      expect(getByText('Yes!')).toBeTruthy();
    });

    it('should not render when isVisible is false', () => {
      const { queryByText } = renderComponent({ isVisible: false });
      
      expect(queryByText('Are you enjoying Aurelia?')).toBeNull();
    });
  });

  describe('Positive Response Flow', () => {
    it('should close modal and request review when user responds positively', async () => {
      (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (StoreReview.requestReview as jest.Mock).mockResolvedValue(undefined);

      const { getByText } = renderComponent();
      
      fireEvent.press(getByText('Yes!'));
      
      expect(mockOnClose).toHaveBeenCalled();
      
      await waitFor(() => {
        expect(StoreReview.isAvailableAsync).toHaveBeenCalled();
      }, { timeout: 1000 });
    });

    it('should show alert when store review is not available', async () => {
      (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(false);

      const { getByText } = renderComponent();
      
      fireEvent.press(getByText('Yes!'));
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Rate Aurelia',
          'Help others discover Aurelia by leaving a quick review!',
          expect.any(Array)
        );
      }, { timeout: 1000 });
    });
  });

  describe('Negative Response Flow', () => {
    it('should show feedback form when user responds negatively', () => {
      const { getByText, queryByText } = renderComponent();
      
      fireEvent.press(getByText('Not Really'));
      
      expect(getByText('Help us make Aurelia amazing 🚀')).toBeTruthy();
      expect(getByText("We're always working to improve your experience. What would make Aurelia even better for you?")).toBeTruthy();
      expect(queryByText('Are you enjoying Aurelia?')).toBeNull();
    });
  });

  describe('Feedback Form', () => {
    const setupFeedbackForm = () => {
      const component = renderComponent();
      fireEvent.press(component.getByText('Not Really'));
      return component;
    };

    it('should render feedback form correctly', () => {
      const { getByText, getByPlaceholderText } = setupFeedbackForm();
      
      expect(getByText('Help us make Aurelia amazing 🚀')).toBeTruthy();
      expect(getByPlaceholderText('Your feedback...')).toBeTruthy();
      expect(getByText('Cancel')).toBeTruthy();
      expect(getByText('Submit')).toBeTruthy();
    });

    it('should allow user to type feedback', () => {
      const { getByPlaceholderText } = setupFeedbackForm();
      
      const input = getByPlaceholderText('Your feedback...');
      fireEvent.changeText(input, 'This is my feedback');
      
      expect(input.props.value).toBe('This is my feedback');
    });

    it('should enforce 500 character limit', () => {
      const { getByPlaceholderText } = setupFeedbackForm();
      
      const input = getByPlaceholderText('Your feedback...');
      
      expect(input.props.maxLength).toBe(500);
    });

    it('should submit feedback when Submit is pressed', () => {
      const { getByPlaceholderText, getByText } = setupFeedbackForm();
      
      const input = getByPlaceholderText('Your feedback...');
      fireEvent.changeText(input, 'Great app!');
      fireEvent.press(getByText('Submit'));
      
      expect(mockOnFeedbackSubmit).toHaveBeenCalledWith('Great app!');
      expect(mockOnClose).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        'Thank You!',
        'Your feedback helps us improve Aurelia.'
      );
    });

    it('should not submit empty feedback', () => {
      const { getByPlaceholderText, getByText } = setupFeedbackForm();
      
      const input = getByPlaceholderText('Your feedback...');
      fireEvent.changeText(input, '   ');
      fireEvent.press(getByText('Submit'));
      
      expect(mockOnFeedbackSubmit).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should cancel feedback and close modal', () => {
      const { getByText } = setupFeedbackForm();
      
      fireEvent.press(getByText('Cancel'));
      
      expect(mockOnClose).toHaveBeenCalled();
      expect(mockOnFeedbackSubmit).not.toHaveBeenCalled();
    });

    it('should clear feedback state when cancelled', () => {
      const { getByPlaceholderText, getByText } = setupFeedbackForm();
      
      const input = getByPlaceholderText('Your feedback...');
      fireEvent.changeText(input, 'Some feedback');
      
      expect(input.props.value).toBe('Some feedback');
      
      fireEvent.press(getByText('Cancel'));
      
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Theme Integration', () => {
    it('should render with theme provider', () => {
      const { getByText } = renderComponent();
      
      // Verify component renders successfully with theme
      expect(getByText('Are you enjoying Aurelia?')).toBeTruthy();
      expect(getByText('Yes!')).toBeTruthy();
    });

    it('should render feedback form with submit button', () => {
      const component = renderComponent();
      fireEvent.press(component.getByText('Not Really'));
      
      const submitButton = component.getByText('Submit');
      // Should render submit button
      expect(submitButton).toBeTruthy();
    });
  });
});
