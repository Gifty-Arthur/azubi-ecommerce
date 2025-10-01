import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; // Import the Link component
import * as AdminOrder from "@/lib/supabase/AdminOrder";

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
const supabaseKey =
  typeof window === "undefined"
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// This is a Server Component that fetches data
export default async function OrderDetailsPage({
  params,
}: {
  params: { orderId: string };
}) {
  const getOrderFn =
    (AdminOrder as any).getOrderById ??
    (AdminOrder as any).getOrder ??
    (AdminOrder as any).default;

  if (!getOrderFn) {
    throw new Error(
      "No suitable getOrder function exported from @/lib/supabase/AdminOrder"
    );
  }

  const order = await getOrderFn(params.orderId);

  if (!order) {
    notFound();
  }

  const itemsSubtotal = order.order_items.reduce(
    (acc: number, item: { price: number; quantity: number }) => {
      return acc + item.price * item.quantity;
    },
    0
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ✨ CHANGED: Use a Link component to navigate back */}
        <Link
          href="/admin/orders" // Adjust this URL to your main orders list page
          className="text-gray-600 hover:text-gray-900 mb-6 font-medium inline-block"
        >
          &larr; Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Order Items */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Order details
            </h1>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                {/* Table Head */}
                <thead>
                  <tr className="text-sm font-semibold text-gray-500 border-b">
                    <th className="py-3 pr-4">Image</th>
                    <th className="py-3 pr-4">Product</th>
                    <th className="py-3 pr-4 text-center">Quantity</th>
                    <th className="py-3 pr-4 text-right">Unit Price</th>
                    <th className="py-3 pl-4 text-right">Total</th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody>
                  {order.order_items.map(
                    (
                      item: {
                        products?: {
                          image_url?: string;
                          product_name?: string;
                        };
                        price: number;
                        quantity: number;
                      },
                      index: number
                    ) => (
                      <tr key={index} className="border-b">
                        <td className="py-4 pr-4">
                          <Image
                            src={item.products?.image_url || "/placeholder.png"}
                            alt={item.products?.product_name || "Product Image"}
                            width={64}
                            height={64}
                            className="rounded-md object-cover w-16 h-16"
                          />
                        </td>
                        <td className="py-4 pr-4 font-medium text-gray-800">
                          {item.products?.product_name ||
                            "Product Name Missing"}
                        </td>
                        <td className="py-4 pr-4 text-center">
                          {item.quantity}
                        </td>
                        <td className="py-4 pr-4 text-right">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="py-4 pl-4 text-right font-semibold">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Shipping & Summary */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Shipping Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Shipping</h2>
              <div className="space-y-3 text-sm">
                <p>
                  <strong className="text-gray-600 w-20 inline-block">
                    Order:
                  </strong>
                  {order.id}
                </p>
                <p>
                  <strong className="text-gray-600 w-20 inline-block">
                    Name:
                  </strong>
                  {order.profiles?.full_name}
                </p>
                <p>
                  <strong className="text-gray-600 w-20 inline-block">
                    Email:
                  </strong>
                  {order.profiles?.email}
                </p>
                <p>
                  <strong className="text-gray-600 w-20 inline-block">
                    Order:
                  </strong>
                  {order.order_code}
                </p>
                <p>
                  <strong className="text-gray-600 w-20 inline-block">
                    Method:
                  </strong>
                  {order.payment_method}
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">
                    {formatCurrency(itemsSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">
                    {formatCurrency(order.shipping_cost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">
                    {formatCurrency(order.tax)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-3 mt-3">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Mark as delivered
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
