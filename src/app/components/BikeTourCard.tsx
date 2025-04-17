import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BikeTourCard() {
  return (
    <Card className="max-w-4xl mx-auto my-10 shadow-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-bold">
          5 Boro Bike Tour by Bike New York | Rentals - 2025
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-gray-700 text-base">
        <p>
          <strong>$99</strong> per bike for Sat May 03, and Sun May 04 – <strong>two day minimum</strong>
        </p>
        <p>Pick up on <strong>Saturday, May 3</strong> between <strong>10 am - 6:45 pm</strong></p>
        <p>Return on <strong>Sunday, May 4</strong> by <strong>6:45 pm</strong></p>
        <p>
          Book online below, or text us at <a href="sms:2124142453" className="text-blue-600 underline">212 414 2453</a> or email us at{" "}
          <a href="mailto:waterfrontbikeshop@gmail.com" className="text-blue-600 underline">waterfrontbikeshop@gmail.com</a>
        </p>
        <p>
          <strong>10 road bikes</strong> are available for <strong>$200</strong> for the weekend.
        </p>
      </CardContent>
    </Card>
  );
}
