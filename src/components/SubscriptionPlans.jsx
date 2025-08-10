import React from "react";

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

            <div key={index} className='rounded-xl shadow-lg p-6 border bg-white transition-all '>
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <p className="mt-4 text-4xl font-bold text-green-800">₹{plan.price}
                <span className="text-xl font-bold text-green-800">/{plan.period}</span>
              </p>
              <ul className="mt-6 space-y-3 text-gray-600">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <h1 className="text-green-600">{plan.trail}</h1>
              <button className='mt-6 py-2 rounded-lg font-medium bg-green-800 w-24'>Subscribe</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
