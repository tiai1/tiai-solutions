import { Link } from 'wouter';
import { Github, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import logoHorizontal from '@assets/Logo_maker_project-7-removebg-preview_1756569129936.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <img 
              src={logoHorizontal} 
              alt="TIAI Solutions" 
              className="h-10 sm:h-12 w-auto mb-4 transition-all duration-200 hover:opacity-80 hover:scale-105" 
              data-testid="footer-logo"
            />
            <p className="text-background/70 mb-6 max-w-md" data-testid="footer-description">
              Automation-first consulting that turns your numbers into momentum. 
              From data chaos to decision clarity.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://linkedin.com/company/tiai-solutions" 
                className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="LinkedIn"
                data-testid="social-linkedin"
              >
                <Linkedin className="h-5 w-5 text-background/70" />
              </a>
              <a 
                href="https://twitter.com/tiai_solutions" 
                className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="Twitter"
                data-testid="social-twitter"
              >
                <Twitter className="h-5 w-5 text-background/70" />
              </a>
              <a 
                href="https://github.com/tiai-solutions" 
                className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="GitHub"
                data-testid="social-github"
              >
                <Github className="h-5 w-5 text-background/70" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" data-testid="footer-link-home">
                  <span className="text-background/70 hover:text-background transition-colors">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/services" data-testid="footer-link-services">
                  <span className="text-background/70 hover:text-background transition-colors">Services</span>
                </Link>
              </li>
              <li>
                <Link href="/case-studies" data-testid="footer-link-case-studies">
                  <span className="text-background/70 hover:text-background transition-colors">Case Studies</span>
                </Link>
              </li>
              <li>
                <Link href="/tools" data-testid="footer-link-tools">
                  <span className="text-background/70 hover:text-background transition-colors">Tools</span>
                </Link>
              </li>
              <li>
                <Link href="/about" data-testid="footer-link-about">
                  <span className="text-background/70 hover:text-background transition-colors">About</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" data-testid="footer-link-contact">
                  <span className="text-background/70 hover:text-background transition-colors">Contact</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-background/70">
                <Mail className="h-4 w-4 mr-3" />
                <a href="mailto:hello@tiai-solutions.com" data-testid="footer-email">
                  hello@tiai-solutions.com
                </a>
              </li>
              <li className="flex items-center text-background/70">
                <Phone className="h-4 w-4 mr-3" />
                <span data-testid="footer-phone">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start text-background/70">
                <MapPin className="h-4 w-4 mr-3 mt-1" />
                <span data-testid="footer-location">San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-background/70 text-sm" data-testid="footer-copyright">
            © {currentYear} TIAI Solutions. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="/privacy" 
              className="text-background/70 hover:text-background text-sm transition-colors"
              data-testid="footer-privacy"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms" 
              className="text-background/70 hover:text-background text-sm transition-colors"
              data-testid="footer-terms"
            >
              Terms of Service
            </a>
            <a 
              href="/cookies" 
              className="text-background/70 hover:text-background text-sm transition-colors"
              data-testid="footer-cookies"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
