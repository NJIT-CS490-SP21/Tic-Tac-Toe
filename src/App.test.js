
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom'
import PlayerBoard from './components/PlayerBoard'
test('Log in button disappears', () => {
  render(<App />);
  const logInBtnElement = screen.getByText("Log In");
  expect(logInBtnElement).toBeInTheDocument();
  
  fireEvent.click(logInBtnElement);
  expect(logInBtnElement).not.toBeInTheDocument();
});

test('Player board appears', () => {
  const playerBoardContainer = render(<PlayerBoard/>);
  render(<App />);
  const playerBoardBtnElement = screen.getByText("player board!", { exact: false });
  expect(playerBoardBtnElement).toBeInTheDocument();
  
  fireEvent.click(playerBoardBtnElement);
  const playerBoardElement = screen.getByText("Current user is highlighted");

  expect(playerBoardElement).toBeInTheDocument();
});

test('Populate box when clicking', () => {
  render(<App />);
  const boxElement = screen.getByRole("button");
  expect(boxElement).toBeInTheDocument();
  
  fireEvent.click(boxElement);
  expect(boxElement).not.toEqual("");
});


