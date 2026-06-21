import About from './About';
import Branches from './Branches';
import Products from './Products';
import Intro from './Intro';
import Contact from './Contact';

export default function Home() {
  return (
    <div id="home-page-container" className="relative">
      <About isSinglePage={true} />
      <Branches isSinglePage={true} />
      <Products isSinglePage={true} />
      <Intro isSinglePage={true} />
      <Contact isSinglePage={true} />
    </div>
  );
}
