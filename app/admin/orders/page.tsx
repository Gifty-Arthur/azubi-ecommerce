"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import { getAllOrdersWithDetails, Order } from "@/lib/supabase/AdminOrder";
import { EyeClosed } from "lucide-react";

// --- Helper Components ---

const StatusBadge = ({
  text,
  type,
}: {
  text: string;
  type: "success" | "pending" | "default";
}) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
  const typeClasses = {
    success: "bg-green-100 text-green-800",
    pending: "bg-pink-100 text-pink-800",
    default: "bg-gray-100 text-gray-800",
  };
  return <span className={`${baseClasses} ${typeClasses[type]}`}>{text}</span>;
};

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    <path
      fillRule="evenodd"
      d="M.664 10.59a1.651 1.651 0 010-1.18l.88-1.84a1.65 1.65 0 011.531-1.043h.032a1.65 1.65 0 001.518-1.044l.88-1.839a1.65 1.65 0 011.532-1.044h.093a1.65 1.65 0 011.532 1.044l.88 1.84a1.65 1.65 0 001.518 1.043h.032a1.65 1.65 0 011.531 1.043l.88 1.84a1.651 1.651 0 010 1.18l-.88 1.84a1.65 1.65 0 01-1.531 1.043h-.032a1.65 1.65 0 00-1.518-1.044l-.88 1.839a1.65 1.65 0 01-1.532-1.044h-.093a1.65 1.65 0 01-1.532-1.044l-.88-1.84a1.65 1.65 0 00-1.518-1.043h-.032a1.65 1.65 0 01-1.531-1.043l-.88-1.839z"
      clipRule="evenodd"
    />
  </svg>
);

export default function OrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // You might need to add an auth check here like in the categories page
        const data = await getAllOrdersWithDetails(supabase);
        setOrders(data);
      } catch (err) {
        setError("Failed to fetch orders.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [supabase]);

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-7xl mx-auto">
        <div className="mb-4">
          <Link
            href="/admin"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Link>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

          <div className="overflow-x-auto">
            {isLoading ? (
              <p className="text-center text-gray-500 py-8">
                Loading orders...
              </p>
            ) : error ? (
              <p className="text-center text-red-500 py-8">{error}</p>
            ) : orders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No orders found.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Id
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Paid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Delivered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => {
                    const products = order.order_items?.[0]?.products;
                    const firstItemImage = Array.isArray(products)
                      ? (products[0] as any)?.image_url
                      : (products as any)?.image_url;

                    // compute total from order_items: sum of (product price * quantity)
                    const total =
                      order.order_items?.reduce((sum, item) => {
                        // product info might be an array or an object depending on your join shape
                        const prod = Array.isArray(item.products)
                          ? (item.products[0] as any)
                          : (item.products as any);
                        const price = (prod?.price as number) ?? 0;
                        const quantity = (item?.quantity as number) ?? 1;
                        return sum + price * quantity;
                      }, 0) ?? 0;

                    // normalize delivered flag from possible shapes without relying on Order type
                    const delivered = Boolean(
                      (order as any).is_delivered ??
                        (order as any).delivered ??
                        (order as any).delivered_at ??
                        false
                    );

                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={
                              firstItemImage ||
                              "https://placehold.co/40x40/e2e8f0/adb5bd?text=N/A"
                            }
                            alt="Product"
                          />
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 truncate"
                          style={{ maxWidth: "150px" }}
                        >
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          ${total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {order.is_paid ? (
                            <StatusBadge text="Completed" type="success" />
                          ) : (
                            <StatusBadge text="No" type="default" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <StatusBadge
                            text={delivered ? "Delivered" : "Pending"}
                            type={delivered ? "success" : "pending"}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <EyeClosed />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
