import React from "react";

export default function TrustedPatners() {
  const Patners = [
    {
      name: "MIT",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg",
    },
    {
        name: "Google",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      },
      {
        name: "Microsoft",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      },
      {
        name: "Amazon",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      },
      {
        name: "Tesla",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
      },
      {
        name: "Spotify",
        logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
      },
      
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900">
          Trusted by Top Universities Worldwide
        </h2>

        {/* Patners Logos */}
        <div className="mt-10 flex justify-center items-center gap-12">
          {Patners.map((Patner, index) => (
            <img
              key={index}
              src={Patner.logo}
              className="max-h-16 p-1"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
