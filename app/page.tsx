'use client';
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
      <div className="flex">
        <div className="flex items-center w-1/4 bg-zinc-100 font-sans dark:bg-zinc-900 p-10">
          <div>
            <h1 className="max-w-m text-4xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">Stats</h1>
            <p><b>Average Size:</b> TEMP SQFT</p>
            <p><b>Average Price:</b> $TEMP</p>
            { /* TODO - Turn the input box to a slider? */ }
            <h1 className="max-w-m text-4xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">Filters</h1>
              <p>
                <b>Filter Options:</b>
                <br></br>
                <label>
                  <input type="radio" name="minToggle" value="minPriceToggle" />
                  Minimum Price
                </label>
                <br></br>
                <label>
                  <input type="radio" name="minToggle" value="minSizeToggle" />
                  Minimum Land Size
                </label>
            </p>
            <p className="my-2"><b>Minimum Value: </b></p><input type="number" name="minValueBox" className="bg-white dark:bg-zinc-700"></input>
            <br></br>
            <button type="button" onClick={() => window.alert("Filtered!")}className="rounded-xl my-2 p-4 px-8 bg-gray-200 text-black dark:text-zinc-50 dark:bg-gray-500">Filter</button>
          </div>
        </div>
        <div className="flex w-3/4 min-h-[calc(100vh-104px)] items-center justify-center bg-zinc-50 font-sans dark:bg-black">
          <main>
            {/* TODO - Placeholders until we can map our created data types. */}
            <PropertyView address="123 Testing Lane" size={1234.12}  price={4000.00} />
            <PropertyView address="124 Testing Lane" size={1213.12}  price={3000.00} />
            <PropertyView address="125 Testing Lane" size={1221.12}  price={5000.00} />
          </main>
        </div>
      </div>
    </div>
  );
}
