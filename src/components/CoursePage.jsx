import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// AgricultureCoursesFrontpage.jsx
// Single-file React component for an Agriculture course landing/front page.
// Tailwind CSS classes assumed. Framer Motion used for subtle animations.

export default function AgricultureCoursesFrontpage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all | free | paid
  const [selected, setSelected] = useState(null);

  const courses = [
    {
      id: 1,
      title: 'Intro to Sustainable Farming',
      desc: 'Basic principles of sustainable farming & soil health.',
      price: 0,
      tag: 'Free',
      duration: '4 weeks',
      image: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=1200&q=60'
    },
    {
      id: 2,
      title: 'Precision Agriculture with Drones',
      desc: 'Using drones and sensors to optimise yields.',
      price: 199,
      tag: 'Paid',
      duration: '6 weeks',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=60'
    },
    {
      id: 3,
      title: 'Organic Pest Management',
      desc: 'IPM methods and organic solutions for pests.',
      price: 49,
      tag: 'Paid',
      duration: '3 weeks',
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=60'
    },
    {
      id: 4,
      title: 'Crop Rotation & Land Use',
      desc: 'Plan rotations that keep soil fertile and productive.',
      price: 0,
      tag: 'Free',
      duration: '2 weeks',
      image: 'https://th.bing.com/th/id/OIP.YZH2P2ha-9rsjizCCgju5gHaEc?w=241&h=180&c=7&r=0&o=5&pid=1.7'
    }
  ];

  const filtered = courses.filter(c => {
    if (filter === 'free') return c.price === 0;
    if (filter === 'paid') return c.price > 0;
    return true;
  }).filter(c => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      {/* Hero */}
      <header className="max-w-6xl mx-auto mb-6">
        <div className="relative overflow-hidden rounded-2xl bg-[#eefaf0] p-6 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl md:text-4xl font-extrabold text-green-900">Agriculture Courses — Grow your skills</h1>
            <p className="mt-3 text-green-700/90">Practical, hands-on courses for modern farmers and agri-entrepreneurs. Free & paid options available.</p>

            <div className="mt-4 flex gap-3 flex-wrap">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search courses (e.g. soil, drone, organic)"
                className="px-3 py-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-300"
              />

              <div className="flex gap-2">
                <button onClick={() => setFilter('all')} className={`px-3 py-2 rounded-lg ${filter==='all' ? 'bg-green-600 text-white' : 'bg-white border'} shadow-sm`}>All</button>
                <button onClick={() => setFilter('free')} className={`px-3 py-2 rounded-lg ${filter==='free' ? 'bg-green-600 text-white' : 'bg-white border'} shadow-sm`}>Free</button>
                <button onClick={() => setFilter('paid')} className={`px-3 py-2 rounded-lg ${filter==='paid' ? 'bg-green-600 text-white' : 'bg-white border'} shadow-sm`}>Paid</button>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="text-sm">Featured:</div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-white text-green-800 shadow">Soil Health</span>
                <span className="px-3 py-1 rounded-full bg-white text-green-800 shadow">Drones</span>
                <span className="px-3 py-1 rounded-full bg-white text-green-800 shadow">Organic</span>
              </div>
            </div>
          </motion.div>

          {/* <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="hidden md:block">
            <div className="relative h-56 rounded-lg overflow-hidden shadow-inner bg-red-400">
              
              <svg viewBox="0 0 800 400" className="w-full h-full ">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0" stopColor="#dff7e3" />
                    <stop offset="1" stopColor="#bdf0c9" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#g1)" />
                <g>
                  <motion.rect animate={{ x: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity }} x="60" y="240" width="600" height="80" rx="6" fill="#8fd28f" opacity="0.9" />
                  <motion.circle animate={{ cy: [220, 210, 220] }} transition={{ duration: 4, repeat: Infinity }} cx="120" cy="220" r="30" fill="#ffebc2" opacity="0.6" />
                </g>
              </svg>
            </div>
          </motion.div> */}
        </div>
      </header>

      {/* Courses grid */}
      <main className="max-w-6xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-green-900">Courses</h2>
          <div className="text-sm text-green-700">Showing {filtered.length} of {courses.length}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(course => (
            <motion.article key={course.id} whileHover={{ y: -6 }} className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden border">
              <div className="h-44 bg-gray-100 overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-green-900">{course.title}</h3>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${course.price===0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{course.tag}</div>
                    <div className="text-sm text-gray-500">{course.duration}</div>
                  </div>
                </div>

                <p className="mt-2 text-gray-700 text-sm">{course.desc}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelected(course)} className="px-3 py-2 rounded-md bg-green-600 text-white text-sm shadow">View</button>
                    <button className="px-3 py-2 rounded-md bg-white border text-sm">Syllabus</button>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold">{course.price===0 ? 'Free' : `₹${course.price}`}</div>
                    <div className="text-xs text-gray-500">Enroll</div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow text-center text-gray-600">No courses found. Try different keywords or clear filters.</div>
        )}
      </main>

      {/* Course details modal */}
      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />

            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.25 }} className="relative max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="md:col-span-1 h-48 md:h-auto">
                  <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 md:col-span-2">
                  <h3 className="text-2xl font-bold text-green-900">{selected.title}</h3>
                  <p className="mt-3 text-gray-700">{selected.desc}</p>

                  <ul className="mt-4 space-y-2 text-sm text-gray-700">
                    <li><strong>Duration:</strong> {selected.duration}</li>
                    <li><strong>Price:</strong> {selected.price===0 ? 'Free' : `₹${selected.price}`}</li>
                    <li><strong>Level:</strong> Beginner - Intermediate</li>
                  </ul>

                  <div className="mt-6 flex gap-3">
                    <button className="px-4 py-2 rounded-md bg-green-600 text-white">Enroll Now</button>
                    <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-md bg-white border">Close</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-12 text-center text-sm text-green-700">
        Built with ❤️ for farmers & learners. © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
