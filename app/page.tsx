'use client';

import { useEffect, useState } from "react";
import { B_Plus_Tree } from "./B_Tree";
import { MaxHeap } from "./pQueue";
import { Property } from './property';
import { parse } from 'csv-parse';

function PropertyView({ property }: { property: Property }) {
  /* 
    A basic property view card.
    Has an anchor to a Google Maps search.
  */
  return (
    <a href={"https://www.google.com/maps/search/?api=1&query=" + property.address.replaceAll(" ", "+")} target="_blank" className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-gray-200 p-4 m-4 dark:bg-gray-900">
      <div>
        {property.address != "" && <h1 className="font-bold text-3xl mb-2">{property.address}</h1>}
        {property.address == "" && <h1 className="font-bold text-3xl mb-2">NO ADDRESS</h1>}

        {!isNaN(property.land_size) && <p className="text-gray-700 text-xl dark:text-gray-300">Size: {property.land_size.toLocaleString()} ft^2</p>}
        {!isNaN(property.price) && <p className="text-gray-700 text-xl dark:text-gray-300">Price: ${property.price.toLocaleString()}</p>}
        {!isNaN(property.land_value) && <p className="text-gray-700 text-xl dark:text-gray-300">Land Value: ${property.land_value.toLocaleString()}</p>}
        {!isNaN(property.sale_value) && <p className="text-gray-700 text-xl dark:text-gray-300">Sale Value: ${property.sale_value.toLocaleString()}</p>}
      </div>
    </a>
  )
}

// Interface for CSV parsing.
interface AssessorRecord {
  PHY_ADDR1: string;
  LND_SQFOOT: number;
  LND_VAL: number;
  AV_NSD: number;
  JV: number;
}

function GetData(filePath: string) {
  const [bPlus, setBPlus] = useState<B_Plus_Tree>(new B_Plus_Tree(1000));
  const [heap, setHeap] = useState<MaxHeap>(new MaxHeap());

  let startTime = performance.now();

  useEffect(() => {
    let bPlusTree: B_Plus_Tree = new B_Plus_Tree(10000);
    let maxHeap: MaxHeap = new MaxHeap();

    async function readCsvFile(filePath: string): Promise<AssessorRecord[]> {
      const records: AssessorRecord[] = [];

      const data = await (await fetch(filePath)).text();
      const parser = parse(data, {
        columns: true,
        skip_empty_lines: true,
      });

      for await (const record of parser) {
        records.push(record as AssessorRecord);
      }
      
      return records;
    }

    readCsvFile(filePath).then(data => {
      console.log(`Parsed ${data.length} records.`);

      /* 
      Ideally these would be in one statement, 
      but to compare performance times, they're separated into two loops.
      */

      // Creating B+ Tree
      startTime = performance.now();
      for (let i: number = 0; i < data.length; i++) {
        let property: Property = new Property(data[i].PHY_ADDR1, Number(data[i].AV_NSD), Number(data[i].LND_VAL), Number(data[i].LND_SQFOOT), Number(data[i].JV));
        bPlusTree.insert(property);
      }
      setBPlus(bPlusTree);
      let endTime = performance.now();
      bCreatePerf = endTime - startTime;

      // Creating Max Heap
      startTime = performance.now();
      for (let i: number = 0; i < data.length; i++) {
        let property: Property = new Property(data[i].PHY_ADDR1, Number(data[i].AV_NSD), Number(data[i].LND_VAL), Number(data[i].LND_SQFOOT), Number(data[i].JV));
        maxHeap.insert(property);
      }
      setHeap(maxHeap);
      endTime = performance.now();
      hCreatePerf = endTime - startTime;

      loaded = true;
    });

  }, []);
  return [bPlus, heap];
}

function FilterData(minimumPrice: number, minimumSize: number, structsArray: Array<B_Plus_Tree | MaxHeap>, usingBPlus: boolean) {
  let startTime = performance.now();

  let tree = structsArray[0];
  if (!usingBPlus) { tree = structsArray[1] }

  let filteredArray = tree.filter(minimumPrice, minimumSize);

  maxPage = Math.ceil(filteredArray.length / 90);
  avgPrice = tree.get_price_average();
  avgSize = tree.get_land_average();

  let endTime = performance.now();

  console.log(`Filter finished: Obtained ${filteredArray.length} records in a total of ${maxPage} pages.`);

  if (usingBPlus) {
    bFilterPerf = endTime - startTime;
  } else {
    hFilterPerf = endTime - startTime;
  }

  return filteredArray
}

let loaded = false;

let minPrice: number = 0;
let minSize: number = 0;

let avgPrice: bigint = BigInt(0);
let avgSize: bigint = BigInt(0);

let bCreatePerf: number = 0;
let bFilterPerf: number = 0;

let hCreatePerf: number = 0;
let hFilterPerf: number = 0;

let maxPage: number = 1;

export default function Home() {
  function UpdateFilter(){
    setProperties(FilterData(minPrice, minSize, structs, usingBPlus)); 
    setCurrPage(0); 
    setMPage(maxPage); 
    setBFPerf(bFilterPerf); 
    setHFPerf(hFilterPerf); 
    setPropAvgPrice(avgPrice); 
    setPropAvgSize(avgSize); 
  }

  const [properties, setProperties] = useState<Property[]>([]);
  const [currPage, setCurrPage] = useState(0);
  const [mPage, setMPage] = useState(1);
  const [usingBPlus, setUsingBPlus] = useState(true);

  const [isLoading, setLoading] = useState(true);

  const [bCPerf, setBCPerf] = useState(0);
  const [bFPerf, setBFPerf] = useState(0);

  const [hCPerf, setHCPerf] = useState(0);
  const [hFPerf, setHFPerf] = useState(0);

  const [propAvgPrice, setPropAvgPrice] = useState(BigInt(0));
  const [propAvgSize, setPropAvgSize] = useState(BigInt(0));

  let structs = GetData('./NAL11F202501.csv');

  // Initializes variables with a default filter of 0,0.
  if (loaded && isLoading) {
    setLoading(false);
    setBCPerf(bCreatePerf);
    setHCPerf(hCreatePerf);

    UpdateFilter();
  }

  return (
    <div>
      <header className="flex items-center justify-center">
        <h1 className="center max-w-m p-8 text-6xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">Property Aggregator</h1>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="flex items-center justify-center w-1/5 bg-zinc-100 font-sans dark:bg-zinc-900 p-10">
          <div>
            {/* Stats View */ }
            <h1 className="max-w-m text-4xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">Stats</h1>
            
            <hr className="my-1 border-gray-800 dark:border-gray-200" />
            
            <p><b>B+ Creation Time: </b>{bCPerf.toLocaleString()} ms</p>
            <p><b>B+ Filter Time: </b>{bFPerf.toLocaleString()} ms</p>
            
            <hr className="my-2 border-gray-800 dark:border-gray-200" />
            
            <p><b>Heap Creation Time: </b>{hCPerf.toLocaleString()} ms</p>
            <p><b>Heap Filter Time: </b>{hFPerf.toLocaleString()} ms</p>
            
            <hr className="my-2 border-gray-800 dark:border-gray-200" />
            
            <p><b>Average Price: </b>${propAvgPrice.toLocaleString()}</p>
            <p><b>Average Size: </b>{propAvgSize.toLocaleString()} ft^2</p>

            <hr className="my-4 border-0" />

            {/* Filters View */ }
            <h1 className="max-w-m text-4xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">Filters</h1>
            
            <hr className="my-1 border-gray-800 dark:border-gray-200" />
            
            <button type="button" onClick={() => { setUsingBPlus(!usingBPlus) }} className="rounded-xl my-2 p-4 px-8 bg-gray-200 text-black dark:text-zinc-50 dark:bg-gray-500">{usingBPlus && "Switch to Heap"}{!usingBPlus && "Switch to B+"}</button>
            
            <hr className="my-2 border-gray-800 dark:border-gray-200" />
            
            <p className="my-2"><b>Minimum Price: </b></p><input type="number" defaultValue={0} onChange={(event) => minPrice = parseInt(event.target.value)} name="minPriceBox" className="bg-white dark:bg-zinc-700"></input>
            <p className="my-2"><b>Minimum Size: </b></p><input type="number" defaultValue={0} onChange={(event) => minSize = parseInt(event.target.value)} name="minSizeBox" className="bg-white dark:bg-zinc-700"></input>
            
            <hr className="my-2 border-gray-800 dark:border-gray-200" />
            
            <button type="button" onClick={() => { UpdateFilter() }} className="rounded-xl my-2 p-4 px-8 bg-gray-200 text-black dark:text-zinc-50 dark:bg-gray-500">Filter</button>
            
            <hr className="my-2 border-gray-800 dark:border-gray-200" />

            <div className="flex flex-nowrap items-center">
              <button type="button" onClick={() => { if (currPage > 0) { setCurrPage(currPage - 1) } }} className="rounded-xl my-2 p-2 px-8 mr-2 bg-gray-200 text-black dark:text-zinc-50 dark:bg-gray-500">&lt;</button>
              <p>{currPage + 1}/{mPage}</p>
              <button type="button" onClick={() => { if (currPage < (mPage - 1)) { setCurrPage(currPage + 1) } }} className="rounded-xl my-2 p-2 px-8 ml-2 bg-gray-200 text-black dark:text-zinc-50 dark:bg-gray-500">&gt;</button>
            </div>
          </div>
        </div>

        {/* Properties View */}
        <div className="flex w-4/5 min-h-[calc(100vh-104px)] overflow-y-auto items-center justify-center bg-zinc-50 font-sans dark:bg-black">
          {isLoading && <h1 className="font-bold text-5xl mx-auto">Loading...</h1>}
          <main className="grid grid-cols-3 max-h-[calc(100vh-104px)]">
            {properties.filter((item, index) => { return (index < ((currPage + 1) * 90) && index >= (currPage * 90)) }).map((p, i) => (<PropertyView key={i} property={p} />))}
          </main>
        </div>
      </div>
    </div>
  );
}
