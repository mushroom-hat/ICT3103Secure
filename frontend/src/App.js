import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import UsersList from "./features/users/UsersList";
import OrganizationsList from "./features/organizations/OrganizationsList";
import UserProfile from "./features/users/UserProfile";
import CashflowAnalysis from "./features/cashflow/CashFlowAnalysis";
import NewUserForm from "./features/users/NewUserForm";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import SpendingsList from "./features/spendings/SpendingsList";
import NewSpendingForm from "./features/spendings/NewSpendingForm";
import NewDonationForm from "./features/donations/NewDonationForm";
import AddCardForm from "./features/cards/AddCardForm";

import ActivationLandingPage from "./features/auth/ActivationLandingPage";
import EmailVerification from "./features/auth/EmailVerification";
import SendEmailVerification from "./features/auth/SendEmailVerification";
import WriteArticle from "./features/articles/WriteArticle";
import LoginVerification from "./features/auth/LoginVerification";
import LoginErrorPage from "./features/auth/LoginError";

import { ROLES } from "./config/roles";

import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import CardsList from "./features/cards/CardsList";
import Article from "./features/articles/Article";
import Organization from "./features/organizations/Organization";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="login-error" element={<LoginErrorPage />} />
        <Route path="/verify-login" element={<LoginVerification />} />
        <Route path="organizations">
          <Route index element={<OrganizationsList />} />
          <Route path=":id" element={<Organization />} />
        </Route>
        <Route path="signup" element={<Signup />} />
        <Route path="/landing-page" element={<ActivationLandingPage />} />
        <Route path="emailverification" element={<EmailVerification />} />
        <Route
          path="sendemailverification"
          element={<SendEmailVerification />}
        />
        <Route element={<PersistLogin />}>
          <Route path="article">
            <Route path=":id" element={<Article />} />
          </Route>
          <Route
            element={
              <RequireAuth
                allowedRoles={[ROLES.Donator, ROLES.Admin, ROLES.Organization]}
              />
            }
          >
            <Route path="dash" element={<DashLayout />}>
              <Route index element={<Welcome />} />
              <Route path="profile" element={<UserProfile />} />
              <Route element={<RequireAuth allowedRoles={[ROLES.Organization]} />}>
                <Route path="spending">
                  <Route path="new" element={<NewSpendingForm />} />
                </Route>
                <Route path="articles">
                  <Route path="new" element={<WriteArticle />} />
                </Route>
                <Route path="donations">
                  <Route path="cashflowAnalysis" element={<CashflowAnalysis />} />
                </Route>
              </Route>
              <Route element={<RequireAuth allowedRoles={[ROLES.Donator]} />}>
                <Route path="cards">
                  <Route index element={<CardsList />} />
                  <Route path="new" element={<AddCardForm />} />
                </Route>
                <Route path="donations">
                  <Route path="new" element={<NewDonationForm />} />
                </Route>
                <Route path="spending">
                  <Route index element={<SpendingsList />} />
                </Route>
              </Route>
              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                <Route path="users">
                  <Route index element={<UsersList />} />
                  <Route path="new" element={<NewUserForm />} />
                </Route>
              </Route>
            </Route>
            {/* End Dash */}
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
