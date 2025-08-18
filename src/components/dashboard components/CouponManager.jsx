import React, { useState } from "react";
import { Trash2, Plus, ToggleLeft, ToggleRight } from "lucide-react";

export default function CouponManager() {
  // Initial state
  const [coupons, setCoupons] = useState([
    { id: 1, code: "WELCOME10", discount: "10%", active: true },
    { id: 2, code: "STUDENT20", discount: "20%", active: false },
  ]);

  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");

  // Add new coupon
  const addCoupon = () => {
    if (!newCode || !newDiscount) return alert("Fill all fields!");
    const newCoupon = {
      id: Date.now(),
      code: newCode,
      discount: newDiscount,
      active: true, // default active
    };
    setCoupons([...coupons, newCoupon]);
    setNewCode("");
    setNewDiscount("");
  };

  // Delete coupon
  const deleteCoupon = (id) => {
    setCoupons(coupons.filter((coupon) => coupon.id !== id));
  };

  // Toggle active/inactive
  const toggleCoupon = (id) => {
    setCoupons(
      coupons.map((coupon) =>
        coupon.id === id ? { ...coupon, active: !coupon.active } : coupon
      )
    );
  };

  return (
    <div className="p-6 w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6">Coupon Management</h2>

      {/* Create Coupon Form */}
      <div className="bg-white p-5 rounded-2xl shadow-lg border mb-6">
        <h3 className="font-semibold mb-3">Create New Coupon</h3>
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            placeholder="Coupon Code"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="border p-2 rounded-lg w-1/2 focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            placeholder="Discount (e.g. 20%)"
            value={newDiscount}
            onChange={(e) => setNewDiscount(e.target.value)}
            className="border p-2 rounded-lg w-1/2 focus:ring-2 focus:ring-green-400"
          />
        </div>
        <button
          onClick={addCoupon}
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 shadow-md"
        >
          <Plus size={18} /> Add Coupon
        </button>
      </div>

      {/* Coupon List */}
      <div>
        <h3 className="font-semibold mb-3">Available Coupons</h3>
        {coupons.length === 0 ? (
          <p className="text-gray-500">No coupons available.</p>
        ) : (
          <div className="grid gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="flex justify-between items-center bg-white rounded-2xl shadow-lg border p-4 hover:shadow-xl transition"
              >
                {/* Coupon Info */}
                <div>
                  <p className="font-bold text-lg">{coupon.code}</p>
                  <p className="text-sm text-gray-500">
                    Discount: {coupon.discount}
                  </p>
                  <span
                    className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      coupon.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {coupon.active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => toggleCoupon(coupon.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {coupon.active ? (
                      <ToggleRight size={36} />
                    ) : (
                      <ToggleLeft size={36} />
                    )}
                  </button>
                  <button
                    onClick={() => deleteCoupon(coupon.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
