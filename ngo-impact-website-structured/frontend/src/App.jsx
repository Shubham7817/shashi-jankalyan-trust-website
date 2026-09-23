import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import OurWork from "./pages/OurWork";
import Projects from "./pages/Projects";
import Impact from "./pages/Impact";
import Gallery from "./pages/Gallery";
import GetInvolved from "./pages/GetInvolved";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import News from "./pages/News";
import NotFound from "./pages/NotFound";
import DonationSuccess from "./pages/DonationSuccess";
import DonationFailed from "./pages/DonationFailed";  
import Education from "./pages/education";
import HealthCare from "./pages/HealthCare";
import KanyaVivah from "./pages/KanyaVivah";
import Livelihood from "./pages/Livelihood";
import Awareness from "./pages/Awareness";
import Environment from "./pages/Environment";
import WomenSkill from "./pages/WomenSkill";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PrivacyPolicy from "./components/legal/PrivacyPolicy";
import RefundPolicy from "./components/legal/RefundPolicy";
import TermsConditions from "./components/legal/TermsConditions";
import SubscriptionTerms from "./components/legal/SubscriptionTerms";
import ReferralTerms from "./components/legal/ReferralTerms";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/our-work" element={<OurWork />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/get-involved" element={<GetInvolved />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/news" element={<News />} />
        <Route path="/admin" element={<AdminDashboard />} /> 
        <Route path="/our-work/women-skills" element={<WomenSkill />} />
        <Route path="/our-work/education" element={<Education />} />
        <Route path="/our-work/healthcare" element={<HealthCare />} />
        <Route path="/our-work/kanya-vivah" element={<KanyaVivah />} />
        <Route path="/our-work/livelihood" element={<Livelihood />} />
        <Route path="/our-work/awareness" element={<Awareness />} />
        <Route path="/our-work/environment" element={<Environment />} />
        <Route path="/donation-success" element={<DonationSuccess />} />
        <Route path="/donation-failed" element={<DonationFailed />} />
        <Route path="*" element={<NotFound />} />

        {/* Razorpay Compliance Routes */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/subscription-terms" element={<SubscriptionTerms />} />
        <Route path="/referral-terms" element={<ReferralTerms />} />
        
      </Route>
    </Routes>
  );
}
