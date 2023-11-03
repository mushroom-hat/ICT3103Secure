import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; // Import userEvent to simulate user interactions
import { act } from "react-dom/test-utils"; // Import act from react-dom/test-utils
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../app/store";
import App from "../App";

test("Renders the App component", () => {
  act(() => { // Wrap the rendering code in act
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );
  });
});

test("Renders the Login route without user interaction", async () => {
  act(() => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/login"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
  });

  await waitFor(() => {
    const loginElement = screen.getByText("Employee Login");
    expect(loginElement).toBeInTheDocument();
  });
});

test("Renders the Organizations route without user interaction", async () => {
  act(() => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/organizations"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
  });

  await waitFor(() => {
    const organizationsElement = screen.getByText("Organizations", {
      selector: "h1",
    });
    expect(organizationsElement).toBeInTheDocument();
  });
});

test("Route is rendered when user clicks Organizations in navbar", () => {
  act(() => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/organizations"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
  });

  act(() => {
    const organizationsLink = screen.getByTestId("organizations-link");
    userEvent.click(organizationsLink);
  });

  const organizationsElement = screen.getByText("Organizations", {
    selector: "h1",
  });
  expect(organizationsElement).toBeInTheDocument();
});