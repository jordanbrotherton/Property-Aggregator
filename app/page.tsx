import Image from "next/image";

function PropertyView({address, size, price}){
  // Very basic property card.
  return(
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-gray-200 p-4 m-4 dark:bg-gray-900">
      <h1 className="font-bold text-3xl mb-2">{address}</h1>
      <p className="text-gray-700 text-xl dark:text-gray-300">Size: {size} ft^2</p>
      <p className="text-gray-700 text-xl dark:text-gray-300">Price: ${price}</p>
    </div>
  )
}

export default function Home() {
  return (
    <div>
      <header className="flex items-center justify-center">
        <h1 className="center max-w-m p-8 text-6xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">Property Aggregator</h1>
      </header>
      { /* TODO - Add filters sidebar */ }
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main>
          {/* TODO - Placeholders until we can map our created data types. */}
          <PropertyView address="123 Testing Lane" size={1234.12}  price={4000.00} />
          <PropertyView address="124 Testing Lane" size={1213.12}  price={3000.00} />
          <PropertyView address="125 Testing Lane" size={1221.12}  price={5000.00} />
        </main>
      </div>
    </div>
  );
}
