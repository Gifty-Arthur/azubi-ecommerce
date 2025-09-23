// app/page.tsx

// 1. Import the necessary tools for creating a server client
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// 2. Correct the import path to match the file in your Canvas
import { getAllProducts, Product } from "@/lib/productApi";

const HomePage = async () => {
  // 3. Create a Supabase client specifically for Server Components
  const cookieStore = cookies();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    // No options needed for cookies here
  );

  // 4. CRITICAL FIX: Pass the 'supabase' client instance to your function
  const products = await getAllProducts(supabase);

  // Your existing logic for featured products
  const featuredProducts = products.slice(0, 4);

  return (
    <main>
      {/* Hero Section Container */}
      <div className="relative h-[calc(100vh-88px)] w-full">
        <Image
          src="/images/main.png" // The path starts from the 'public' folder
          alt="A vibrant display of products available at the store."
          fill
          priority
          className="object-cover"
        />
        {/* Added a semi-transparent overlay for text readability */}
        <div className="relative z-10 flex h-full flex-col justify-center text-white container px-8 md:px-14">
          <div>
            <h1 className="text-5xl md:text-[80px] font-bold">
              Next-Gen <br />
              Mobility
            </h1>
            <p className="text-[14px] font-bold mt-4">
              Power, performance, and style - experience the future of
              smartphones today.
            </p>
          </div>
          <Link
            href="/shop"
            className="mt-8 bg-white text-black font-semibold text-sm px-6 py-3 w-[150px] h-[47px] hover:bg-[#01589a] hover:text-white transition-colors flex items-center justify-center"
          >
            <span>Shop Now</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Top trending product */}
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-[42px] font-semibold text-black">
          Top Trending Products
        </h2>
        <p className="text-center mt-2 text-[14px] text-gray-600">
          Discover the latest must-have items that are taking the market by
          storm. Stay ahead with our curated collection
          <br /> of trending products designed to elevate your lifestyle.
        </p>
        <div className="mt-12">
          {" "}
          {/* Added margin-top for spacing */}
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product: Product) => (
                <div
                  key={product.id}
                  className="bg-gray-50 rounded-lg p-6 flex flex-col items-center text-center shadow-md transition-shadow hover:shadow-xl"
                >
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={product.image_url || "/images/placeholder.png"} // Added a fallback image
                      alt={product.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <h2 className="text-lg font-bold text-black flex-grow">
                    {product.name}
                  </h2>
                  <Link
                    href={`/product/${product.id}`} // Link to the specific product details page
                    className="mt-4 text-black underline font-semibold px-5 py-2 rounded-lg hover:text-[#01589A] transition-colors"
                  >
                    <div className="flex">Show More</div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">
              No products found. Please check your Supabase table for data.
            </p>
          )}
        </div>
      </div>

      {/* we are tackling */}
      <div className="mx-auto py-16">
        <div className="bg-[#01589A] p-8 min-h-[458px] flex flex-col justify-center">
          <h1 className="text-white text-[42px] container mt-4 text-center md:text-left">
            We're tackling the biggest challenges in laptops
            <br /> and electronic products.
          </h1>
          <div className="container flex flex-col md:flex-row items-center justify-between gap-8 mt-8">
            <div className="w-full md:w-1/3 flex flex-col justify-center items-center">
              <Image
                src="/images/w1.png"
                alt="Fast and free shipping icon"
                width={55}
                height={55}
              />
              <h2 className="font-semibold text-white mt-4">
                Fast and free shipping
              </h2>
              <p className="text-white text-center text-[14px] mt-2">
                Every single order ships for free. No minimums, no tiers, no
                fine print whatsoever.
              </p>
            </div>
            <div className="w-full md:w-1/3 flex flex-col justify-center items-center">
              <Image
                src="/images/w2.png"
                alt="Innovative design icon"
                width={55}
                height={55}
              />
              <h2 className="font-semibold text-white mt-4">
                Innovative, User-Centric Design
              </h2>
              <p className="text-white text-center text-[14px] mt-2">
                Our cutting-edge designs prioritize performance, portability,
                and seamless integration into your lifestyle.
              </p>
            </div>
            <div className="w-full md:w-1/3 flex flex-col justify-center items-center">
              <Image
                src="/images/w3.png"
                alt="Durable materials icon"
                width={55}
                height={55}
              />
              <h2 className="font-semibold text-white mt-4">
                Durable, High-Quality Materials
              </h2>
              <p className="text-white text-center text-[14px] mt-2">
                We use premium aluminum, high-resolution OLED displays, and
                durable batteries for superior quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default HomePage;
