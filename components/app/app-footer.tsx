import { Copyright } from 'lucide-react';
import { GithubButton } from '../githubButton';

export default function AppFooter() {
  return (

    <footer className="flex justify-center items-center gap-1 mt-10 select-none">
      <Copyright size={10} />
      <span>archie0732 manga</span>
      <GithubButton />
    </footer>
  );
}
