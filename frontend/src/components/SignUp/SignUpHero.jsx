import { Link } from "react-router-dom";
import { UserPlus, Briefcase, Building2 } from "lucide-react";

const SignUpHero = () => {
  const features = [
    {
      icon: <UserPlus className="h-5 w-5" />,
      title: "Create your profile",
      description: "Showcase your skills and experience",
    },
    {
      icon: <Briefcase className="h-5 w-5" />,
      title: "Find opportunities",
      description: "Browse thousands of job listings",
    },
    {
      icon: <Building2 className="h-5 w-5" />,
      title: "Connect with companies",
      description: "Build your professional network",
    },
  ];

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <h2 className="text-3xl font-bold mb-6">Join Our Professional Network</h2>
        <p className="mb-8 text-blue-100">
          Create your account and connect with employers or find talented professionals.
        </p>

        <div className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <div className="rounded-full bg-white/20 p-2 mr-3">{feature.icon}</div>
              <div>
                <p className="font-medium">{feature.title}</p>
                <p className="text-sm text-blue-100">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <p className="text-sm text-blue-100">Already have an account?</p>
        <Link to="/login" className="block mt-2 text-white font-medium hover:underline">
          Sign in →
        </Link>
      </div>
    </div>
  );
};

export default SignUpHero;
