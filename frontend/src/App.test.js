import React from "react"; // Importă React pentru JSX
import { render } from "@testing-library/react"; // Importă funcția de testare
import App from "./App"; // Importă componenta pe care o testezi

test("renders learn react link", () => {
  const { getByText } = render(<App />);
  expect(getByText(/learn react/i)).toBeInTheDocument();
});

import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
