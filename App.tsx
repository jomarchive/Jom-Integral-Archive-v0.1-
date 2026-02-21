import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Archive from './pages/Archive';
import About from './pages/About';
import Today from './pages/Today';
import Top10 from './pages/Top10';
import IntegralDetail from './pages/IntegralDetail';

const App: React.FC = () => {
  return (
    <DataProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-white">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/today" element={<Today />} />
              <Route path="/top10" element={<Top10 />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/about" element={<About />} />
              <Route path="/integral/:id" element={<IntegralDetail />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </DataProvider>
  );
};

export default App;