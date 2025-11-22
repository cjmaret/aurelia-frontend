# Aurelia Frontend Tests

This directory contains the test suite for the Aurelia Frontend application.

## Structure

```
__tests__/
├── setup.js                    # Jest configuration and global mocks
└── components/
    └── ReviewPrompt.test.tsx   # Tests for ReviewPrompt component
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests without watch mode
```bash
npm test -- --no-watch
```

### Run a specific test file
```bash
npx jest __tests__/components/ReviewPrompt.test.tsx
```

### Run tests with coverage
```bash
npx jest --coverage --watchAll=false
```

Or use npm script:
```bash
npm test -- --coverage --watchAll=false
```

## Test Setup

The test environment is configured with:
- **Jest**: Testing framework (configured via `jest-expo` preset)
- **@testing-library/react-native**: React Native testing utilities
- **Mocked dependencies**: 
  - `expo-store-review`
  - `react-native-modal`
  - `Alert` from React Native

## Writing New Tests

### Component Tests

1. Create a new test file in `__tests__/components/`
2. Import the component and testing utilities:
   ```typescript
   import React from 'react';
   import { render, fireEvent } from '@testing-library/react-native';
   import YourComponent from '../../components/your-component/YourComponent';
   ```

3. Write your test suites using `describe` and `it`:
   ```typescript
   describe('YourComponent', () => {
     it('should render correctly', () => {
       const { getByText } = render(<YourComponent />);
       expect(getByText('Expected Text')).toBeTruthy();
     });
   });
   ```

### Available Testing Utilities

- **render**: Render a component for testing
- **fireEvent**: Trigger events (press, changeText, etc.)
- **waitFor**: Wait for async operations
- **screen**: Query rendered components
- **cleanup**: Clean up after tests (automatic with setupFilesAfterEnv)

## ReviewPrompt Tests Coverage

The `ReviewPrompt.test.tsx` file includes comprehensive tests for:

✅ Initial prompt rendering and visibility  
✅ Positive response flow (store review)  
✅ Negative response flow (feedback form)  
✅ Feedback form validation (empty input, character limit)  
✅ User interactions (button presses, text input)  
✅ Modal state management  
✅ Theme integration  
✅ Async operations (store review API)  

## Dependencies

Testing dependencies are installed as devDependencies:
```json
{
  "@testing-library/react-native": "^13.3.3",
  "@types/jest": "^30.0.0",
  "jest": "^29.7.0",
  "jest-expo": "^53.0.9"
}
```

## CI/CD Integration

To run tests in CI/CD pipelines:
```bash
npm test -- --ci --coverage --maxWorkers=2
```

## Troubleshooting

### Tests timing out
If tests timeout, increase the timeout value:
```typescript
jest.setTimeout(10000); // 10 seconds
```

### Module not found errors
Ensure `transformIgnorePatterns` in `package.json` includes the necessary packages.

### Mock not working
Check that mocks are defined in `__tests__/setup.js` or at the top of your test file before imports.
