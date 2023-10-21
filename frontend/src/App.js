import { Routes, Route } from 'react-router-dom' 
import Layout from './components/Layout' 
import Public from './components/Public' 
import Login from './features/auth/Login'; 
import DashLayout from './components/DashLayout' 
import Welcome from './features/auth/Welcome' 
import UsersList from './features/users/UsersList' 
import ViewOrganizations from './features/viewOrganizations/ViewOrganizations';
import UserProfile from './features/users/UserProfile';
import WriteArticle from './features/articles/WriteArticle';
import CashflowAnalysis from './features/cashflow/CashFlowAnalysis';
import NewUserForm from './features/users/NewUserForm'
import EditUser from './features/users/EditUser'
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import Spending from './features/spendings/Spending';
import SpendingsList from './features/spendings/SpendingsList';
import NewSpendingForm from './features/spendings/NewSpendingForm';

import { ROLES } from './config/roles'

function App() { 
  return ( 
    <Routes> 
      <Route path="/" element={<Layout />}> 
        <Route index element={<Public />} /> 
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="viewOrganizations" element={<ViewOrganizations />} /> 
        <Route path="writeArticle" element={<WriteArticle />} />
        <Route path="cashflowAnalysis" element={<CashflowAnalysis />} />
        
        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            <Route path="dash" element={<DashLayout />}>
              <Route index element={<Welcome />} />
              <Route path="spending">
                  <Route index element={<SpendingsList />} />
                  <Route path="new" element={<NewSpendingForm />} />
                  {/*<Route path=":id" element={<EditUser />} />
                  <Route path="new" element={<NewUserForm />} />*/}
              </Route>  
              <Route element = {<RequireAuth allowedRoles={ROLES.Admin} />}>
                <Route path="users">
                  <Route index element={<UsersList />} />
                  <Route path=":id" element={<EditUser />} />
                  <Route path="new" element={<NewUserForm />} />
                </Route>
              </Route>

            </Route>{/* End Dash */}
          </Route>
        </Route>
 
      </Route> 
    </Routes> 
  ); 
} 
 
export default App;
