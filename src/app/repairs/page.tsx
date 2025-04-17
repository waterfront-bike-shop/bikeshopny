import { FC } from "react";
import Hero from "../components/Hero";

const RepairPage: FC = () => {
  return (
    <>
      <Hero
        headline="Repairs, Tune-ups and Bike Cleanings"
        image="/images/christian_bike_mechanic.jpg"
      />
      <section className="py-10">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">
            On the Spot Repairs and Tune-ups
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">Tune-up - $125</h3>
              <ul className="list-disc pl-5">
                <li>Wheel set truing</li>
                <li>Hub adjustments</li>
                <li>Brake adjustments</li>
                <li>Headset, BB adjustments</li>
                <li>Derailleur adjustments</li>
                <li>Brakes</li>
              </ul>
              <p className="text-sm text-gray-500">* Parts not included</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Cleaning - $75</h3>
              <p>
                Comprehensive detailed cleaning of the drivetrain and entire
                bike.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RepairPage;
