import '@fortawesome/fontawesome-free/css/all.min.css';
import React, {useEffect} from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup'; // Added Signup import
import ClientProfile from './components/Clients/ ClientProfile';
import ClientForm from './components/Clients/ClientForm';
import ClientsList from './components/Clients/ClientsList';
import Contact from './components/Contact';
import ContractorForm from './components/Contractors/ContractorForm';
import ContractorProfile from './components/Contractors/ContractorProfile';
import ContractorsList from './components/Contractors/ContractrorsList.js';
import Dashboard from './components/Dashboard/Dashboard'; // Added Dashboard import
import Home from './components/Home';
import Layout from './components/Layout';
import ServiceRequest from './components/ServiceRequest/ServiceRequest.js';
import UserProfile from './components/UserProfile';
import FindCont from './components/FindCont/FindCont.js';
import Quiz from './components/FindCont/Quiz.js';
import Browse from './components/FindCont/BrowseContractors.js';
import Inbox from './components/chat/Inbox.js';
import Conversation from './components/chat/Conversation.js';
import CreateConversation from './components/chat/CreateConversation.js';
import ContractPage from './components/Docusign/ContractPage.js';
import PaymentPage from './components/Payment/PaymentPage.js';
import CreateContract from './components/Contracts/CreateContract';
import Chat from './components/chat/Inbox2.js';
import Chat1 from './components/chat/Inbox3.js';
import TutorialList from './components/Tutorials/Tutorials.js';
import UploadTutorial from './components/Tutorials/UploadTutorials.js';
import BlogList from './components/Blogs/BlogList';
import BlogDetail from './components/Blogs/BlogDetail';
import UploadBlog from './components/Blogs/UploadBlog.js';
import VideoPlayer from './components/Tutorials/VideoPlayer.js';
import AboutUs from './components/AboutUs/AboutUs.js';
import LocationAutocomplete from './components/APIStuff/AutoComplete.js';
import ForgotPassword from './components/Auth/ForgotPassword.js';
import ResetPassword from './components/Auth/ResetPassword.js';
import axios from 'axios';
import EditProfilePage from './components/EditProfile.js';
import GoogleLoginButton from './components/Auth/GoogleLogin.js';
function useCsrfToken() {
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/csrf_token/`, {
              withCredentials: true,  // Ensure cookies are set
          });
  
          const csrfToken = response.data.csrfToken;
          document.cookie = `csrftoken=${csrfToken}; path=/; Secure; SameSite=None`;
  
          console.log("CSRF Token stored in cookies:", csrfToken);
          return csrfToken;
      } catch (error) {
          console.error("Error fetching CSRF Token:", error);
          return null;
      }
  };

      fetchCsrfToken();
  }, []);
}



function App() {
  useCsrfToken();

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>

            <Route index element={<Home />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:uid/:token/" element={<ResetPassword />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />


            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />


            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />


            <Route path="/ServiceRequest" element={<ServiceRequest />} />
            <Route path="/find-contractor" element={<FindCont />} />
            <Route path="/Quiz" element={<Quiz />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/conversation/:conversationId" element={<Conversation />} />
            <Route path="/start-conversation" element={<CreateConversation contractors={[]} />} />
            <Route path="/contracts" element={<ContractPage />} />
            <Route path="/payment" element={<PaymentPage />} />

            <Route path="/AboutUs" element={<AboutUs />} />

            <Route path="/upload" element={<UploadTutorial />} />
            <Route path="/tutorials" element={<TutorialList />} />
            <Route path="/video-player" element={<VideoPlayer />} />


            <Route path="/Inbox2" element={<Chat />} />
            <Route path="/Inbox3" element={<Chat1 />} />

           
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:pk" element={<BlogDetail />} />
            <Route path="/upload-blog" element={<UploadBlog />} />

            
            
            {/* Client-related routes */}
            <Route path="clients" element={<ClientsList />} />
            <Route path="clients/:id" element={<ClientProfile />} />
            <Route path="clients/edit/:id" element={<ClientForm />} />
            <Route path="clients/add" element={<ClientForm />} />
            {/* Contractor-related routes */}
            <Route path="contractors" element={<ContractorsList />} />
            <Route path="/contractor/:id" element={<ContractorProfile />} />
            <Route path="/contractors/edit/:id" element={<ContractorForm />} />
            <Route path="contractors/add" element={<ContractorForm />} />
            <Route path="Browse-Contractors" element={<Browse />} />


            <Route path="/AutoComplete" element={<LocationAutocomplete />} />  
            <Route path="/googlelogin" element={<GoogleLoginButton />} />

          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;