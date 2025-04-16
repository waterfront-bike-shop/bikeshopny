import { FC } from "react";
import Hero from "../components/Hero";

const AboutPage: FC = () => {
  return (
    <>
      <Hero
        headline="About"
        image="/images/temp-inside-bike-shop.jpg"
      />
      <section className="py-10">
        <div className="max-w-screen-xl mx-auto px-6">
          <h1 className="text-2xl mb-2 font-bold">About Waterfront Bike Shop</h1>
          <p>
            Lorem ipsum dolor sit amet, per ad atqui consul scripta. Et vim ullum scribentur. Mel ad erant neglegentur. Ad duo fuisset intellegam, has id hinc reprimique adversarium. Vis ei altera antiopam, eu mei essent salutatus, duo no quot natum intellegat.
          </p>
          <p className="mt-4">
            An inermis voluptaria vel. Vel minim nonumy ex, ludus quando mnesarchum ex vis. Has an vero facete, at pro placerat oporteat detraxit, dicat ignota accusamus in vis. Pri ut elit prompta habemus. Est ex cibo intellegebat, in tritani menandri definiebas mei. Vim eruditi consequuntur eu, cu elit delectus quo, molestie adipiscing quo eu. Mea no vidit soleat option, te has viris corrumpit, autem homero insolens usu no.
          </p>
        </div>
      </section>
    </>
  );
};

export default AboutPage; 
