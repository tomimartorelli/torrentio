import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import Footer from './components/Footer/Footer';
import Home from './views/Home/Home';
import GameList from './views/GameList/GameList';
import Developers from './views/Developers/Developers';
import DeveloperDetails from './views/DeveloperDetails/DeveloperDetails';
import GameDetails from './views/GameDetails/GameDetails';
import GameCategories from './views/Categories/GameCategories'; 
import Admin from './views/Admin/Admin';
import AbmDevelopers from './views/AbmDevelopers/AbmDevelopers';
import Login from './views/Login/Login';
import Register from './views/Register/Register';
import Profile from './views/Profile/Profile';
import { GameProvider } from './context/GameContext';
import { DeveloperProvider } from './context/DeveloperContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized';
import SearchResults from './views/SearchResults/SearchResults';
import Contact from './views/Contact/Contact';
import ScrollToTop from './components/ScrollToTop';
import { useScrollOptimization } from './hooks/useScrollOptimization';

function App() {
  // Aplicar optimizaciones de scroll
  useScrollOptimization();

  return (
    <AuthProvider> {/* Envuelve la aplicación con AuthProvider */}
      <NotificationProvider>
        <ThemeProvider>
          <GameProvider> 
            <DeveloperProvider>
            <div className="min-h-screen flex flex-col bg-primary">
              <ScrollToTop />
              <Header />
              <main className="flex-grow">
                <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gameList" element={<GameList />} />
            <Route path="/gameList/gameDetails/:id" element={<GameDetails />} />
            <Route path="/categories" element={<GameCategories />} />
            <Route path="/categories/:genre" element={<GameCategories />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/developers/developerDetails/:id" element={<DeveloperDetails />} />
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/admin/developers" element={
              <ProtectedRoute>
                <AbmDevelopers />
              </ProtectedRoute>
            } />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchResults />} />
                </Routes>
              </main>
              <Footer />
            </div>
            </DeveloperProvider>
          </GameProvider>
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
