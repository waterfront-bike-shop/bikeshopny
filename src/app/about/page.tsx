import { FC } from "react";
import Hero from "../components/Hero";

const AboutPage: FC = () => {
  return (
    <>
      <Hero headline="About" image="/images/hudson_river_aerial_view.jpg" />
      <section className="py-10">
        <div className="max-w-screen-xl mx-auto px-6">
          <h1 className="text-2xl mb-2 font-bold">
            About Waterfront Bike Shop
          </h1>
          <p>
            We offer recreational bikes and road bikes for rent on the 13-mile Hudson River / Manhattan Waterfront. 
            This is the beginning of the 750-mile Empire State Trial to upstate NY as well as the road bike route that goes through NYC and over the George Washington Bridge to New Jersey. 
            We also offer repairs and 1000s of parts and accessories.
          </p>
          <p className="mt-4">
            Open since 2009 in New York City&apos;s West Village.
          </p>

          <h1 className="text-2xl mb-2 mt-4 font-bold">Hours</h1>
          <p>Monday - Sunday 10:00 am - 7:00 pm</p>

          {/* Map Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Find Us</h2>
            <div className="w-full h-[400px]">
              <iframe
                title="Waterfront Bicycle Shop Location"
                src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d3023.3264615567296!2d-74.0100118!3d40.73284149999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e3!4m0!4m5!1s0x89c259ec5cd405db%3A0xf620bd097728daeb!2sWaterfront%20Bicycle%20Shop%2C%20391%20West%20St%2C%20New%20York%2C%20NY%2010014!3m2!1d40.732842399999996!2d-74.0100231!5e0!3m2!1sen!2sus!4v1745265025582!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;