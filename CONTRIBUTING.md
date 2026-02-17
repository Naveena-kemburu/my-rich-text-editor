# Contributing to Rich Text Editor

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/my-rich-text-editor.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Run tests: `npm test`
6. Commit your changes: `git commit -m 'Add some feature'`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Submit a pull request

## Development Workflow

### Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Style

- Use functional components with hooks
- Follow ESLint rules (if configured)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### Component Guidelines

1. **Props**: Always define prop types or use TypeScript
2. **Hooks**: Follow Rules of Hooks
3. **Memoization**: Use React.memo, useCallback, useMemo appropriately
4. **Accessibility**: Always include ARIA attributes
5. **Testing**: Write tests for new features

### Testing Guidelines

- Write tests for all new features
- Maintain or improve code coverage
- Use React Testing Library best practices
- Test user interactions, not implementation details
- Include accessibility tests

### Commit Messages

Follow conventional commits format:

```
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update dependencies
```

## Pull Request Process

1. Update README.md with details of changes if needed
2. Update tests to reflect changes
3. Ensure all tests pass
4. Update documentation
5. Request review from maintainers

## Reporting Bugs

When reporting bugs, please include:

- Browser and version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Error messages

## Suggesting Features

When suggesting features, please include:

- Clear description of the feature
- Use cases
- Potential implementation approach
- Any relevant examples

## Questions?

Feel free to open an issue for any questions or concerns.

Thank you for contributing!
