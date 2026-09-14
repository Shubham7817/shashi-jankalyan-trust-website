import agriculture from "../assets/image/agriculture/soil-testing-lab.avif";
import awareness from "../assets/image/awareness program/community-temple-01.avif"
import kanyavivah from "../assets/image/kanya-vivah indoor/kanya-vivah-indoor.avif"
import womenskill from "../assets/image/women-skill-empowerment/img1.jpg"
import education from "../assets/image/education/education.jpg"
import healthcare from "../assets/image/healthcare/healthcare.jpg"
import livelihood from "../assets/image/livelihood/livelihood.jpg"

import {
  GraduationCap,
  HeartPulse,
  Users,
  BriefcaseBusiness,
  Trees,
  Ribbon,
} from "lucide-react";
export const focusAreas = [
  {
    title: "Education",
    Icon: GraduationCap,
    description: "Learning opportunities for underserved children.",
    points: ["Learning programs", "Scholarships", "Resources"],
    image: education,
    path: "/our-work/education",
  },
  {
    title: "Healthcare",
    Icon: HeartPulse,
    description: "Awareness and basic healthcare support.",
    points: ["Medical camps", "Awareness", "Basic support"],
    image: healthcare,
    path: "/our-work/healthcare",
  },
    {
    title: "Kanya Vivah Support",
    Icon: Ribbon,
    description: "Kanya Vivah support initiatives.",
    points: ["women", "Benefits", "Eligibility"],
    image:kanyavivah,
    path: "/our-work/kanya-vivah",
  },
  {
    title: "Women Empowerment",
    Icon: Users,
    description: "Skills and financial independence.",
    points: ["Skills", "Employment", "Independence"],
    image:womenskill,
    path: "/our-work/women-skills",
  },
  {
    title: "Livelihood",
    Icon: BriefcaseBusiness,
    description: "Sustainable income opportunities.",
    points: ["Training", "Enterprise", "Income"],
    image: livelihood,
    path: "/our-work/livelihood",
  },
  {
    title: "Awareness",
    Icon: Ribbon,
    description: "Community awareness initiatives.",
    points: ["locality", "Awareness", "Action"],
    image:awareness,
    path: "/our-work/awareness",
  },
    {
    title: "Environment",
    Icon: Trees,
    description: "Sustainable community initiatives.",
    points: ["Trees", "Awareness", "Action"],
    image:agriculture,
    path: "/our-work/environment",
  },
];
