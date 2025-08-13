import React from "react";
import CardDesign from "./CradDesign";

export default function SubscriptionPlans() {
  const plans = [
    {
      name: "Basic",
      price: 499,
      period: "Month",
      trail: (
        <>
          7 Days Free Trial <br /> 15 Days Money Back Guarantee
        </>
      ),
      features: ["Access to 5 Courses", "Community Support",],
    },
    {
      name: "Standard",
      price: 999,
      period: "Month",
      trail: (
        <>
          7 Days Free Trial <br /> 15 Days Money Back Guarantee
        </>
      ),
      features: ["Unlimited Courses", "Certificate of Completion",],
    },
    {
      name: "Platinum",
      price: 1499,
      period: "Month",
      trail: (
        <>
          7 Days Free Trial <br /> 15 Days Money Back Guarantee
        </>
      ),
      features: ["Everything in Standard", "1-on-1 Mentorship", "Career Support & Job Assistance"],
    },
    
  ];

  return (
    <section className="bg-gray-200 py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-900">
          Choose Your Subscription Plan
        </h2>
        <p className="mt-2 text-gray-600">
          Pick the plan that's right for you and start learning today.
        </p>

        {/* Cards */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div key={index}>
              <CardDesign variant="subscribe" width="w-[300px]" height="h-96" title={plan.price + '/' + plan.period} subsTitle={plan.name} description={plan.features.map((feature, i) => (<li key={i}>{feature}</li>))} btnName="Subscribe"/>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
