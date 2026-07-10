import { Leaf } from 'lucide-react';

/**
 * Simple footer with copyright and branding.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-secondary-200 bg-white px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-secondary-500">
        <div className="flex items-center gap-1.5">
          <Leaf className="h-4 w-4 text-primary-500" />
          <span>
            &copy; {currentYear}{' '}
            <span className="font-semibold text-secondary-700">EcoTrack</span>. All rights
            reserved.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-secondary-700 cursor-pointer transition-colors">
            Privacy Policy
          </span>
          <span className="hover:text-secondary-700 cursor-pointer transition-colors">
            Terms of Service
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
