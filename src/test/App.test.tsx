import React from 'react';
import { render, screen } from '@testing-library/react';
import { GameArea } from '../lib/GameArea';
import App from '../components/App';
import reportWebVitals from '../reportWebVitals';

test('renders learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});

const ga = new GameArea(1000, 1000);
