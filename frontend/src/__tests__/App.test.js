import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../app/store";
import App from "../App";

test("Renders the App component", () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>
  );
});

test("Renders the Login route", () => {
  const { getByText } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    </Provider>
  );

  expect(getByText("Employee Login")).toBeInTheDocument();
});

test("Renders the Organizations route", async () => {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/organizations"]}>
        <App />
      </MemoryRouter>
    </Provider>
  );

  const organizationsElement = screen.getByText("Organizations", {
    selector: "h1",
  });
  expect(organizationsElement).toBeInTheDocument();
});
