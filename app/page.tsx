import { Forward, ChevronRight, ArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/componenets/cart/ProductCard";
import { getAllProducts, Product } from "@/lib/productApi";

const HomePage = async () => {
  const products = await getAllProducts();

  const featuredProducts = products.slice(0, 4);

  return (
    <main>
      {/* Hero Section Container */}
      <div className="relative h-[calc(100vh-88px)] w-full">
        <Image
          src="/images/hero.png" // The path starts from the 'public' folder
          alt="A vibrant display of products available at the store."
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 " />

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
            className="mt-8 bg-white text-black font-semibold text-sm px-6 py-3  w-[150px] h-[47px] hover:bg-[#01589a] hover:text-white transition-colors flex items-center justify-center"
          >
            Shop Now
            <ChevronRight className="inline-block mr-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Top trending product */}
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-[42px] font-semibold text-black">
          Top Trending Products
        </h2>
        <p className="text-center mt-2 text-[14px]">
          Discover the latest must-have items that are taking the market by
          storm. Stay ahead with our curated collection
          <br /> of trending products designed to elevate your lifestyle.
        </p>
        <div>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
              {featuredProducts.map((product: Product) => (
                <div
                  key={product.id}
                  className="bg-[#f9fbfc] rounded-lg p-6 flex flex-col items-center text-center shadow-md transition-shadow hover:shadow-xl"
                >
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <h2 className="text-lg font-bold text-black  flex-grow">
                    {product.name}
                  </h2>
                  <Link
                    href="/shop"
                    className="mt-4  text-black underline font-semibold px-5 py-2 rounded-lg hover:text-[#01589A] transition-colors"
                  >
                    <div className="flex">
                      Show More
                      {/* <ArrowUp size={18} className="mt-0.5" /> */}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No products found. Please check your Supabase table for data.
            </p>
          )}
        </div>
      </div>

      {/* we are tackling */}
      <div className=" mx-auto py-16 mt-30">
        <div className="bg-[#01589A] p-8   h-[458px] ">
          <h1 className="text-white text-[42px] container mt-4">
            We're tackling the biggest challenges in laptops
            <br /> and electronic products.text-white
          </h1>
          <div className="flex flex-row  items-center justify-between">
            <div className="w-[423px] h-[161px] flex flex-col justify-center items-center mt-8">
              <Image
                src="/images/w1.png"
                alt="we are tackling"
                width={55}
                height={55}
                className="mt-8"
              />
              <h2 className="font-semibold text-white">
                Fast and free shipping
              </h2>
              <p className="text-white text-center text-[14px] mt-2">
                Every single order ships for free. No minimums, no tiers, no
                fine print whatsoever.
              </p>
            </div>
            {/* w2 */}
            <div className="w-[423px] h-[161px] flex flex-col justify-center items-center mt-8">
              <Image
                src="/images/w2.png"
                alt="we are tackling"
                width={55}
                height={55}
                className="mt-8"
              />
              <h2 className="font-semibold text-white">
                Fast and free shipping
              </h2>
              <p className="text-white text-center text-[14px] mt-2">
                Our cutting-edge designs prioritize performance
                <br />, portability, and seamless integration into your
                lifestyle.
              </p>
            </div>

            {/* w3 */}
            <div className="w-[423px] h-[161px] flex flex-col justify-center items-center mt-8">
              <Image
                src="/images/w3.png"
                alt="we are tackling"
                width={55}
                height={55}
                className="mt-8"
              />
              <h2 className="font-semibold text-white">
                Fast and free shipping
              </h2>
              <p className="text-white text-center text-[14px] mt-2">
                We use premium aluminum, high-resolution OLED
                <br /> displays, and durable batteries for superior quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default HomePage;
