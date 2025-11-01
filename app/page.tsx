'use client';

import { useEffect, useState } from "react";
import { B_Plus_Tree, Property } from "./B_Tree";
import { parse } from 'csv-parse';

function PropertyView( {property}: {property: Property} ){
  // Very basic property card.
  return(
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-gray-200 p-4 m-4 dark:bg-gray-900">
      {property.address != "" && <h1 className="font-bold text-3xl mb-2">{property.address}</h1>}
      {property.address == "" && <h1 className="font-bold text-3xl mb-2">NO ADDRESS</h1>}

      {!isNaN(property.land_size) && <p className="text-gray-700 text-xl dark:text-gray-300">Size: {property.land_size} ft^2</p>}
      {!isNaN(property.price) && <p className="text-gray-700 text-xl dark:text-gray-300">Price: ${property.price}</p>}
      {!isNaN(property.land_value) && <p className="text-gray-700 text-xl dark:text-gray-300">Land Value: ${property.land_value}</p>}
      {!isNaN(property.sale_value) && <p className="text-gray-700 text-xl dark:text-gray-300">Sale Value: ${property.sale_value}</p>}
    </div>
  )
}

interface AssessorRecord {
    PHY_ADDR1: string;
    LND_SQFOOT: number;
    LND_VAL: number;
    AV_NSD: number;
    JV: number;
}

function GetData(filePath: string)
{
  const [bPlus, setBPlus] = useState<B_Plus_Tree>(new B_Plus_Tree(1000));
  let startTime = performance.now();
  useEffect(() => {
    let hi: B_Plus_Tree = new B_Plus_Tree(10000);
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
        for(let i: number = 0; i < data.length; i++){
            let property: Property = new Property(data[i].PHY_ADDR1, Number(data[i].AV_NSD), Number(data[i].LND_VAL), Number(data[i].LND_SQFOOT), Number(data[i].JV));
            hi.insert(property);
        }
        setBPlus(hi);
        loaded = true;
        let endTime = performance.now();
        bCreatePerf = endTime - startTime;
    });

  }, []);
  return bPlus;
}

function FilterData(mP: number, mS: number, bP: B_Plus_Tree){
  let startTime = performance.now();
  let bArr = bP.filter(mP, mS);
  maxPage = Math.ceil(bArr.length / 100);
  let endTime = performance.now();
  bFilterPerf = endTime - startTime;
  return bArr
}

let loaded = false;

let minPrice: number = 0;
let minSize: number = 0;

let bCreatePerf: number = 0;
let bFilterPerf: number = 0;

let maxPage: number = 1;

export default function Home() {
  const [properties, setProperties ] = useState<Property[]>([]);
  const [currPage, setCurrPage ] = useState(0);
  const [mPage, setMPage ] = useState(1);

  const [isLoading, setLoading] = useState(true);
  const [bCPerf, setBCPerf] = useState(0);
  const [bFPerf, setBFPerf] = useState(0);
  const [propAvgPrice, setPropAvgPrice] = useState(BigInt(0));
  const [propAvgSize, setPropAvgSize] = useState(BigInt(0));
  
  let bPlus = GetData('./NAL11F202501.csv');
  if(loaded && isLoading) 
    { 
      setLoading(false); 
      setProperties(FilterData(0, 0, bPlus));
      setCurrPage(0); 
      setMPage(maxPage);
      setBCPerf(bCreatePerf / 1000);
      setPropAvgPrice(bPlus.get_price_average());
      setPropAvgSize(bPlus.get_land_average());
    }

  return (
    <div>
      <header className="flex items-center justify-center">
        <h1 className="center max-w-m p-8 text-6xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">Property Aggregator</h1>
      </header>
      <div className="flex">
        <div className="flex items-center w-1/4 bg-zinc-100 font-sans dark:bg-zinc-900 p-10">
          <div>
            <h1 className="max-w-m text-4xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">Stats</h1>
            <p><b>B+ Creation Time: </b>{bCPerf} s</p>
            <p><b>B+ Filter Time: </b>{bFPerf} ms</p>
            <p><b>Average Price: </b>${propAvgPrice}</p>
            <p><b>Average Size: </b>{propAvgSize} ft^2</p>
            { /* TODO - Turn the input box to a slider? */ }
            <h1 className="max-w-m text-4xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">Filters</h1>
            <p className="my-2"><b>Minimum Price: </b></p><input type="number" defaultValue={0} onChange={(event) => minPrice = parseInt(event.target.value)} name="minPriceBox" className="bg-white dark:bg-zinc-700"></input>
            <p className="my-2"><b>Minimum Size: </b></p><input type="number" defaultValue={0} onChange={(event) => minSize = parseInt(event.target.value)} name="minSizeBox" className="bg-white dark:bg-zinc-700"></input>
            <br></br>
            <button type="button" onClick={() => {setProperties(FilterData(minPrice, minSize, bPlus)); setCurrPage(0); setMPage(maxPage); setBFPerf(bFilterPerf); setPropAvgPrice(bPlus.get_price_average()); setPropAvgSize(bPlus.get_land_average()); }}className="rounded-xl my-2 p-4 px-8 bg-gray-200 text-black dark:text-zinc-50 dark:bg-gray-500">Filter</button>
            <br></br>
            <div className="flex flex-nowrap items-center">
              <button type="button" onClick={() => {if(currPage > 0){ setCurrPage(currPage - 1) }}}className="rounded-xl my-2 p-2 px-8 mr-2 bg-gray-200 text-black dark:text-zinc-50 dark:bg-gray-500">&lt;</button>
              <p>{currPage + 1}/{mPage}</p>
              <button type="button" onClick={() => {if(currPage < (mPage - 1)){ setCurrPage(currPage + 1) }}}className="rounded-xl my-2 p-2 px-8 ml-2 bg-gray-200 text-black dark:text-zinc-50 dark:bg-gray-500">&gt;</button>
            </div>
          </div>
        </div>
        <div className="flex w-3/4 min-h-[calc(100vh-104px)] overflow-y-auto items-center justify-center bg-zinc-50 font-sans dark:bg-black">
          <main className="grid grid-cols-3 max-h-[calc(100vh-104px)]">
            {/* TODO - Placeholders until we can map our created data types. */}
            {isLoading && <h1>Loading...</h1>}
            {properties.filter((item, index) => {return (index <= ((currPage + 1) * 100) && index >= (currPage * 100)) }).map((p, i) => (<PropertyView key={i} property={p}/>))}
          </main>
        </div>
      </div>
    </div>
  );
}
